# Activities and Restaurants

The script `clean_activities_restaurants` operates on the `cities` table of the SQLite 
database. It creates three tables `city_activities`, `restaurant_prices` and `restaurant_types`.

## city_activities

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

## restaurant_prices

Iterating through the restaurant field of the cities table, we extract the price ranges for
the restaurants in all the cities. The data is stored in long format.
Data is missing for 2,327 cities, which do not appear in this table. The schema:

* "city_id" TEXT,
* "city_name" TEXT,
* "state" TEXT,
* "price_range" TEXT,
* "number" INTEGER

## restaurant_types

Very similar to above, the schema:

* "city_id" TEXT,
* "city_name" TEXT,
* "state" TEXT,
* "cuisine" TEXT,
* "number" INTEGER