import os, re, json
import time
from datetime import datetime

from flask import flash
from flask import render_template, send_from_directory, current_app
from flask import redirect, url_for, request, make_response, jsonify
from flask import get_flashed_messages, g
from flask_babel import gettext as _
from flask_babel import lazy_gettext as _l
from werkzeug.urls import url_parse
from werkzeug.utils import secure_filename
from babel import Locale

from app import app, db
from app.models import Message
from app.forms import MessageForm, EnrollForm


@app.route('/')
@app.route('/index', methods=['GET', 'POST'])
def index():
    form = EnrollForm()
    if form.validate_on_submit():
        message = Message(
            firstname='', 
            lastname='', 
            email=form.email.data, 
            message='', 
            is_optin=True)
        db.session.add(message)
        db.session.commit()
        flash('We have received your subscription! Thanks for your support!', 'success')
        return redirect(url_for('index', _anchor='footer'))
    return render_template('index.html', form=form)

# Submit region
@app.route('/timeline')
def timeline():
    return render_template('timeline.html')

@app.route('/submit')
def submit():
    return render_template('submit.html')

@app.route('/publication')
def publication():
    return render_template('publication.html')

# Program region
@app.route('/theme')
def theme():
    return render_template('theme.html')

# Event region
@app.route('/awards')
def awards():
    return render_template('awards.html')

# Sponsor region
@app.route('/sponsors')
def sponsors():
    return render_template('sponsors.html')

@app.route('/contribute')
def contribute():
    return render_template('contribute.html')

# About region
@app.route('/ibpsa')
def ibpsa():
    return render_template('ibpsa.html')

@app.route('/committee')
def committee():
    return render_template('committee.html')

@app.route('/newsletter/<int:news_id>')
def newsletter(news_id):
    news_date = datetime.strptime(str(news_id), '%Y%m')
    return render_template(
        str(news_id) + '.html', 
        month=datetime.strftime(news_date, '%B'), 
        year=datetime.strftime(news_date, '%Y'))

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    form = MessageForm()
    if form.validate_on_submit():
        message = Message(
            firstname=form.firstname.data, 
            lastname=form.lastname.data, 
            email=form.email.data, 
            message=form.message.data, 
            is_optin=form.is_optin.data)
        db.session.add(message)
        db.session.commit()
        flash('Thanks! We have received your message!', 'success')
        return redirect(url_for('contact', _anchor="messageBox"))
    return render_template('contact.html', form=form)



# @app.route('/download/<int:file_id>/delete', methods=['POST'])
# def delete_file(file_id):
#     file = File.query.get_or_404(file_id)
#     file_path = os.path.join(app.config['BOOKSHELF_PATH'], file.link)
#     if os.path.exists(file_path):
#         os.remove(file_path)
#     db.session.delete(file)
#     db.session.commit()
#     flash('File deleted.', 'danger')
#     return redirect(url_for('bookshelf'))


# @app.route('/download/<int:file_id>/download', methods=['GET', 'POST'])
# def download(file_id):
#     file = File.query.get_or_404(file_id)
#     uploads = os.path.join(current_app.root_path, app.config['BOOKSHELF_PATH'])
#     return send_from_directory(directory=uploads, filename=file.link, as_attachment=True, attachment_filename="%s" % file.name)


# @app.route('/download/<int:file_id>/block', methods=['GET', 'POST'])
# def block(file_id):
#     file = File.query.get_or_404(file_id)
#     file.islocked = not file.islocked
#     db.session.commit()
#     return redirect(url_for('bookshelf'))
