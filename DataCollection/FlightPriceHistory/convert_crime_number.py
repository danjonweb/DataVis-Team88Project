import sqlite3
import json

conn = sqlite3.connect('../cityDB.sqlite')
c = conn.cursor()

c.execute("""CREATE TABLE crime_data_number (city text, state text, crime_ind REAL, cid TEXT)""")
stms = "select * from crime_data"
data = []
for row in c.execute(stms):
    city, state, crime_idn, cid = row
    crime_idn = float(crime_idn) if crime_idn and crime_idn !="None" else 0
    data.append([city, state, crime_idn, cid])


for city, state, crime_idn, cid in data:
    city = city.replace("'", '')
    c.execute("INSERT INTO crime_data_number VALUES ('{}','{}','{}','{}')".format(
        city, state, crime_idn, cid
    ))

conn.commit()
conn.close()
