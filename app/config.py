from .mail import email_password, email_user

## set most secret stuff into env variable e.g. secret key and db_uri
class Config:
    SECRET_KEY = '656dd199eb5c5c86d449ae28f3d0fcc8'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db' #/// means relative path
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = email_user
    MAIL_PASSWORD = email_password