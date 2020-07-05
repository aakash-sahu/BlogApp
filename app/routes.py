from flask import render_template, url_for, flash, redirect, request, abort
from app import app, db, bcrypt
from app.forms import (RegistrationForm, LoginForm, UpdateAccountForm, 
                        PostForm, RequestResetForm, ResetPasswordForm)
from app.models import User, Post
from flask_login import login_user, current_user, logout_user, login_required
import secrets, os
from PIL import Image


@app.route("/")
@app.route("/home")
def home():
    # grab the page we want from query param with default as 1 as -- http://localhost:5000/?page=2
    page = request.args.get('page', 1, type=int)
    posts = Post.query.order_by(Post.date_posted.desc()).paginate(page=page, per_page=3)  # to paginate the response. also add order by to sort e.g to get the latest posts first
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
    ##resize picuture before saving to save space on file system and increase load speed of page
    output_size = (125,125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)
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

@app.route("/post/new", methods=['GET', 'POST'])
@login_required
def new_post():
    form = PostForm()
    if form.validate_on_submit():
        post = Post(title=form.title.data, content=form.content.data, author=current_user)
        db.session.add(post)
        db.session.commit()
        flash('Your post has been created!', 'success')
        return redirect(url_for('home'))
    return render_template('create_post.html', title='New Post', 
                        form=form, legend='New Post')

# route with variables inside them. variables can be given type like string, int etc.
@app.route("/post/<int:post_id>")
def post(post_id):
    post = Post.query.get_or_404(post_id) #get or give 404 status
    return render_template('post.html', title=post.title, post=post)

## update post
@app.route("/post/<int:post_id>/update", methods=['GET', 'POST'])
@login_required
def update_post(post_id):
    post = Post.query.get_or_404(post_id) #get or give 404 status
    if post.author != current_user:
        abort(403) #403 for forbidden for error pages
    form = PostForm()
    if form.validate_on_submit():
        post.title = form.title.data
        post.content = form.content.data
        db.session.commit()
        flash('Your post has been updated!', 'success')
        return redirect(url_for('post', post_id=post_id))
    elif request.method == 'GET':
        form.title.data = post.title
        form.content.data = post.content
    return render_template('create_post.html', title='Update Post', 
                    form=form, legend='Update Post')


## delete post
@app.route("/post/<int:post_id>/delete", methods=['POST'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id) #get or give 404 status
    if post.author != current_user:
        abort(403) #403 for forbidden for error pages
    db.session.delete(post)
    db.session.commit()        
    flash('Your post has been deleted!', 'success')
    return redirect(url_for('home'))


# route to see all posts from a user when someone click on the user's name
@app.route("/user/<string:username>")
def user_posts(username):
    # grab the page we want from query param with default as 1 as -- http://localhost:5000/?page=2
    page = request.args.get('page', 1, type=int)
    user = User.query.filter_by(username=username).first_or_404() #get the first user with this username or 404
    posts = Post.query.filter_by(author=user)\
        .order_by(Post.date_posted.desc())\
        .paginate(page=page, per_page=3)  # to paginate the response. also add order by to sort e.g to get the latest posts first
    return render_template('user_posts.html', posts=posts, user=user) 

def send_reset_email(user):
    pass


#Route for requesting pass reset
@app.route("/reset_password", methods=['GET', 'POST'])
def reset_request():
    if current_user.is_authenticated:
        retun redirect(url_for('home'))

    form = RequestResetForm()
    # once form is submitted verify user's email and send email
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        send_reset_email(user)
        flash('An email has been send with instructions to reset your password.', 'info')
        return redirect(url_for('login'))
    return render_template('reset_request.html', title='Reset Password', 
                        form=form)

#Route for requesting pass reset
@app.route("/reset_password/<token>", methods=['GET', 'POST'])
def reset_token(token):
    if current_user.is_authenticated:
        retun redirect(url_for('home'))
    user = User.verify_reset_token(token) #if no user, token is expired or wrong user
    if user is None:
        flash('That is an invalid or expired token', 'warning')
        return redirect(url_for('reset_request'))
    #if valid, show form to update password
    form = ResetPasswordForm()
    return render_template('reset_token.html', title='Reset Password', form=form)