from app import app, db
from app.models import Ticker
from flask import jsonify, request
from werkzeug.utils import secure_filename
import pandas as pd
import os

UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'csv'}

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
        response = {'success': True, 'message': f'Saved {df.shape} records to database'}
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
    df = pd.read_sql(f"select * from ticker where ticker ='{ticker}'", con=db.engine)
    output = df[['ticker','date', 'open','close']].to_json(orient="records")
    response = {'success': True, 'data': output}
    return jsonify(response)