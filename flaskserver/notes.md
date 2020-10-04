## to create database
# from a python shell
from app import db
db.create_all()
from app.models import Ticker