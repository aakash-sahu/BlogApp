from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads')
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

from app import routes