import sqlite3
import pandas as pd
from google.cloud import bigquery
from google.oauth2 import service_account
import pandas_gbq

credentials = service_account.Credentials.from_service_account_file('bigquery_key.json')
query = (
    "SELECT name FROM `bigquery-public-data.usa_names.usa_1910_2013` "
    'WHERE state = "TX" '
    "LIMIT 100"
)

df = pandas_gbq.read_gbq(query, project_id="dva-destination-recommender", credentials=credentials, dialect='standard')
print(df)

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

# Get a dataframe of all the cities at hand, along with their latitude and longitude
conn = sqlite3.connect('../cityDB.sqlite')
cities = pd.read_sql_query("SELECT cid, city, state, lat, lng  FROM cities;", conn)

# Limited to 1000 calls per day. With 4000 cities, last year, 1 call per week: 52 * 4000