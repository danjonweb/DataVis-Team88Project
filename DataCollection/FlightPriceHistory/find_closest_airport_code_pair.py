import sqlite3
import json

conn = sqlite3.connect('../cityDB.sqlite')
c = conn.cursor()

stms = "select * from city_closest_airport"

airport_city = set()


for row in c.execute(stms):
    for i in range(3,6):
        if row[i] != "":
            airport_city.add((row[i], row[0]))

for airport, cid in airport_city:
    c.execute(
        "INSERT INTO airport_to_city VALUES ('{}','{}')".format(
            airport, cid))
conn.commit()
conn.close()

