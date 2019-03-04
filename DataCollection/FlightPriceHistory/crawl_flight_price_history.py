import requests
import os
import sys
import time


def crawl(src, dst):
    url = 'https://www.faredetective.com/faredetective/chart_data'
    headers = {
        'Origin': 'https://www.faredetective.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja-JP;q=0.6,ja;q=0.5,zh-TW;q=0.4',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://www.faredetective.com/farehistory/',
        'X-Requested-With': 'XMLHttpRequest'
    }
    params = {
        "arrival": dst,
        "departure": src
    }
    r = requests.post(url, data=params, headers=headers)
    return r


def read_crawled_pair(crawl_file):
    if not os.path.exists(crawl_file):
        return set()
    s = set()
    for l in open(crawl_file):
        parts = l.split("\t")
        if len(parts) < 2:
            continue
        s.add(parts[0] + '-' + parts[1])
    return s


def main():
    if len(sys.argv) != 2:
        print("Usage:", sys.argv[0], "airport_code_pair_list")
        exit(1)

    airport_file = sys.argv[1]
    data_file = airport_file + '.craw.data'
    outf = open(data_file, 'a')

    crawled_set = read_crawled_pair(data_file)

    duration_lst = []
    status_code_set = set()
    line_num, crawl_num = 0, 0
    for l in open(airport_file):
        line_num += 1
        pair = l.strip().split()

        if len(pair) != 2:
            continue
        start = time.time()
        dst, src = pair
        key = src + '-' + dst

        if key in crawled_set: continue

        r = crawl(src, dst)
        duration = time.time() - start
        duration_lst.append(duration)
        status_code_set.add(r.status_code)

        # output crawl results to datafile
        outf.write("{}\t{}\t{}\t{}\n".format(src, dst, r.status_code, r.json()))
        outf.flush()
        crawled_set.add(key)
        crawl_num += 1

        # output some stats
        if line_num % 100 == 0:
            print("[{}] [line:{}] [crawl:{}] [min/Avg/max time per request: {:.4}/{:.4}/{:.4}] [Status codes: {}]".format(
                time.ctime(),
                line_num,
                crawl_num,
                min(duration_lst),
                sum(duration_lst) / len(duration_lst),
                max(duration_lst),
                status_code_set
            ))

        # make sure we sleep for 1 second
        if duration < 1:
            time.sleep(1 - duration)
    outf.close()


if __name__ == "__main__":
    main()
