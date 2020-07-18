from flask import (render_template, url_for, flash,
                   redirect, request, abort, Blueprint)
from flask_login import current_user, login_required
from app import db
from app.models import Post
from app.posts.forms import PostForm

posts = Blueprint('posts', __name__)


@posts.route("/post/new", methods=['GET', 'POST'])
@login_required
def new_post():
    form = PostForm()
    if form.validate_on_submit():
        post = Post(title=form.title.data, content=form.content.data, author=current_user)
        db.session.add(post)
        db.session.commit()
        flash('Your post has been created!', 'success')
        return redirect(url_for('main.home'))
    return render_template('create_post.html', title='New Post', 
                        form=form, legend='New Post')

# route with variables inside them. variables can be given type like string, int etc.
@posts.route("/post/<int:post_id>")
def post(post_id):
    post = Post.query.get_or_404(post_id) #get or give 404 status
    return render_template('post.html', title=post.title, post=post)

## update post
@posts.route("/post/<int:post_id>/update", methods=['GET', 'POST'])
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
        return redirect(url_for('posts.post', post_id=post_id))
    elif request.method == 'GET':
        form.title.data = post.title
        form.content.data = post.content
    return render_template('create_post.html', title='Update Post', 
                    form=form, legend='Update Post')


## delete post
@posts.route("/post/<int:post_id>/delete", methods=['POST'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id) #get or give 404 status
    if post.author != current_user:
        abort(403) #403 for forbidden for error pages
    db.session.delete(post)
    db.session.commit()        
    flash('Your post has been deleted!', 'success')
    return redirect(url_for('main.home'))