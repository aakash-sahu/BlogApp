from flask import render_template, url_for, flash, redirect, request, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from app import db, bcrypt
from app.models import User, Post
from app.users.forms import (RegistrationForm, LoginForm, UpdateAccountForm,
                                   RequestResetForm, ResetPasswordForm)
from app.users.utils import save_picture, send_reset_email


users = Blueprint('users', __name__)

## Create routes for users blueprint and then register with main userslication
##replaced the app.route to users.route
@users.route("/register", methods=['GET', 'POST'])
def register():
    # if user is authenticated, send them to home page if they click on register or login link
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email = form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash(f'Your account has been created. You are now able to log in', 'success') #on POST form calls back the same method and loads up the values as .data attribute
        # 'success' is from bootstrap, flash can take this as argument.
        # next redirect to home page on success
        return redirect(url_for('users.login')) ## redirect every link is the name of function
    return render_template('register.html', title='Register', form = form)

@users.route("/login", methods=['GET', 'POST'])
def login():
    # if user is authenticated, send them to home page if they click on register or login link
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form = LoginForm()
    # check if user is valid
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next') # go the page in the query params. args is a dictionary and using get method so don't get error
            return redirect(next_page) if next_page else redirect(url_for('main.home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form = form)

@users.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('main.home'))

@users.route("/account", methods=['GET', 'POST'])
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
        return redirect(url_for('users.account')) ## redirect important post get redirect pattern. to avoid browser asking do you want to submit again. redirect will send get request and error wont' husersen.
    # populate the field with current user's data
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    # pass image file
    image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
    return render_template('account.html', title='Account', 
                            image_file=image_file, form=form)
                            

# route to see all posts from a user when someone click on the user's name
@users.route("/user/<string:username>")
def user_posts(username):
    # grab the page we want from query param with default as 1 as -- http://localhost:5000/?page=2
    page = request.args.get('page', 1, type=int)
    user = User.query.filter_by(username=username).first_or_404() #get the first user with this username or 404
    posts = Post.query.filter_by(author=user)\
        .order_by(Post.date_posted.desc())\
        .paginate(page=page, per_page=3)  # to paginate the response. also add order by to sort e.g to get the latest posts first
    return render_template('user_posts.html', posts=posts, user=user) 


#Route for requesting pass reset
@users.route("/reset_password", methods=['GET', 'POST'])
def reset_request():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))

    form = RequestResetForm()
    # once form is submitted verify user's email and send email
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        send_reset_email(user)
        flash('An email has been send with instructions to reset your password.', 'info')
        return redirect(url_for('users.login'))
    return render_template('reset_request.html', title='Reset Password', 
                        form=form)

#Route for requesting pass reset
@users.route("/reset_password/<token>", methods=['GET', 'POST'])
def reset_token(token):
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    user = User.verify_reset_token(token) #if no user, token is expired or wrong user
    if user is None:
        flash('That is an invalid or expired token', 'warning')
        return redirect(url_for('users.reset_request'))
    #if valid, show form to update password
    form = ResetPasswordForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user.password = hashed_password
        db.session.commit()
        flash(f'Your password has been updated. You are now able to log in', 'success') #on POST form calls back the same method and loads up the values as .data attribute
        return redirect(url_for('users.login')) ## redirect every link is the name of function
    return render_template('reset_token.html', title='Reset Password', form=form)