from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SECRET_KEY'] = '656dd199eb5c5c86d449ae28f3d0fcc8'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db' #/// means relative path
# set up db with app
db = SQLAlchemy(app)

# Routes need to be imported so app can find them when running the application
# Put routes import here to avoid circular import??
from app import routes