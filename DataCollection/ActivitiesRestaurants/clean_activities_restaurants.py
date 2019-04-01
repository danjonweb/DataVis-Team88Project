# This script creates new tables in the DB in long format with activity and restaurant info
import json
import pandas as pd
import sqlite3

# Read in the original city data
conn = sqlite3.connect('../cityDB.sqlite')
cities_all = pd.read_sql_query("SELECT *  FROM cities;", conn)

# Initialize an empty list
activities_clean = []

# Iterate through the cities and extract the relevant information, creating a new row for each activity
for city in range(len(cities_all)):
    city_id = cities_all.iloc[city,0]
    city_name = cities_all.iloc[city, 1]
    state = cities_all.iloc[city, 2]
    activities = json.loads(cities_all.iloc[city,3])
    for category, activity in activities.items():
        try:
            category_activity = activity['name']
            category_number = activity['number']
            del activity['name']
            del activity['number']
            if category_number > 0:
                for activity_id, activity_details in activity.items():
                    activity_name = activity_details['name']
                    activity_number = activity_details['number']
                    activities_clean.append({'city_id': city_id,
                                            'city_name': city_name,
                                             'state': state,
                                            'category_activity': category_activity,
                                            'activity_name': activity_name,
                                            'activity_number': activity_number})
            else:
                pass
        except:
            pass

# Store in a dataframe
cities_activities = pd.DataFrame(activities_clean)[['city_id', 'city_name', 'state', 'category_activity',
                                                    'activity_name', 'activity_number']]

# Initialize two empty lists for the restaurants
restaurant_prices = []
restaurant_types = []

# Iterate through the cities and when information is available update the lists with prices ranges and restaurant types
for city in range(len(cities_all)):
    city_id = cities_all.iloc[city, 0]
    city_name = cities_all.iloc[city, 1]
    state = cities_all.iloc[city, 2]
    try:
        restaurants = json.loads(cities_all.iloc[city, 4])
        prices = restaurants['prices']
        cuisines = restaurants['cuisines']
        for price_range, number in prices.items():
            restaurant_prices.append({'city_id': city_id,
                                      'city_name': city_name,
                                      'state': state,
                                      'price_range': price_range,
                                      'number': number})

        for cuisine, number in cuisines.items():
            restaurant_types.append({'city_id': city_id,
                                     'city_name': city_name,
                                     'state': state,
                                     'cuisine': cuisine,
                                     'number': number})
    except:
        pass

# Store in two dataframes
restaurant_prices_df = pd.DataFrame(restaurant_prices)[['city_id', 'city_name', 'state',
                                                        'price_range', 'number']]

restaurant_types_df = pd.DataFrame(restaurant_types)[['city_id', 'city_name', 'state',
                                                      'cuisine', 'number']]

# Store in the sqlite DB
cities_activities.to_sql('city_activities', conn, if_exists='replace', index=False)
restaurant_prices_df.to_sql('restaurant_prices', conn, if_exists='replace', index=False)
restaurant_types_df.to_sql('restaurant_types', conn, if_exists='replace', index=False)
conn.close()
