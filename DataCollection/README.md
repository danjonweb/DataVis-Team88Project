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