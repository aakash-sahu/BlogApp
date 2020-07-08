from app import app, db
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

@app.route('/upload_ticker', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        print(request)
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file detected'})
        file = request.files['file']
        data = pd.read_csv(file)
        data.rename(columns = {"Adj Close": 'adj_close'}, inplace=True)
        data.columns = data.columns.str.lower()
        data.to_sql(name='ticker_data', con=db.engine, index=False, if_exists ='append')
        df = pd.read_sql("select * from ticker_data", con=db.engine)
        response = {'success': True, 'message': f'saved {df.shape} records to database'}
        return jsonify(response)