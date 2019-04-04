import sqlite3
import json

conn = sqlite3.connect('../cityDB.sqlite')
c = conn.cursor()

c.execute("""CREATE TABLE flight_price_history (src text, dst text, yearmonth text, month text, price real)""")

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
        "price": float(d['price']),
    }


i = 0
total = 0
for l in open('crawled_flight_history.data'):
    total += 1
    src, dst, code, json_str = l.strip().split("\t")
    data = json.loads(json_str.replace("u'", "'").replace("'", '"'))
    original_chart_data = data['chart_data']
    new_data = [convert(d) for d in original_chart_data]


    month_prices = {}
    for d in new_data:
        month, price = d['month'], d['price']
        if month not in month_prices:
            month_prices[month] = [price]
        else:
            month_prices[month].append(price)
    for month in month_prices.keys():
        price_list = month_prices[month]
        avg = sum(price_list)/len(price_list)
        #print(src, dst, month, avg)
        c.execute("INSERT INTO flight_price_history VALUES ('{}','{}','{}','{}','{}')".format(src, dst, month, month[4:6],avg))
conn.commit()
conn.close()
