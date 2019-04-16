import urllib2
from urllib2 import quote
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
import re
import time
import os
import csv
import io
import json
import traceback
import sqlite3

options = webdriver.ChromeOptions()
options.add_argument('headless')
driver = webdriver.Chrome(chrome_options=options)

base_url = 'https://www.tripadvisor.com'
top_activity_url = base_url + '/Attractions-%s'
top_restaurants_url = base_url + '/Restaurants-%s-%sActivities-%s.html'

# Get city ids
with open('Top5000Population.csv', 'rb') as csvfile:
    cities = list(csv.reader(csvfile))
cities = [{"city": x[0].strip(), "state": x[1].strip(), "search":quote(x[0].strip() + " " + x[1].strip())} for x in cities]
if os.path.exists("cityIds.txt"):
    os.remove("cityIds.txt")
for city in cities:
    search_url = 'https://www.tripadvisor.com/Search?q=' + city["search"]
    driver.get(search_url)
    driver.implicitly_wait(10)

    try:
        resultDiv = driver.find_element_by_css_selector('.result')
        html = driver.execute_script("return arguments[0].innerHTML;", resultDiv)

        x = re.search('\'\/Home-(g.*?)\'', html)
        if x and not(x.group(1) is None):
            city_id = x.group(1)
            with open("cityIds.txt", "a") as myfile:
                myfile.write(city["city"].encode("utf-8") + "|" + city["state"] + "|" + city_id + "\n")
    except:
        print("Error: '" + search_url + "'")

conn = sqlite3.connect('cityDB.sqlite')
cur = conn.cursor()

cur.execute('CREATE TABLE IF NOT EXISTS cities (cid TEXT, city TEXT, state TEXT, json TEXT)')
conn.commit()

with open('cityIds.txt', 'r') as f:
    city_ids = f.read().splitlines()
for i, city in enumerate(city_ids):
    [city, state, cid] = city.split('|')

    print('Fetching ' + str(i+1) + ' of ' + str(len(city_ids)) + '. ' + cid + ' - ' + city + ', ' + state)

    activity_url = top_activity_url % cid

    driver.get(activity_url)
    driver.implicitly_wait(10)

    try:
        isCarouselItem = True
        elements = driver.find_elements_by_css_selector('.attractions-carousel-shelf-ShelfCarouselItem__text--2MxS5')
        if len(elements) == 0:
            elements = driver.find_elements_by_css_selector('.filter_list_0 a.taLnk')
            isCarouselItem = False

        categories = {}
        for e in elements:
            cat_url = ""
            if isCarouselItem:
                parent = e.find_element_by_xpath('./../../..')
                cat_url = parent.get_attribute('href')
            else:
                cat_url = e.get_attribute('href')
            x = re.search('-c.*-(?:t-.*?-)?', cat_url)
            # if the url doesn't match the -c and -t pattern, it is promotional
            if not(x is None):
                cat_string = e.get_attribute('innerText')
                y = re.search('(.*?) \((\d+)\)', cat_string)
                cat_name = str(y.group(1))
                cat_number = str(y.group(2))
                cats = x.group(0).split('-')
                cat1 = str(cats[1])
                if not(cat1 in categories):
                    categories[cat1] = {}
                if len(cats) > 3:
                    cat2 = str(cats[2])
                    categories[cat1][cat2] = {
                        "name": cat_name,
                        "number": cat_number
                    }
                else:
                    categories[cat1]["name"] = cat_name
                    categories[cat1]["number"] = cat_number

        result = json.dumps(categories)
        cur.execute('INSERT INTO cities (cid, city, state, json) values (?, ?, ?, ?)', (cid, city, state, result))
        conn.commit()
    except:
        print("error: " + city)
        print('>>> traceback <<<')
        traceback.print_exc()
        print('>>> end of traceback <<<')

conn.close()
driver.quit()

cats = []

conn = sqlite3.connect('cityDB.sqlite')
cur = conn.cursor()
cur.execute('SELECT * FROM cities') 
for row in cur:
    data = json.loads(row[3])
    for key in data:
        if key.startswith('c') and key not in cats:
            cats.append(key)
for cat in cats:
    try:
        cur.execute('ALTER TABLE cities ADD COLUMN ' + cat + ' integer')
    except:
        pass

try:
    cur.execute('ALTER TABLE cities ADD COLUMN total integer')
except:
    pass
   
cur2 = conn.cursor()     
cur2.execute('SELECT * FROM cities')

for row in cur2:
    print(row[0])
    cid = row[0]
    data = json.loads(row[3])
    total = 0
    print(data)
    for cat in cats:
        print(cat)
        if cat in data:
            count = int(data[cat]['number'])
            total += count
            conn.cursor().execute('UPDATE cities SET ' + cat + ' = ' + str(count) + ' WHERE cid = "' + cid + '"')
        else:
            conn.cursor().execute('UPDATE cities SET ' + cat + ' = 0 WHERE cid = "' + cid + '"')
    conn.cursor().execute('UPDATE cities SET total = ' + str(total) + ' WHERE cid = "' + cid + '"')
    
conn.commit()
conn.close()

