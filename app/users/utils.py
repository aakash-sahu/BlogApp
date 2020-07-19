import os
import secrets
from PIL import Image
from flask import url_for, current_app
from flask_mail import Message
from app import mail


# function to save picture in database
def save_picture(form_picture):
    #change name of file to a random name
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    # add picture to root path of application + profile photo folder
    picture_path = os.path.join(current_app.root_path, 'static/profile_pics', picture_fn)
    ##resize picuture before saving to save space on file system and increase load speed of page
    output_size = (125,125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)
    # return file name of picture
    return picture_fn


# send email with reset token
def send_reset_email(user):
    token = user.get_reset_token()
    msg = Message('Password Reset Request', sender='noreply@demo.com', 
                    recipients=[user.email])
    # external = true to get the absolute url not relative.Can also use jinja to create a more complex email
    msg.body = f'''To reset your password, visit the following link:
{url_for('users.reset_token', token=token, _external=True)}

If you did not make this request then simply ignore this email and no changes will be made.
'''

    mail.send(msg)


    
#also need to set a secret key for the cookies
# In python terminal
# import secrets
#>>> secrets.token_hex(16)
#'656dd199eb5c5c86d449ae28f3d0fcc8' -- can make it env var later