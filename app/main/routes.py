from flask import render_template, request, Blueprint
from app.models import Post

main = Blueprint('main', __name__)


@main.route("/")
@main.route("/home")
def home():
    # grab the page we want from query param with default as 1 as -- http://localhost:5000/?page=2
    page = request.args.get('page', 1, type=int)
    posts = Post.query.order_by(Post.date_posted.desc()).paginate(page=page, per_page=3)  # to paginate the response. also add order by to sort e.g to get the latest posts first
    return render_template('home.html', posts=posts) # template will have access to posts variable

@main.route("/about")
def about():
    return render_template('about.html', title = 'About') # template will have access to title variable