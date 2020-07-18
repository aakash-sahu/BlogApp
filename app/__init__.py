from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
from .mail import email_password, email_user
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = '656dd199eb5c5c86d449ae28f3d0fcc8'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db' #/// means relative path
# set up db with app
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'users.login' # set as function name of login route
login_manager.login_message_category = 'info' ##make the login message better with bootstrap class
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = email_user
app.config['MAIL_PASSWORD'] = email_password
mail = Mail(app)
# Routes need to be imported so app can find them when running the application
# Put routes import here to avoid circular import??

## Now import from blueprints and register with the app
from app.users.routes import users
from app.posts.routes import posts
from app.main.routes import main


app.register_blueprint(users)
app.register_blueprint(posts)
app.register_blueprint(main)

