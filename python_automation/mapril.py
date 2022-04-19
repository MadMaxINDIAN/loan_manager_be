import math
from time import sleep
from unicodedata import name
import requests
import random
from pprint import pprint
import pandas as pd

df = pd.read_excel (r'Micro april.xlsx')
df = df[273:]

for i in range(len(df)):
    # borrower api call
    url = 'http://localhost:5000/borrower/add'
    myobj = {
        "name": df.iloc[i,1],
        "occupation": df.iloc[i,2],
        "aadhar": "",
        "contact": ""
    }
    pprint(myobj)
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtmYyIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNjUwMjA1OTgyfQ.AM-PZOYjN9gGAzvsF0qOP8u_S_vddGx1kKpSbt2BtWw'
    }
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    bid = data["borrower"]["_id"]
    print(bid)
    # loan account api call
    url = 'http://localhost:5000/loan/add'
    myobj = {
        "borrower_id": bid,
        "loan_amount": df.iloc[i,4]/1.2,
        "opening_date": pd.to_datetime(df.iloc[i, 3]).strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
        "sr_no": df.iloc[i,0],
        "loan_period": df.iloc[i, 7]
    }
    pprint(myobj)
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    # pprint(data)
    try :
        print(f'{i} {bid} {data["_id"]}')
    except:
        print(f'{i} {bid} {data}')
