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

# Find the closest station for each city in the cities dataframe
closest_stations = []
for row_num in range(len(cities)):
    city_coord = cities.iloc[row_num].coordinates
    closest_stations.append(find_closest_station(city_coord, stations))

# Need both usaf and wban to uniquely identify stations
cities['closest_station'] = closest_stations
cities[['closest_station_usaf', 'closest_station_wban']] = cities['closest_station'].str.split('|', expand=True)

# For each city, get over the past 5 years the average monthly temperature and precipitation
print(cities.head())