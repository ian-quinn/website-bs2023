from flask_wtf import FlaskForm
from datetime import datetime
from flask import request
from wtforms import StringField, TextAreaField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import Message

######################################################################################
#------------------------------search engine forms -----------------------------------

class MessageForm(FlaskForm):
	firstname = StringField('First Name', validators=[DataRequired(message="Mandatory input"), 
		Length(1, 32, message="Length must be less than 32 characters")])
	lastname = StringField('Last Name', validators=[DataRequired(message="Mandatory input"), 
		Length(1, 32, message="Length must be less than 32 characters")])
	email = StringField('Email', validators=[DataRequired(message="Mandatory input"), 
		Email(message="Please check the format of your email")])
	message = TextAreaField('Message', validators=[DataRequired(message="Mandatory input"), 
		Length(1, 5000, message="Must be within 5000 characters")])
	is_optin = BooleanField('Opt-in', default=True)
	submit = SubmitField('Submit')

class EnrollForm(FlaskForm):
	email = StringField('Email', validators=[DataRequired(message="Mandatory input"), 
		Email(message="Please check the format of your email")])
	is_optin = BooleanField('Opt-in', default=True)
	submit = SubmitField('GO!')