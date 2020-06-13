from flask_wtf import FlaskForm
# Form elements come from wtform
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo

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