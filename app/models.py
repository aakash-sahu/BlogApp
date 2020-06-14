from datetime import datetime
from app import db, login_manager
from flask_login import UserMixin #this adds isauthenticated, isactive and other methods to us

# for login as per documentation of login_manager
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

## DB models
class User(db.Model, UserMixin):
    #add columns for table
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpeg')
    password = db.Column(db.String(60), nullable=False)
    ## add post attributes. One to many relationship with posts
    posts = db.relationship('Post', backref='author', lazy=True) #backref similar to adding another column 'author' at run time to Post table. we also won't see posts column in user. 
    # Capital letter Post as it denotes relationship to class Post to get user by using 'author' 'field within Post.
    #lazy define when sqlA loads data from db and true means it loads in one go.

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.image_file}')"

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow) #no () in datetime .always use utc time
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) ## user.id is id of user. lowercase 'u' because we're referencing the table

    def __repr__(self):
        return f"Post('{self.title}', '{self.date_posted}')"
