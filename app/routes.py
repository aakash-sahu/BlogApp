from flask import render_template, url_for, flash, redirect, request
from app import app, db, bcrypt
from app.forms import RegistrationForm, LoginForm, UpdateAccountForm
from app.models import User, Post
from flask_login import login_user, current_user, logout_user, login_required
import secrets, os

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
    # if user is authenticated, send them to home page if they click on register or login link
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email = form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash(f'Your account has been created. You are now able to log in', 'success') #on POST form calls back the same method and loads up the values as .data attribute
        # 'success' is from bootstrap, flash can take this as argument.
        # next redirect to home page on success
        return redirect(url_for('login')) ## redirect every link is the name of function
    return render_template('register.html', title='Register', form = form)

@app.route("/login", methods=['GET', 'POST'])
def login():
    # if user is authenticated, send them to home page if they click on register or login link
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    # check if user is valid
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next') # go the page in the query params. args is a dictionary and using get method so don't get error
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form = form)

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))

# function to save picture in database
def save_picture(form_picture):
    #change name of file to a random name
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    # add picture to root path of application + profile photo folder
    picture_path = os.path.join(app.root_path, 'static/profile_pics', picture_fn)
    form_picture.save(picture_path)
    # return file name of picture
    return picture_fn


@app.route("/account", methods=['GET', 'POST'])
@login_required # require login and also add login page to the login manager
def account():
    form = UpdateAccountForm()
    if form.validate_on_submit():
        # Validate picture data and set picture
        if form.picture.data:
            picture_file = save_picture(form.picture.data)
            # now set the picture of user to new pic
            current_user.image_file = picture_file

        current_user.username = form.username.data
        current_user.email = form.email.data
        db.session.commit()
        flash('Your account has been updated!', 'success')
        return redirect(url_for('account')) ## redirect important post get redirect pattern. to avoid browser asking do you want to submit again. redirect will send get request and error wont' happen.
    # populate the field with current user's data
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    # pass image file
    image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
    return render_template('account.html', title='Account', 
                            image_file=image_file, form=form)
