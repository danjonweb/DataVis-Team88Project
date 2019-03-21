import sqlite3
import json

conn = sqlite3.connect('../cityDB.sqlite')
c = conn.cursor()

c.execute("""CREATE TABLE flight_price_history (src text, dst text, price_history text)""")

mapping = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12',
}


def convert(d):
    month, year = d['year'].split()
    return {
        "month": year + mapping[month],
        "prince": d['price']
    }


i = 0
total = 0
for l in open('crawled_flight_history.data'):
    total += 1
    src, dst, code, json_str = l.strip().split("\t")
    data = json.loads(json_str.replace("u'", "'").replace("'", '"'))
    original_chart_data = data['chart_data']
    new_data = [convert(d) for d in original_chart_data]
    history = json.dumps(new_data)

    c.execute("INSERT INTO flight_price_history VALUES ('{}','{}','{}')".format(src, dst, history))
conn.commit()
conn.close()
