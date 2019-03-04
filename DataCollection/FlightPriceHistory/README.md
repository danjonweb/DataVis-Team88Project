# Flight price history scrapper
Python code for crawling price history from faredetective https://www.faredetective.com/ and crawled data


## Current Files
### all_airport_code.txt
A list of all airport code and the city name

### all_cities.txt
A list of cities provided by Dan

### crawled_flight_history.data.bz2
Price history of 156378 pair of airports and their price history over the last year
Data are delimited by "\t" and each line contains 4 fields: 
1. Destination airport
2. Source airport
3. HTTP response code from the server
4. JSON blob of price history

Example:
NYC	ORD	200	{'airportname': 'All Airports', 'city': 'New York', 'type': 'one', 'chart_data': [{'year': 'Feb\n2018', 'price': '161.518'}, {'year': 'Mar\n2018', 'price': '157.11'}, {'year': 'Apr\n2018', 'price': '232.6'}, {'year': 'Apr\n2018', 'price': '211.6'}, {'year': 'Apr\n2018', 'price': '144.207'}, {'year': 'Apr\n2018', 'price': '238.6'}, {'year': 'Apr\n2018', 'price': '194.4'}, {'year': 'May\n2018', 'price': '169.69'}, {'year': 'May\n2018', 'price': '158.009'}, {'year': 'May\n2018', 'price': '152.4'}, {'year': 'May\n2018', 'price': '158.878'}, {'year': 'Jun\n2018', 'price': '285.4'}, {'year': 'Jun\n2018', 'price': '245.01'}, {'year': 'Jun\n2018', 'price': '319.26'}, {'year': 'Jul\n2018', 'price': '330.4'}, {'year': 'Jul\n2018', 'price': '252.4'}, {'year': 'Jul\n2018', 'price': '275.4'}, {'year': 'Aug\n2018', 'price': '251.01'}, {'year': 'Aug\n2018', 'price': '275.4'}, {'year': 'Sep\n2018', 'price': '345.01'}, {'year': 'Oct\n2018', 'price': '221.41'}, {'year': 'Oct\n2018', 'price': '186.4'}, {'year': 'Nov\n2018', 'price': '177.63'}, {'year': 'Nov\n2018', 'price': '265.39'}, {'year': 'Nov\n2018', 'price': '267.4'}, {'year': 'Dec\n2018', 'price': '381.2'}, {'year': 'Jan\n2019', 'price': '207.4'}, {'year': 'Jan\n2019', 'price': '177.63'}, {'year': 'Feb\n2019', 'price': '268.6'}, {'year': 'Feb\n2019', 'price': '139.4'}]}

### crawl_flight_price_history.py
Scrape price history from faredetective website. Input is a list of airport code pairs

### find_airport_code.py
Find the airport code given a city name
