from datetime import datetime
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer # for timed token for password forget
from app import db, login_manager, app
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

    # password reset
    def get_reset_token(self, expires_sec=1800):
        s = Serializer(app.config['SECRET_KEY'], expires_sec)
        return s.dumps({'user_id': self.id}).decode('utf-8') #include payload of user id
    
    @staticmethod
    def verify_reset_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token)['user_id']
        except:
            return None
        return User.query.get(user_id)

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
