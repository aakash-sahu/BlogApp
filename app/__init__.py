from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_mail import Mail
from app.config import Config

# set up db with app
db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'users.login' # set as function name of login route
login_manager.login_message_category = 'info' ##make the login message better with bootstrap class

mail = Mail()


## move creation of app to a function to allow to create diff instances of app with different config
# don't move extensions here so same extensions can be used for diff configs
def create_app(config_class=Config):

    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)

    # Routes need to be imported so app can find them when running the application
    # Put routes import here to avoid circular import??
    ## Now import from blueprints and register with the app
    from app.users.routes import users
    from app.posts.routes import posts
    from app.main.routes import main

    app.register_blueprint(users)
    app.register_blueprint(posts)
    app.register_blueprint(main)

    return app

