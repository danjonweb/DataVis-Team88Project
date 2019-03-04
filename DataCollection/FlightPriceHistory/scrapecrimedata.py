#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Feb 27 16:13:56 2019

@author: deborahpaul
"""
import pandas as pd
import urllib.request as urllib2
#import requests
from bs4 import BeautifulSoup
import numpy as np
import time

starttime = time.time()
# city names
f = open('./cities.txt','r')
cities = f.read()
cities = cities.split('\n')

# handle state name abbreviations
state_name_lookup = pd.read_csv('./state-name-lookup.csv',names=['State','Abbr'])
state_name_lookup = {row['Abbr']:row['State'] for i, row in state_name_lookup.iterrows()}

base_quote_page = 'http://www.city-data.com/crime/crime-'
#quote_page = 'http://www.bloomberg.com/quote/SPX:IND'


def get_city_data(city, state):
    quote_page = base_quote_page+city+'-'+state+'.html'
    try:
        page = urllib2.urlopen(quote_page)
#        page=requests.get(quote_page)
        soup = BeautifulSoup(page, 'html.parser')
    
        # Take out the <div> of name and get its value
        name_box = soup.find('tr', attrs={'class': 'nosort'})
        #name = name_box.text.strip()
        #data = name.split(')')[1].split()
        
        #split by </td><td>
        data = str(name_box).split('</td><td>')
        
        # handle first and last element of data and make numbers
        data = data[1:]
        data[-1] = data[-1].split('</td></tr>')[0]
        data = np.mean([float(i) for i in data])
        print('worked', city, state)
        return data
    except urllib2.URLError as err: 
        extra_cities.append([city,state])
        print("it's broken,url error",city,state)
    except:
        extra_cities.append([city,state])
        print('nosite ',city, state)

all_city_data = {}
extra_cities = []
#for i in ['Houston, TX']:
for i in cities:
    city, state = i.split(',')
    city = city.replace(' ','-')
    state = state.replace(' ','')
    state = state_name_lookup[state]
    state = state.replace(' ','-')
    city_data = get_city_data(city,state)
    # delay to meet 40 request per 10 second rule
    time.sleep((np.random.random()+1)*30)
    all_city_data[i] = city_data
    
