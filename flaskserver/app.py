from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

@app.route('/test')
def test():
    response = {'success': True, 'message': 'Hello from flask server!!'}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)