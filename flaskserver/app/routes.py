from app import app, db
from app.models import Ticker
from flask import jsonify, request
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
import os
# from statsmodels.tsa.arima_model import ARIMA, ARMA
# from flask_cors import cross_origin
import pmdarima as pmd

UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'csv'}

def get_preds(x, num_days):
    # model = ARMA(x, order=(2,5))
    # model = model.fit(disp=-1)
    # return model.forecast(num_days)[0]
    model = pmd.auto_arima(x, start_p=1, start_q=1, test="adf", seasonal=False, m=2,error_action="ignore")
    return model.predict(30).tolist()


def add_predictions(input_df):
    last_date = pd.to_datetime(input_df.date.max())
    predict_date_range = pd.date_range(start=last_date+pd.tseries.offsets.BDay(1), periods=30, freq='B')
    close_preds = get_preds(input_df.close.values, 30)
    volume_preds = np.round(get_preds(input_df.volume.values, 30),0)
    open_preds = get_preds(input_df.open.values, 30)
    df_output = pd.DataFrame({
        'ticker':input_df.ticker.values[1],
        'date': predict_date_range,
        'open': open_preds,
        'close': close_preds,
        'volume': volume_preds,
        'type':'pred'
    })
    # np.random.randint(low= input_df.open.min(), high =input_df.open.max(),size=30)
    df_output['date'] = df_output['date'].dt.strftime('%Y-%m-%d')
    df_output = pd.concat([df_output, input_df])
    df_output = df_output.fillna(method='bfill')
    df_output = df_output.round(2)
    df_output = df_output.sort_values(by='date', ascending=False)
    return df_output

@app.route('/test')
def test():
    response = {'success': True, 'message': 'Hello from flask server!!'}
    return jsonify(response)

@app.route('/upload_ticker', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        print(request)
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file detected'})
        file = request.files['file']
        f_name, f_ext = os.path.splitext(file.filename)
        data = pd.read_csv(file)
        data.rename(columns = {"Adj Close": 'adj_close'}, inplace=True)
        data.columns = data.columns.str.lower()
        data['ticker'] = f_name
        print(data.head(2))
        data.to_sql(name='ticker', con=db.engine, index=False, if_exists ='append')
        df = pd.read_sql("select * from ticker", con=db.engine)
        response = {'success': True,'ticker':f_name, 'message': f'Saved {df.shape} records to database'}
        return jsonify(response)

@app.route('/get_tickers')
def get_tickers():
    df = pd.read_sql("select distinct ticker from ticker", con=db.engine)
    tickers = df.ticker.tolist()
    response = {'success': True, 'tickers': tickers}
    return jsonify(response)

@app.route('/get_data/<string:ticker>')
def get_data(ticker):
    print(ticker)
    df = pd.read_sql(f"select * from ticker where ticker ='{ticker}' order by date desc", con=db.engine)
    df = df[['ticker','date', 'open','close','volume']]
    print(df.shape)
    # df['type'] = 'Actual'
    # df = add_predictions(df)
    df = df.round(2)
    print(df.head(2))
    output = df.to_json(orient="records")
    # predictions = predict_df[['ticker','date', 'open','close','volume']].to_json(orient="records")
    response = {'success': True, 'data': output}
    return jsonify(response)

@app.route('/get_predictions/<string:ticker>')
# @cross_origin()
def get_predictions(ticker):
    print(ticker)
    df = pd.read_sql(f"select * from ticker where ticker ='{ticker}' order by date desc", con=db.engine)
    df = df[['ticker','date', 'open','close','volume']]
    print(df.shape)
    df['type'] = 'Actual'
    df = add_predictions(df)
    df = df.round(2)
    print(df.head(2))
    output = df.to_json(orient="records")
    # predictions = predict_df[['ticker','date', 'open','close','volume']].to_json(orient="records")
    response = {'success': True, 'data': output}
    return jsonify(response)