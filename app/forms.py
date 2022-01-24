from flask_wtf import FlaskForm
from datetime import datetime
from flask import request
from wtforms.validators import DataRequired


######################################################################################
#------------------------------search engine forms -----------------------------------

class SearchForm(FlaskForm):
	q = StringField('Searchingngngn', validators=[DataRequired()])

	def __init__(self, *args, **kwargs):
		if 'formdata' not in kwargs:
			kwargs['formdata'] = request.args
		if 'csrf_enabled' not in kwargs:
			kwargs['csrf_enabled'] = False
		super(SearchForm, self).__init__(*args, **kwargs)