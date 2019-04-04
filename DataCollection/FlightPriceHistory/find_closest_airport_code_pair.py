import sqlite3
import json

conn = sqlite3.connect('../cityDB.sqlite')
c = conn.cursor()

stms = "select * from city_closest_airport"

airport_set = set()
for row in c.execute(stms):
    for i in range(3,6):
        if row[i] != "":
            airport_set.add(row[i])

print("\n".join(airport_set))