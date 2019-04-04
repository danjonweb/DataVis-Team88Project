# DataVis-Team88Project: Data Collection
This repo contains all data gather and cleaning scripts

## Necessary Libraries
In order to run all the scripts included in this repository, the following libraries need
to be installed:
* sqlite3
* pandas
* google.oauth2
* pandas-gbq
* scipy
* numpy
* mpu

## WeatherData

This folder gathers the script necessary to acquire weather data for all cities included
in the `cities` table of `cityDB`. In order to do so, we leverage information from NOAA
(National Oceanic and Atmospheric Administation) and GSOD (Global surface Summary Of the Day)
publicly available through Google BigQuery.

After finding the closest station to any given city (based on the geographic coordinates) of
the cities and of all the stations in the U.S., we use these to get average monthly weather
over the past 5 years.

The results are stored in `cityDB`, in the table `city_weather`, which has the following
columns:
* **cid** (TEXT): the city ID, as defined in `city`
* **city** (TEXT): the name of the city
* **state** (TEXT): the state
* **lat** (REAL): the latitude of the city
* **longitude** (REAL): the longitude of the city
* **closest_station_usaf** (TEXT): the USAF identifier for the closest weather station
* **closest_station_wban** (TEXT): the WBAN identifier for the closest weather station
* **month** (TEXT): the month for the weather (integer)
* **avg_temp** (REAL): the average monthly temperature
* **avg_prcp** (REAL): the average precipitation amount during the month
* **avg_nb_foggy_days** (REAL): average number of foggy days during the month
* **avg_nb_precep_days** (REAL): average number of days of precipitation during the month
* **avg_nb_hail_days** (REAL): average number of days when snow pellets fell during the month
* **avg_nb_stormy_days** (REAL): average number of stormy days during the month

## AirportData

Folder containing a csv file with airport information,
downlaoded from https://openflights.org/data.html

The Python script `closest_airports.py` creates a new table
in the database which stores the 3 closest airports for any city. We choose
60km as the maximum radius in which to look for an airport, as it is the maximum
distance between any city in our database and the airports for which we have price information.
This ensures every city will have at least one airport associated with them.

Some caveats:
* out of the 394 airports for which we have price information, only 370 have information available
* some airports are closed
* some cities do not have 3 airports within the radius, so NULL in the 

The file `find_closest_airports.js` contains useful functions to return the closest airports to any location. In particular, its main function `find_closest_airports` has the following arguments:
* origin: a JavaScript array with latitude and longitude (in this order)
* airports: an array of JavaScript object, built from the query: ```SELECT iata_code, latitude, longitude FROM airport_info WHERE country = 'United States'``` on the SQLite database
* nAirports: an integer specifying how many airports we want to limit ourselves to. This is a maximum number of airports (i.e. there could be fewer which are returned)
* radius: the radius to consider, in miles

The function iterates through the airports in the array and computes the distance to the origin as a new attribute to the object. If at least one airport is within the radius, it returns the 3 (or fewer) closest airports. If no airport is within the radius, it returns the closest airport.

The variable returned is an array with airport codes. One example call:
```findClosestAirports(origin = [37.773972, -122.431297], airports, nAirports = 3, radius = 100);==>["SFO", "SJC"]```

The script `clean_activities_restaurants` operates on the `cities` table of the SQLite 
database. It creates three tables `city_activities`, `restaurant_prices` and `restaurant_types`.

## ActivitiesRestaurants

### city_activities

Iterating through the activities field of the cities table, we extract the activity category,
activity type and number of such activities. The table is in the long format, with the following
schema:

* "city_id" TEXT,
* "city_name" TEXT,
* "state" TEXT,
* "category_activity" TEXT,
* "activity_name" TEXT,
* "activity_number" INTEGER

Certain categories were marked as having no corresponding activities, and were not included.

### restaurant_prices

Iterating through the restaurant field of the cities table, we extract the price ranges for
the restaurants in all the cities. The data is stored in long format.
Data is missing for 2,327 cities, which do not appear in this table. The schema:

* "city_id" TEXT,
* "city_name" TEXT,
* "state" TEXT,
* "price_range" TEXT,
* "number" INTEGER

### restaurant_types

Very similar to above, the schema:

* "city_id" TEXT,
* "city_name" TEXT,
* "state" TEXT,
* "cuisine" TEXT,
* "number" INTEGER


## Flight price history scrapper
We crawl flight price history from faredetective https://www.faredetective.com/ and crawled data

### Flight price history
Price history of 156378 pair of airports and their price history over the last year
Data are delimited by "\t" and each line contains 4 fields: 
1. Destination airport
2. Source airport
3. HTTP response code from the server
4. JSON blob of price history

The schema of the flight_history_price table is:
* "src" TEXT
* "dst" TEXT
* "dst_cid" TEXT
* "yearmonth" TEXT
* "month" TEXT
* "price" REAL 
