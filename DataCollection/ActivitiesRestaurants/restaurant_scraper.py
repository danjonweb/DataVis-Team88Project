import urllib.request as urllib2
from urllib.parse import quote
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
import sys
import math


conn = sqlite3.connect('cityDB.sqlite')
conn.text_factory = lambda x: str(x, 'utf-8', 'ignore')

try:
    conn.cursor().execute('ALTER TABLE cities ADD COLUMN restaurants TEXT')
except:
    pass

options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('--blink-settings=imagesEnabled=false')
driver = webdriver.Chrome(chrome_options=options)
driver.implicitly_wait(10)

base_url = 'https://www.tripadvisor.com/RestaurantSearch?geo=%s&zfp=10613&itags=10591&sortOrder=relevance&geobroaden=false'

result = conn.cursor().execute('SELECT * FROM cities')

count = 0
for row in result:
    cid = row[0]
    
    url = base_url % cid
    try:
        restaurants = {
            "prices":{},
            "cuisines":{}
        }
        
        # Get the number of pages
        pages = 0
        driver.get(url)
        index_str = driver.find_element_by_css_selector('.popIndex').get_attribute('innerText')
        x = re.search('of (\d+)', index_str)
        if x is not None and x.group(1) is not None:
            total = int(x.group(1))
            pages = int(math.ceil(total/30.0))
        
        page = 0
        for _ in range(pages):
            print('%s - %d - %d' % (cid, page, pages))
            driver.get('%s&o=a%s' % (url, page))
            page += 30
            
            try:
                cuisine_items = driver.find_elements_by_css_selector('.listing[data-index] a.cuisine')
                for item in cuisine_items:
                    cuisine = item.get_attribute('innerText')
                    if cuisine in restaurants["cuisines"]:
                        restaurants["cuisines"][cuisine] += 1
                    else:
                        restaurants["cuisines"][cuisine] = 1
            
                price_items = driver.find_elements_by_css_selector('.listing[data-index] span.price')
                for item in price_items:
                    price = item.get_attribute('innerText')
                    if price in restaurants["prices"]:
                        restaurants["prices"][price] += 1
                    else:
                        restaurants["prices"][price] = 1
            except:
                print('error on ' + ('%s&o=a%s' % (url, page)))
                continue
            
        
        result = json.dumps(restaurants) 
        print(result)
        print('')
        conn.cursor().execute('UPDATE cities SET restaurants = ? WHERE cid = ?', (result, cid))
        conn.commit() 
    except:
        print("Error: " + cid)
        print(url)
        traceback.print_exc()
    
    
driver.quit()
conn.close()

