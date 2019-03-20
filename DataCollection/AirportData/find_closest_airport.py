# A function which, given a lat-lon tuple (origin) and a list of lat-lon tuples (all the airports)
# returns the closest n airports within a defined radius

import pandas as pd

def find_closest_airport(origin, airport_df, n_airports, radius):
    """

    :param origin: a tuple with the latitude and longitude of the origin (either a city or an individual)
    :param airport_df: a Pandas dataframe containing airport information, at least iata_code, latitude and longitude
    :param n_airports: the number of airports we want to return, pad with NULL's if not enough airports
    :param radius: the maximum distance

    :return: a list of n airport codes as the closest airports
    """

    # Extract a list of airport coordinates
    # Order the distances (use Haversine distance)
    # Extract the top n, only if less than radius
