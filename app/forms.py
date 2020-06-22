from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from flask_login import current_user
# Form elements come from wtform
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from app.models import User

#python classes as forms which will convert to HTML on execution
# Sign up form
class RegistrationForm(FlaskForm):
    username = StringField('Username', 
                            validators=[DataRequired(), Length(min=2, max=20)]) #'Username' will be label in HTML
    
    email = StringField('Email', 
                            validators=[DataRequired(),Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', 
                            validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

    # custom validation to check for unique username for example
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('That username is taken. Please choose a different one')

    # custom validation to check for unique username for example
    def validate_email(self, email):
        email = User.query.filter_by(email=email.data).first()
        if email:
            raise ValidationError('That email is taken. Please choose a different one')


# Login up form
class LoginForm(FlaskForm):
    email = StringField('Email', 
                            validators=[DataRequired(),Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

## Update account details form.
class UpdateAccountForm(FlaskForm):
    username = StringField('Username', 
                            validators=[DataRequired(), Length(min=2, max=20)]) #'Username' will be label in HTML
    
    email = StringField('Email', 
                            validators=[DataRequired(),Email()])

    picture= FileField('Update profile picture', validators=[FileAllowed(['jpg', 'png'])])
    submit = SubmitField('Update')

    ## removed password and confirm password as will add another feature to reset pwd
    # custom validation to check for unique username for example.in account update validation should run only if user submit diff uname or email
    def validate_username(self, username):
        # run validation only if username is different. do the same for email.
        if username.data != current_user.username:
            user = User.query.filter_by(username=username.data).first()
            if user:
                raise ValidationError('That username is taken. Please choose a different one')

    # custom validation to check for unique username for example
    def validate_email(self, email):
        if email.data != current_user.email:
            email = User.query.filter_by(email=email.data).first()
            if email:
                raise ValidationError('That email is taken. Please choose a different one')


#also need to set a secret key for the cookies
# In python terminal
# import secrets
#>>> secrets.token_hex(16)
#'656dd199eb5c5c86d449ae28f3d0fcc8' -- can make it env var later