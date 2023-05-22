from flask_wtf import FlaskForm
from datetime import datetime
from flask import request
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, TextAreaField, BooleanField, SubmitField, SelectField, FileField, DateField, RadioField
from wtforms.validators import DataRequired, Email, ValidationError, Length, EqualTo
from app.models import Message, Reviewer, Invitation, Accommodation, Certificate

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



class ReviewerForm(FlaskForm):
	def FileSizeLimit(max_size_in_mb):
	    max_bytes = max_size_in_mb*1024*1024
	    def file_length_check(form, field):
	        if len(field.data.read()) > max_bytes:
	            raise ValidationError(f"File size must be less than {max_size_in_mb}MB")
	        field.data.seek(0)
	    return file_length_check

	title = SelectField('Title', choices=[(1,'Ms.'), (2,'Mr.'), (3,'Dr.'), (4,'Prof.')], default=3, coerce=int)
	firstname = StringField('First & Middle Name', validators=[
		DataRequired(message="This field is mandatory"), 
		Length(1, 32, message="Length must be less than 32 characters")])
	lastname = StringField('Last Name', validators=[
		DataRequired(message="This field is mandatory"), 
		Length(1, 32, message="Length must be less than 32 characters")])
	email = StringField('Email', validators=[
		DataRequired(message="This field is mandatory"), 
		Email(message="Please check the format of your email")])
	email_repeat = StringField('Confirmed Email', validators=[
		DataRequired(message="This field is mandatory"), 
		EqualTo('email', message="Email address not exactly the same")])
	organization = StringField('First & Middle Name', validators=[
		DataRequired(message="This field is mandatory"), 
		Length(1, 128, message="Length must be less than 128 characters")])
	bio = TextAreaField('Bio statement', validators=[Length(0, 1000)])
	orcid = StringField('ORCID')
	file = FileField('Choose PDF', validators=[
		FileAllowed(['pdf', 'PDF'], message='PDF only'), 
		FileSizeLimit(max_size_in_mb=2)])
	signed = BooleanField('Signed', default=True)
	submit = SubmitField('Submit')

	def validate_email(self, email):
		reviewer = Reviewer.query.filter_by(email=email.data).first()
		if reviewer is not None:
			raise ValidationError('You have registered to our list of reviewers')

	def validate_orcid(self, orcid):
		def get_check_num(orcid_str):
			total = 0
			for i in range(len(orcid_str) - 1):
				if orcid_str[i].isdigit():
					total = (total + int(orcid_str[i])) * 2
				if orcid_str[i] == "X":
					total = (total + 10) * 2
				else:
					continue
					
			remainder = total % 11
			result = (12 - remainder) % 11
			if result == 10:
				return "X"
			else:
				return str(result)
		code = orcid.data
		if code != "":
			if get_check_num(code) != code[-1]:
				raise ValidationError('Your ORCID may not be valid')

class CertificateForm(FlaskForm):
	email = StringField('Email address of your ConfTool account', validators=[
		DataRequired(message="This field is mandatory"), 
		Email(message="Please check the format of your email")])
	submit = SubmitField('Submit')


class InvitationForm(FlaskForm):
	def FileSizeLimit(max_size_in_mb):
	    max_bytes = max_size_in_mb*1024*1024
	    def file_length_check(form, field):
	        if len(field.data.read()) > max_bytes:
	            raise ValidationError(f"File size must be less than {max_size_in_mb}MB")
	        field.data.seek(0)
	    return file_length_check

	email = StringField('Email address of your ConfTool account', validators=[
		DataRequired(message="This field is mandatory"), 
		Email(message="Please check the format of your email")])

	name = StringField('Name', validators=[
		DataRequired(message="This field is mandatory"), 
		Length(1, 32, message="Length must be less than 32 characters")])
	gender = SelectField('Gender', choices=[(1,'Male'), (2,'Female')], default=1, coerce=int)
	date_birth = DateField('Date of birth', format='%Y-%m-%d', validators=[DataRequired()])

	passport_no = StringField('Passport No.', validators=[DataRequired(message="The passport number is mandatory")])
	passport_country = StringField('Country of Issue', validators=[DataRequired(message="The passport number is mandatory")])
	
	date_arrival = DateField('Arrival date planned', format='%Y-%m-%d', validators=[DataRequired()])
	date_departure = DateField('Departure date planned', format='%Y-%m-%d', validators=[DataRequired()])

	delegate_type = SelectField('Academic/Exhibitor', choices=[(1,'Academic'), (2,'Exhibitor')], default=1, coerce=int)
	application_type = SelectField('For visa application?', choices=[(1,'Yes'), (2,'No')], default=1, coerce=int)
	requirement = TextAreaField('State your specific needs', validators=[Length(0, 1000)])

	file = FileField('Choose PDF', validators=[
		FileAllowed(['pdf', 'PDF'], message='Not quite the right format'), 
		FileSizeLimit(max_size_in_mb=2)])

	submit = SubmitField('Submit')

	def validate_email(self, email):
		invitation = Invitation.query.filter_by(email=email.data).first()
		if invitation is not None:
			raise ValidationError('You have submitted the request.')

class AccommodationForm(FlaskForm):
	email = StringField('Email address of your ConfTool account', validators=[
		DataRequired(message="This field is mandatory"), 
		Email(message="Please check the format of your email")])

	title = SelectField('Title', choices=[(1,'Mrs.'), (2,'Ms.'), (3,'Mr.'), (4,'Other')], default=4, coerce=int)
	firstname = StringField('First & Middle Name', validators=[
		DataRequired(message="This field is mandatory"), 
		Length(1, 32, message="Length must be less than 32 characters")])
	lastname = StringField('Last Name', validators=[
		DataRequired(message="This field is mandatory"), 
		Length(1, 32, message="Length must be less than 32 characters")])

	country = StringField('Country of Issue', validators=[DataRequired(message="The passport number is mandatory")])
	
	date_checkin = DateField('Check-in date', format='%Y-%m-%d', validators=[DataRequired()])
	date_checkout = DateField('Check-out date', format='%Y-%m-%d', validators=[DataRequired()])

	room_type = RadioField('Room type', choices=[(1,'King'), (2,'Twin')], default=1, coerce=int)
	guest_firstname = StringField('Guest firstname')
	guest_lastname = StringField('Guest lastname')
	is_visa = BooleanField('Do you need hotel reservation document for visa?', default=False)
	requirement = TextAreaField('State your specific needs', validators=[Length(0, 200)])

	submit = SubmitField('Submit')

	def validate_email(self, email):
		accommodation = Accommodation.query.filter_by(email=email.data).first()
		if accommodation is not None:
			raise ValidationError('You have received your booking request.')
	def validate_date_checkout(self, date_checkout):
		if date_checkout.data <= self.date_checkin.data:
			raise ValidationError('Sorry, we do not have time travel service.')

class RetrieveAccommodationForm(FlaskForm):
	email = StringField('Email address of your ConfTool account', validators=[
		DataRequired(message="This field is mandatory"), 
		Email(message="Please check the format of your email")])
	submit = SubmitField('Submit')
