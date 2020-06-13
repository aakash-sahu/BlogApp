from flask import render_template, url_for, flash, redirect
from app import app
from app.forms import RegistrationForm, LoginForm
from app.models import User, Post

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
