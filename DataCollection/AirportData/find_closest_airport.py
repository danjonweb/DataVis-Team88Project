# A function which, given a lat-lon tuple (origin) and a list of lat-lon tuples (all the airports)
# returns the closest n airports within a defined radius

import pandas as pd
import mpu

def find_closest_airport(origin, airport_df, n_airports, radius):
    """

    :param origin: a tuple with the latitude and longitude of the origin (either a city or an individual)
    :param airport_df: a Pandas dataframe containing airport information, at least iata_code, latitude and longitude
    :param n_airports: the number of airports we want to return, pad with NULL's if not enough airports
    :param radius: the maximum distance

    :return: a list of n airport codes as the closest airports
    """

    # Initialize a dictionary to hold the distance with each airport
    airport_dict = {}

    # Extract coordinates of each airport
    airport_coordinates = airport_df.coordinates.tolist()

    # Get the distance with each airport coordinates
    for airport in airport_coordinates:
        airport_dict[airport] = mpu.haversine_distance(origin, airport)

    # Extract the n closest airports
    closest_airports = sorted(airport_dict.items(), key=lambda x: x[1])[0:n_airports]

    # Check the distance is less than the desired radius
    closest_airports_radius = [u for u, v in closest_airports if v <= radius]

    # Get the airport codes for all the coordinates in the list
    airport_codes = []
    for close_airport in closest_airports_radius:
        airport_codes.append(airport_df.loc[airport_df.coordinates == close_airport, 'iata_code'].values[0])

    if len(airport_codes) < n_airports:
        return(airport_codes + (n_airports - len(airport_codes)) * [''])

    else:
        return airport_codes