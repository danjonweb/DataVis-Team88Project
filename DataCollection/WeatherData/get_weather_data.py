import sqlite3
import pandas as pd

# Get a dataframe of all the cities at hand, along with their latitude and longitude
conn = sqlite3.connect('../cityDB.sqlite')
cities = pd.read_sql_query("SELECT cid, city, state, lat, lng  FROM cities;", conn)

