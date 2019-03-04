from __future__ import print_function

# find airport code for cities
mapping = {}
airport_lst_file = "all_airport_code.lst"
#airport_lst_file = "us_airport_code.lst"
for l in open(airport_lst_file):
    if l.find('(') == -1: continue
    try:
        city, code_raw = l.strip().replace(' ', '').replace(')', '').split('(')
        if city.find('-') != -1:
            city = city.split('-')[0]
        if city not in mapping:
            mapping[city] = []

        mapping[city].append(code_raw)
    except:
        pass

code_to_city = {}
code_lst = []
with open('airport_code_to_cities.map', 'w') as outf:
    for l in open('cities.txt'):

        city = l.strip().replace(' ', '')
        if city in mapping:
            for code in mapping[city]:
                code_lst.append(code)
                outf.write("{}\t{}\n".format(code, l.strip()))
                code_to_city[code] = l.strip()



# create code pairs (avoid same city)
for src_code in code_lst:
    src_city = code_to_city[src_code]
    for dst_code in code_lst:
        dst_city = code_to_city[dst_code]
        if src_city == dst_city:
            continue
        print(src_code, dst_code)


