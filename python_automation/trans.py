
from cmath import nan
from datetime import timedelta
import requests
import random
from pprint import pprint
import pandas as pd

df = pd.read_excel (r'MICRO jan.xlsx')
df = df[37:]

for i in range(len(df)):
    for date in range(31):
        row = 10
        myobj = {
            'amount': df.iloc[i, row + date],
            'date': (pd.to_datetime(df.iloc[i, 3]) + timedelta(days=date)).strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        }
        print(myobj)
    break