
from cmath import nan
from datetime import timedelta
import requests
import random
from pprint import pprint
import pandas as pd

df = pd.read_excel (r'MICRO april.xlsx')

for i in range(len(df)):
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGh1cmVzaCIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNjQ5NDMyODk4fQ.9GcWMJGZbeD7PFMlNKo14JI86bM7NCd-tBx2frYt_YU'
    }
    url = f'http://localhost:5000/loan/get/sr_no/{df.iloc[i, 0]}'
    data = requests.get(url, headers=headers)
    data = data.json()
    id = data['loan_id']
    url = f'http://localhost:5000/transaction/{id}/add'
    for date in range(13):
        row = 10
        myobj = {
            'amount': df.iloc[i, row + date],
            'date': (pd.to_datetime(f"04/{date+1}/2022").strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
        }
        print(myobj)
        data = requests.post(url, data=myobj, headers=headers)
        data = data.json()
        print(data)
    print()