import requests
import json
import re
import numpy as np
import pprint


def getGoogleHandwritingAPIResults(app_language, ink):
    url = f'https://inputtools.google.com/request?ime=handwriting&app={app_language}&dbg=1&cs=1&oe=UTF-8'

    headers = {
        'Accept': '*/*',
        'Referer': 'https://quickdraw.withgoogle.com/',
        'Origin': 'https://quickdraw.withgoogle.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
        'Content-Type': 'application/json'
    }

    ink_str = json.dumps(ink)

    data = '{"input_type":0,"requests":[{"language":"' + app_language + '","writing_guide":{"width":886,"height":348},"ink":[' + ink_str + ']}]}'

    r = requests.post(url, headers=headers, data=data)

    d = json.loads(r.content)
    return d

def convertData(d):
    di = d[1][0][3]['debug_info']
    result = re.search('SCORESINKS: (.*)]]', di)
    scores = json.loads(result.group(1) + ']]')
    a = np.array(scores)

    x = a[:, 0]
    y = a[:, 1].astype(float)

    return x, y

def sort_by_average(data):
    # Calculate the average and sort by it in descending order
    sorted_data = sorted(data.items(), key=lambda item: sum(item[1]) / len(item[1]), reverse=True)
    # Return only the sorted keys
    return [item[0] for item in sorted_data]

def sort_by_first_value(data):
    # Sort the dictionary by the first value of each tuple in the values
    sorted_data = sorted(data.items(), key=lambda item: item[1][0],reverse=True)
    return dict(sorted_data)

def sort_by_second_value(data):
    # Sort the dictionary by the second value of each tuple in the values
    sorted_data = sorted(data.items(), key=lambda item: item[1][1],reverse=True)
    return dict(sorted_data)

def sort_by_max_value(input_dict):
    # Sort the dictionary by the maximum value of each key's list in descending order
    sorted_dict = dict(sorted(input_dict.items(), key=lambda item: max(item[1]), reverse=True))
    return sorted_dict

def extract_dict_keys(input_dict):
    # Extract the keys from the dictionary and return them as a list
    keys_list = list(input_dict.keys())
    return keys_list

def extract_keys_from_json(keys_to_extract, json_data):
    # Create a new dictionary with only the specified keys
    extracted_data = {key: json_data[key] for key in keys_to_extract if key in json_data}
    return extracted_data

def getSuggestions(ink): # parameter json_data removed
    print("Hello from Pyodide")
    d_qd = getGoogleHandwritingAPIResults('autodraw', ink)
    d_ad = getGoogleHandwritingAPIResults('quickdraw', ink)

    x_qd, y_qd = convertData(d_qd)
    x_ad, y_ad = convertData(d_ad)

    scores = {}
    for ii in range(0, len(x_qd)):
        xi_qd = x_qd[ii]
        yi_qd = y_qd[ii]
        scores[xi_qd] = [yi_qd, 0]
    for ii in range(0, len(x_ad)):
        xi_ad = x_ad[ii]
        yi_ad = y_ad[ii]
        if xi_ad in scores:
            scores[xi_ad][1] = yi_ad
        else:
            scores[xi_ad] = [0, yi_ad]


    suggestions = sort_by_first_value(scores)


    # suggestions = sort_by_second_value(scores) # to sort by quickdraw results
    # suggestions = sort_by_average(scores) # to sort by avg of both

    # with open('./stencils-20170414.json', 'r') as f:
    #     json_data = json.load(f)


    # extracted_data = extract_keys_from_json(suggestions, json_data)
    # print(extracted_data)
    #return extracted_data

    return extract_dict_keys(suggestions)

# suggestions = getSuggestions(ink)
# print(suggestions)