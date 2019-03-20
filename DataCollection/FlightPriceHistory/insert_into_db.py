import sqlite3
import json

conn = sqlite3.connect('../cityDB.sqlite')
c = conn.cursor()

c.execute("""CREATE TABLE fligh_price_history (src text, dst text, price_history text)""")

i = 0
total = 0
for l in open('crawled_flight_history.data'):
    total += 1
    src, dst, code, json_str = l.strip().split("\t")
    data = json.loads(json_str.replace("u'", "'").replace("'", '"'))
    history = json.dumps(data['chart_data'])

    c.execute("INSERT INTO fligh_price_history VALUES ('{}','{}','{}')".format(src, dst, history))
conn.commit()
conn.close()