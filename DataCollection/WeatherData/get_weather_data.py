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
cities['coordinates'] = zip(cities.lat, cities.lng)

# Get a list of all the stations in the US from NOAA data publicly available on BigQuery
credentials = service_account.Credentials.from_service_account_file('bigquery_key.json')
stations_query = ("""SELECT *
FROM `bigquery-public-data.noaa_gsod.stations`
WHERE country = 'US'""")
stations = pandas_gbq.read_gbq(stations_query,
                               project_id="dva-destination-recommender",
                               credentials=credentials, dialect='standard')

# Get the coordinates for the stations
stations['coordinates'] = np.array(zip(stations.lat, stations.lon))

def find_closest_station(city_coord, stations):
    """
    INPUTS:
    city_coord (tuple): a tuple with the coordinates for the city
    stations (NumPy array): an array of coordinates for various stations

    OUTPUT:
    ids (int): the station ID for the closest station to the city, both usaf and wban
    """
    stations_coord = stations['coordinates'].values
    print(stations.coordinates.iloc[0])
    closest_index = distance.cdist([city_coord], stations_coord).argmin()
    usaf = stations.iloc[closest_index, 0]
    wban = stations.iloc[closest_index, 1]

    ids = str(usaf) + '|' + str(wban)

    return ids

print(find_closest_station((34.78, -76.85), stations))

client = bigquery.Client.from_service_account_json('bigquery_key.json')
query = (
    "SELECT name FROM `bigquery-public-data.usa_names.usa_1910_2013` "
    'WHERE state = "TX" '
    "LIMIT 100"
)
# query_job = client.query(
#     query,
#     # Location must match that of the dataset(s) referenced in the query.
#     location="US",
# )  # API request - starts the query
#
# for row in query_job:  # API request - fetches results
#     # Row values can be accessed by field name or index
#     assert row[0] == row.name == row["name"]
#     print(row)



# Limited to 1000 calls per day. With 4000 cities, last year, 1 call per week: 52 * 4000