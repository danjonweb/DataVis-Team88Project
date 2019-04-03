# This script creates a new table in the DB which lists the 3 closest airports from any given city
import sqlite3
import pandas as pd
import find_closest_airport

conn = sqlite3.connect('../cityDB.sqlite')

# Read in the information about the airports
airport_info = pd.read_csv('airports_info.txt', names=['openflights_airport_id', 'name', 'city', 'country',
                                                         'iata_code', 'icao_code', 'latitude',
                                                         'longitude', 'altitude', 'tz', 'dst', 'olson_tz',
                                                         'type', 'source'])

# Create a tuple holding the latitude and longitude of the airport
airport_info['coordinates'] = airport_info.apply(lambda x: (x.latitude, x.longitude), axis=1)

# Save this to SQLite database
airport_info[['name', 'city', 'country', 'iata_code','latitude', 'longitude']].to_sql('airport_info', 
                                                                conn, if_exists='replace', index=False)

# Read in city information
cities_info = pd.read_sql_query("SELECT cid, city, state, lat, lng  FROM cities;", conn)
cities_info['coordinates'] = cities_info.apply(lambda x: (x['lat'], x['lng']), axis=1)

# Read in all the airports with price information
airport_price = pd.read_sql_query("SELECT *  FROM flight_price_history;", conn)
airports_with_price = airport_price.src.unique().tolist()

# Only keep airports with price information
airport_info = airport_info.loc[airport_info.iata_code.isin(airports_with_price),]

# Create a dataframe of cities and their 3 closest airports, within a radius of 40 km
city_airport = []
for i in range(len(cities_info)):
    city = cities_info.iloc[i]
    city_id = city.cid
    city_name = city.city
    state = city.state
    airports = find_closest_airport.find_closest_airport(city.coordinates, airport_info, n_airports=5, radius=60)
    city_airport.append({'city_id': city_id, 'city_name': city_name, 'state': state,
                         'closest_airport': airports[0], 'second_closest_airport': airports[1],
                        'third_closest_airport': airports[2]})

city_airport = pd.DataFrame(city_airport)

# Reorder the columns
city_airport = city_airport[['city_id', 'city_name', 'state', 'closest_airport',
                             'second_closest_airport', 'third_closest_airport']]

# Store to DB
city_airport.to_sql('city_closest_airport', conn, if_exists='replace', index=False)
conn.close()
