import sqlite3
import pandas as pd
from google.cloud import bigquery
from google.oauth2 import service_account
import pandas_gbq
from scipy.spatial import distance
import numpy as np

# Get a dataframe of all the cities at hand, along with their latitude and longitude
conn = sqlite3.connect('../cityDB.sqlite')
cities = pd.read_sql_query("SELECT cid, city, state, lat, lng  FROM cities;", conn)

# Get the coordinates for the cities
cities['coordinates'] = cities.apply(lambda x: (x['lat'], x['lng']), axis=1)

# Get a list of all the stations in the US from NOAA data publicly available on BigQuery
credentials = service_account.Credentials.from_service_account_file('bigquery_key.json')
stations_query = ("""SELECT *
FROM `bigquery-public-data.noaa_gsod.stations`
WHERE country = 'US'""")
stations = pandas_gbq.read_gbq(stations_query,
                               project_id="dva-destination-recommender",
                               credentials=credentials, dialect='standard')

# Remove stations with null values
stations.dropna(axis=0, inplace=True)

# Build the coordinates for the stations
stations['coordinates'] = stations.apply(lambda x: np.array([x.lat, x.lon]), axis=1)

# Get representative weather for the past 5 years for all stations
# Get the monthly weather over the past 5 years for all stations
weather_query = ("""
SELECT stn, wban, mo as month, AVG(temp) as avg_temp, AVG(prcp) as avg_prcp, SUM(CAST(fog AS int64))/5 as avg_nb_foggy_days, 
SUM(CAST(rain_drizzle as int64))/5 as avg_nb_rainy_days, 
SUM(CAST(snow_ice_pellets as int64))/5 as avg_nb_snow_days, SUM(CAST(thunder as int64))/5 as avg_nb_stormy_days
FROM
(SELECT
  *
FROM 
 `bigquery-public-data.noaa_gsod.gsod2018`
UNION ALL
SELECT
  *
FROM 
 `bigquery-public-data.noaa_gsod.gsod2017`
UNION ALL
SELECT
  *
FROM 
 `bigquery-public-data.noaa_gsod.gsod2016`
UNION ALL
SELECT
  *
FROM 
 `bigquery-public-data.noaa_gsod.gsod2015`
UNION ALL
SELECT
  *
FROM 
 `bigquery-public-data.noaa_gsod.gsod2014`) a
 GROUP BY 1,2,3""")

weather = pandas_gbq.read_gbq(weather_query,
                               project_id="dva-destination-recommender",
                               credentials=credentials, dialect='standard')

# Only keep stations for which we have weather info
stations_with_weather = weather.merge(stations, how='inner', left_on=['stn', 'wban'], right_on=['usaf', 'wban'])

# A function to find the closest station for given coordinates
def find_closest_station(city_coord, stations):
    """
    INPUTS:
    city_coord (tuple): a tuple with the coordinates for the city
    stations (NumPy array): an array of coordinates for various stations

    OUTPUT:
    ids (int): the station ID for the closest station to the city, both usaf and wban
    """
    stations_coord = np.array(stations['coordinates'].tolist())
    closest_index = distance.cdist([city_coord], stations_coord).argmin()
    usaf = stations.iloc[closest_index, 0]
    wban = stations.iloc[closest_index, 1]

    ids = str(usaf) + '|' + str(wban)

    return ids

# Find the closest station with weather for each city in the dataframe
closest_stations = []
for row_num in range(len(cities)):
    city_coord = cities.iloc[row_num].coordinates
    closest_stations.append(find_closest_station(city_coord, stations_with_weather))

# Need both usaf and wban to uniquely identify stations
cities['closest_station'] = closest_stations
cities[['closest_station_usaf', 'closest_station_wban']] = cities['closest_station'].str.split('|', expand=True)

# Append weather information to the cities
city_monthly_weather = cities.merge(stations_with_weather,
                                    how='left',
                                    left_on=['closest_station_wban', 'closest_station_usaf'],
                                    right_on=['wban', 'stn'])

# Drop unecessary columns and columns with unsupported types in sqlite
city_monthly_weather.drop(labels=['usaf', 'name', 'country', 'state_y', 'coordinates_x',
                                 'call', 'lat_y', 'lon', 'elev', 'begin', 'end', 'coordinates_y', 'stn', 'wban'],
                          inplace=True, axis=1)

# Rename columns
city_monthly_weather.rename(axis=1, mapper={'state_x': 'state', 'lat_x': 'lat', 'lng': 'lon'}, inplace=True)

# Store in the sqlite DB
city_monthly_weather.to_sql('city_weather', conn, if_exists='replace')
conn.close()