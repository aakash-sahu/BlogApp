import pandas as pd
from app import db
from app.models import Ticker

def create_ticker_data(f_name, input):
    input_df = input.copy()
    input_df.rename(columns = {"Adj Close": 'adj_close'}, inplace=True)
    input_df.columns = input_df.columns.str.lower()
    input_df['date'] = pd.to_datetime(input_df['date'])
    input_df['ticker'] = f_name
    input_df['id'] = input_df['ticker'] + '-' + input_df['date'] .dt.strftime("%Y%m%d")
    input_df = input_df[['id', 'date', 'open', 'high' ,'low', 'close', 'adj_close', 'volume', 'ticker']]

    query= db.engine.execute(f"select max(date) from ticker_data where ticker = '{f_name}'")
    max_date_current = query.fetchone()
    max_date_current = max_date_current[0] if max_date_current[0] is not None else '1900-01-01'

    output_df = input_df[input_df.date > max_date_current]
    print(output_df.shape)
    return output_df