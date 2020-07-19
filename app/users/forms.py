from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from flask_login import current_user
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

# reset password form
class RequestResetForm(FlaskForm):
    email = StringField('Email', 
                            validators=[DataRequired(),Email()])
    submit = SubmitField('Request Password Reset')

    # check if email doesn't request i.e. user doens't have account
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is None:
            raise ValidationError('There is no account with that emai. You must register first!')

# form to reset the password once user identity is verified
class ResetPasswordForm(FlaskForm):
    
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', 
                            validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Reset Password')