from flask import Flask, render_template, url_for, flash, redirect
from flask_sqlalchemy import SQLAlchemy
from forms import RegistrationForm, LoginForm
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = '656dd199eb5c5c86d449ae28f3d0fcc8'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db' #/// means relative path
# set up db with app
db = SQLAlchemy(app)

## DB models
class User(db.Model):
    #add columns for table
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpeg')
    password = db.Column(db.String(60), nullable=False)
    ## add post attributes. One to many relationship with posts
    posts = db.relationship('Post', backref='author', lazy=True) #backref similar to adding another column 'author' at run time to Post table. we also won't see posts column in user. 
    # Capital Post as it denotes relationship to class Post to get user by using 'author' 'field within Post.
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

posts = [
    {
        'author': 'John Doe',
        'title': 'Blog Post 1',
        'content': 'First post content',
        'date_posted': "Jan 1, 2020"
    },
        {
        'author': 'Jane Doe',
        'title': 'Blog Post 2',
        'content': 'Second post content',
        'date_posted': "Jan 2, 2020"
    },
]

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', posts=posts) # template will have access to posts variable

@app.route("/about")
def about():
    return render_template('about.html', title = 'About') # template will have access to title variable

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        flash(f'Account create for {form.username.data}!', 'success') #on POST form calls back the same method and loads up the values as .data attribute
        # 'success' is from bootstrap, flash can take this as argument.
        # next redirect to home page on success
        return redirect(url_for('home')) ## redirect every link is the name of function
    return render_template('register.html', title='Register', form = form)

@app.route("/login", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        ## validate login form with a fake login
        if form.email.data == 'admin@blog.com' and form.password.data == 'password':
            flash('You have been logged in!', 'success')
            return redirect(url_for('home')) ## for redirect every link is the name of function
        else:
            flash('Login Unsuccessful. Please check username and password', 'danger')
    return render_template('login.html', title='Login', form = form)

if __name__ == "__main__":
    app.run(debug=True)