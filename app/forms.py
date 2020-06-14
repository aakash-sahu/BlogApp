from flask_wtf import FlaskForm
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

#also need to set a secret key for the cookies
# In python terminal
# import secrets
#>>> secrets.token_hex(16)
#'656dd199eb5c5c86d449ae28f3d0fcc8' -- can make it env var later