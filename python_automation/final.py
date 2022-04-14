import math
from time import sleep
from unicodedata import name
import requests
import random
from pprint import pprint
import pandas as pd

df = pd.read_excel (r'MICRO jan.xlsx')
df = df[37:]

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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hbWFuc2FteWFrIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNjQ5NjU4MjYwfQ.2xyvClKP4b5DXUEvb7CUNRhapOPaT5V1i5DjOOkkCuo'
    }
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    bid = data["borrower"]["_id"]
    print(bid)
    # continue
    # loan account api call
    url = 'http://localhost:5000/loan/add'
    myobj = {
        "borrower_id": bid,
        "loan_amount": df.iloc[i,4]/1.2,
        "opening_date": pd.to_datetime(df.iloc[i, 3]).strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
        "sr_no": df.iloc[i,0],
        "loan_period": 60
    }
    pprint(myobj)
    # break
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    # pprint(data)
    try :
        print(f'{i} {bid} {data["_id"]}')
    except:
        print(f'{i} {bid} {data}')


import math
from time import sleep
from unicodedata import name
import requests
import random
from pprint import pprint
import pandas as pd

df = pd.read_excel (r'MICRO feb.xlsx')
df = df[143:]

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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hbWFuc2FteWFrIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNjQ5NjU4MjYwfQ.2xyvClKP4b5DXUEvb7CUNRhapOPaT5V1i5DjOOkkCuo'
    }
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    bid = data["borrower"]["_id"]
    print(bid)
    # continue
    # loan account api call
    url = 'http://localhost:5000/loan/add'
    myobj = {
        "borrower_id": bid,
        "loan_amount": df.iloc[i,3]/1.2,
        "opening_date": pd.to_datetime(df.iloc[i, 2]).strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
        "sr_no": df.iloc[i,0],
        "loan_period": 60
    }
    pprint(myobj)
    # break
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    # pprint(data)
    try :
        print(f'{i} {bid} {data["_id"]}')
    except:
        print(f'{i} {bid} {data}')


import math
from time import sleep
from unicodedata import name
import requests
import random
from pprint import pprint
import pandas as pd

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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hbWFuc2FteWFrIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNjQ5NjU4MjYwfQ.2xyvClKP4b5DXUEvb7CUNRhapOPaT5V1i5DjOOkkCuo'
    }
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    bid = data["borrower"]["_id"]
    print(bid)
    # continue
    # loan account api call
    url = 'http://localhost:5000/loan/add'
    myobj = {
        "borrower_id": bid,
        "loan_amount": df.iloc[i,4]/1.2,
        "opening_date": pd.to_datetime(df.iloc[i, 3]).strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
        "sr_no": df.iloc[i,0],
        "loan_period": 60
    }
    pprint(myobj)
    # break
    data = requests.post(url, data = myobj, headers=headers)
    data = data.json()
    # pprint(data)
    try :
        print(f'{i} {bid} {data["_id"]}')
    except:
        print(f'{i} {bid} {data}')



from cmath import nan
from datetime import timedelta
import requests
import random
from pprint import pprint
import pandas as pd

df = pd.read_excel (r'MICRO jan.xlsx')
df = df[37:]

for i in range(len(df)):
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGh1cmVzaCIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNjQ5NDMyODk4fQ.9GcWMJGZbeD7PFMlNKo14JI86bM7NCd-tBx2frYt_YU'
    }
    url = f'http://localhost:5000/loan/get/sr_no/{df.iloc[i, 0]}'
    data = requests.get(url, headers=headers)
    data = data.json()
    id = data['loan_id']
    print(id)
    url = f'http://localhost:5000/transaction/{id}/add'
    for date in range(31):
        row = 10
        myobj = {
            'amount': df.iloc[i, row + date],
            'date': (pd.to_datetime(f"01/{date+1}/2022").strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
        }
        print(myobj)
        data = requests.post(url, data=myobj, headers=headers)
        data = data.json()
        print(data)
    print()



from cmath import nan
from datetime import timedelta
import requests
import random
from pprint import pprint
import pandas as pd

df = pd.read_excel (r'MICRO feb.xlsx')
df = df[37:]

for i in range(len(df)):
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGh1cmVzaCIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNjQ5NDMyODk4fQ.9GcWMJGZbeD7PFMlNKo14JI86bM7NCd-tBx2frYt_YU'
    }
    url = f'http://localhost:5000/loan/get/sr_no/{df.iloc[i, 0]}'
    data = requests.get(url, headers=headers)
    data = data.json()
    id = data['loan_id']
    print(id)
    url = f'http://localhost:5000/transaction/{id}/add'
    for date in range(28):
        row = 9
        if df.iloc[i, row+date] == "clear":
            break
        myobj = {
            'amount': df.iloc[i, row + date],
            'date': (pd.to_datetime(f"02/{date+1}/2022").strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
        }
        print(myobj)
        data = requests.post(url, data=myobj, headers=headers)
        data = data.json()
        print(data)
    print()
    

from cmath import nan
from datetime import timedelta
import requests
import random
from pprint import pprint
import pandas as pd

df = pd.read_excel (r'MICRO 0008.xlsx')

for i in range(len(df)):
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGh1cmVzaCIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNjQ5NDMyODk4fQ.9GcWMJGZbeD7PFMlNKo14JI86bM7NCd-tBx2frYt_YU'
    }
    url = f'http://localhost:5000/loan/get/sr_no/{df.iloc[i, 0]}'
    data = requests.get(url, headers=headers)
    data = data.json()
    id = data['loan_id']
    print(id)
    url = f'http://localhost:5000/transaction/{id}/add'
    for date in range(31):
        row = 10
        myobj = {
            'amount': df.iloc[i, row + date],
            'date': (pd.to_datetime(f"03/{date+1}/2022").strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
        }
        print(myobj)
        data = requests.post(url, data=myobj, headers=headers)
        data = data.json()
        print(data)
    print()