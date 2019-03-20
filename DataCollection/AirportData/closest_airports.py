# This script creates a new table in the DB which lists the 3 closest airports from any given city
import sqlite3
import pandas as pd

airport_info = pd.read_csv('airports_info.txt', names=['openflights_airport_id', 'name', 'city', 'country',
                                                         'iata_code', 'icao_code', 'latitude',
                                                         'longitude', 'altitude', 'tz', 'dst', 'olson_tz',
                                                         'type', 'source'])
conn = sqlite3.connect('../cityDB.sqlite')
cities_info = pd.read_sql_query("SELECT cid, city, state, lat, lng  FROM cities;", conn)

# Subset this for only the airports for which we have price info
# Find the maximum distance between any city and an airport
# Find the closest 3 airports to any city, NULL if fewer than 3 within the max radius that we defined, use
# the function to do so