from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
from app.config import Config

app = Flask(__name__)
app.config.from_object(Config)

# set up db with app
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'users.login' # set as function name of login route
login_manager.login_message_category = 'info' ##make the login message better with bootstrap class


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

