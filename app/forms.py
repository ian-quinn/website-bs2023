from flask_wtf import FlaskForm
from datetime import datetime
from flask import request
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, TextAreaField, BooleanField, SubmitField, SelectField, FileField, DateField, RadioField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError, Length, EqualTo, InputRequired, NumberRange
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

class PaperAcceptanceForm(FlaskForm):
	index = IntegerField('Your contribution ID', validators=[NumberRange(min=0, max=3000), 
		DataRequired(message="This field is mandatory")])
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

	country = StringField('Country of Issue', validators=[DataRequired(message="This field is mandatory")])
	
	date_checkin = DateField('Check-in date', format='%Y-%m-%d', validators=[DataRequired()])
	date_checkout = DateField('Check-out date', format='%Y-%m-%d', validators=[DataRequired()])

	room_type = RadioField('Room type', choices=[(1,'King'), (2,'Twin')], default=1, coerce=int)
	guest_firstname = StringField('Guest firstname')
	guest_lastname = StringField('Guest lastname')
	is_visa = BooleanField('Do you need hotel reservation document for visa?', default=False)
	requirement = TextAreaField('State your specific needs', validators=[Length(0, 200)])

	company = StringField('Your company or organization')
	no_fax = StringField('Fax Number')
	no_phone = StringField('Phone Number')
	flight_arrival = StringField('Number of your flight on arrival')
	flight_departure = StringField('Number of your flight on departure')

	no_confirmation = StringField('Confirmation Number')

	submit = SubmitField('Submit')

	def validate_email(self, email):
		accommodation = Accommodation.query.filter_by(email=email.data).first()
		if accommodation is not None:
			raise ValidationError('Your request has been processing. Please contact secretariat@bs2023.org for changes.')

	def validate_date_checkout(self, date_checkout):
		if date_checkout.data <= self.date_checkin.data:
			raise ValidationError('Sorry, we do not have time travel service.')

class RetrieveAccommodationForm(FlaskForm):
	email = StringField('Email address of your ConfTool account', validators=[
		DataRequired(message="This field is mandatory"), 
		Email(message="Please check the format of your email")])
	submit = SubmitField('Submit')


class LoginForm(FlaskForm):
	email = StringField('Email', validators=[DataRequired()])
	submit = SubmitField('Request Magic Link')


class SurveyForm(FlaskForm):
	is_author = BooleanField('Presenter/Author', default=False)
	is_reviewer = BooleanField('Reviewer', default=False)
	is_exhibitor = BooleanField('Exhibitor', default=False)
	is_other = BooleanField('Other', default=False)

	qA = SelectField('Participation Mode', 
		choices=[(0, '-- select an option --'), (1, 'Physical attendance'), (2, 'Virtual attendance')], 
		coerce=int, validators=[NumberRange(min=1, max=10, message='Pick an option')], default=0)

	qB = SelectField('What type of institution do you work', 
		choices=[(0, '-- select an option --'), (1, 'University'), (2, 'Large research institute / Government'), (3, 'Consulting / Engineering firm'), 
		(4, 'Other private company'), (5, 'Architectural practice'), (6, 'Energy utility'), (7, 'Other')], 
		coerce=int, validators=[NumberRange(min=1, max=10, message='Pick an option')], default=0)
	qC = SelectField('What is the nature of your work', 
		choices=[(0, '-- select an option --'), (1, 'Researcher'), (2, 'Student'), (3, 'Teacher'), (4, 'Software developer'), 
		(5, 'Design engineer'), (6, 'Energy consultant'), (7, 'Other')], 
		coerce=int, validators=[NumberRange(min=1, max=10, message='Pick an option')], default=0)

	#--------------------------------------------------------------
	q01 = RadioField('Usefulness of the conference', choices=[(1, 'very useful'), (2, 'somewhat useful'), (3, 'not useful')], coerce=int) 
	q02 = RadioField('As presenter/author, how did you find the review process', 
		choices=[(0, 'not applicable'), (1, 'too lenient'), (2, 'appropriate'), (3, 'rigorous'), (4, 'overly rigorous'), (5, 'no opinion')], default=0)
	q03 = RadioField('As reviewer, how did you find the review process', 
		choices=[(0, 'not applicable'), (1, 'Appropriate'), (2, 'too much work'), (3, 'willing to do more reviews')], default=0)
	q04 = RadioField('Usefulness of the website', 
		choices=[(1, 'excellent'), (2, 'very good'), (3, 'good'), (4, 'acceptable'), (5, 'poor')])
	q05 = RadioField('Conference fees', 
		choices=[(1, 'reasonable'), (2, 'too expensive'), (3, 'willing to pay more')])
	q06 = RadioField('Usefulness of the keynote speech', 
		choices=[(1, 'very useful'), (2, 'somewhat useful'), (3, 'neutral'), (4, 'not useful'), (5, 'did not attend')])
	q07 = RadioField('Rate the technical papers overall quality', 
		choices=[(1, 'excellent'), (2, 'very good'), (3, 'good'), (4, 'acceptable'), (5, 'poor')])
	q08 = RadioField('The length of the conference/number of days/number of sessions', 
		choices=[(1, 'just right'), (2, 'too long'), (3, 'too short')])
	q09 = RadioField('How did you hear about the BS conference', 
		choices=[(1, 'e-mail announcement'), (2, 'word-of-mouth'), (3, 'website of other institution'), (4, 'printed announcement'), (5, 'previous IBPSA event'), (6, 'other')])
	
	q10 = RadioField('Will you attend BS2025', choices=[(1, "yes"), (2, 'no')])
	q11 = RadioField('Did you attend BS2021', choices=[(1, "yes"), (2, 'no')])
	q12 = TextAreaField('General comments', validators=[Length(max=500)], default='')
	#-------------------------------------------------------
	p01 = RadioField('Rate the meeting facilities and location', 
		choices=[(0, ''), (1, 'excellent'), (2, 'very good'), (3, 'good'), (4, 'acceptable'), (5, 'poor')], default=0)
	p02 = RadioField('Rate the pick-up/shuttle bus service', 
		choices=[(0, ''), (1, 'excellent'), (2, 'very good'), (3, 'good'), (4, 'acceptable'), (5, 'poor')], default=0)
	p03 = RadioField('Was there sufficient time to network and socialize', choices=[(0, ''), (1, "yes"), (2, 'no')], default=0)
	p04 = RadioField('how did you find the exhibition in general', choices=[(0, ''), (1, 'very useful'), (2, 'somewhat useful'), (3, 'not useful')], default=0)
	p05 = RadioField('Rate the scientific quality of the poster session', 
		choices=[(0, ''), (1, 'very useful'), (2, 'somewhat useful'), (3, 'neutral'), (4, 'not useful'), (5, 'did not view')], default=0)
	p06 = RadioField('Rate the social program (reception, banquet, river cruise)', 
		choices=[(0, ''), (1, 'excellent'), (2, 'very good'), (3, 'good'), (4, 'acceptable'), (5, 'poor')], default=0)
	p07 = RadioField('Rate the venue and catering, suitable for the conference', 
		choices=[(0, ''), (1, 'agree'), (2, 'neutral'), (3, 'disagree')], default=0)
	p08 = RadioField('Rate the conference guide system', 
		choices=[(0, ''), (1, 'clear and easy to find'), (2, 'neutral'), (3, 'get lost in the venue')], default=0)
	#-------------------------------------------------------
	v01 = RadioField('Rate the quality of the audio', choices=[(0, ''), (1, 'good'), (2, 'acceptable'), (3, 'poor')], default=0)
	v02 = RadioField('Rate the quality of the video', choices=[(0, ''), (1, 'good'), (2, 'acceptable'), (3, 'poor')], default=0)
	v03 = RadioField('What did you think of the online sessions', choices=[(0, ''), (1, 'good'), (2, 'acceptable'), (3, 'poor')], default=0)
	v04 = TextAreaField('Suggestions for online sessions', validators=[Length(max=500)], default='')
	v05 = RadioField('Did you get a chance to ask questions', choices=[(0, ''), (1, "yes"), (2, 'no')], default=0)
	v06 = TextAreaField('Reason why', validators=[Length(max=500)], default='')
	v07 = RadioField('Clear guidelines/templates for producing the video?', choices=[(0, ''), (1, "yes"), (2, 'no')], default=0)
	v08 = RadioField('Rate the live-streaming and video replay', 
		choices=[(0, ''), (1, 'very useful'), (2, 'somewhat useful'), (3, 'neutral'), (4, 'not useful'), (5, 'did not view')], default=0)
	v09 = RadioField('Willing to pay more for online sessions?', 
		choices=[(0, ''), (1, 'to pay significantly higher fees (comparable to physical attendance fees) to join such a hybrid conference remotely'), 
				 (2, 'or prefer lower fees for just viewing streaming of sessions'), 
				 (3, 'or only interested in physically attending a Building Simulation conference in future')], default=0)

	#------------------------------------------------------------

	submit = SubmitField('Submit')