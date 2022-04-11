import math
from time import sleep
from unicodedata import name
import requests
import random
from pprint import pprint
import pandas as pd
import ast
import asyncio

df = pd.read_excel (r'MICRO 0008.xlsx')
df = df[197:]

for i in range(len(df)):
    # borrower api call
    url = 'http://localhost:5000/borrower/add'
    myobj = {
        "name": df.iloc[i,1],
        "occupation": "Bussiness",
        "aadhar": "",
        "contact": ""
    }
    
    print(myobj)
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGh1cmVzaCIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNjQ5NDMyODk4fQ.9GcWMJGZbeD7PFMlNKo14JI86bM7NCd-tBx2frYt_YU'
    }
    # continue
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    bid = data["borrower"]["_id"]
    print(bid)
    # continue
    # loan account api call
    url = 'http://localhost:5000/loan/add'
    myobj = {
        "borrower_id": bid,
        "loan_amount": df.iloc[i,4],
        "opening_date": pd.to_datetime(df.iloc[i, 3]).strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
        "sr_no": df.iloc[i,0],
        "loan_period": 60
    }
    # pprint(myobj)
    # break
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    # pprint(data)
    try :
        print(f'{i} {bid} {data["_id"]}')
    except:
        print(f'{i} {bid} {data}')
