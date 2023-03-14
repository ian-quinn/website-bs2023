import os, re, json
import time
from datetime import datetime

from flask import flash
from flask import render_template, send_from_directory, current_app
from flask import redirect, url_for, request, make_response, jsonify
from flask import get_flashed_messages, g
from werkzeug.urls import url_parse
from werkzeug.utils import secure_filename

from app import app, db
from app.models import Message, File, Reviewer
from app.forms import MessageForm, EnrollForm, ReviewerForm


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

@app.route('/registration')
def registration():
    return render_template('registration.html')

@app.route('/program')
def program():
    return render_template('program.html')

@app.route('/guide/author')
def guide_author():
    return render_template('guide_author.html')

@app.route('/guide/reviewer')
def guide_reviewer():
    return render_template('guide_reviewer.html')

@app.route('/guide/sessionchair')
def guide_sessionchair():
    return render_template('guide_sessionchair.html')

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

@app.route('/covid')
def covid():
    return render_template('covid.html')

@app.route('/competition')
def competition():
    return render_template('competition.html')


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
    news_date = datetime.strptime(str(news_id), '%Y%m%d')
    return render_template(
        str(news_id) + '.html', 
        day=datetime.strftime(news_date, '%d'),
        month=datetime.strftime(news_date, '%B'), 
        year=datetime.strftime(news_date, '%Y'))

# previous link fix
@app.route('/newsletter/202209')
def email_detour_1():
    return redirect(url_for('newsletter', news_id=20221004))

@app.route('/newsletter/202210')
def email_detour_2():
    return redirect(url_for('newsletter', news_id=20221026))

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

@app.route('/reviewer', methods=['GET', 'POST'])
def reviewer():
    form = ReviewerForm()
    if form.validate_on_submit():
        firstname = form.firstname.data
        lastname = form.lastname.data
        if form.file.data:
            f = form.file.data
            filename = firstname.lower() + "_" + lastname.lower() + '_' + datetime.now().strftime('%m%d%H%M') + '.pdf'
            if os.path.splitext(f.filename)[1] != '.pdf':
                flash('Only support PDF', 'danger')
                return redirect(url_for('reviewer'))
            f.save(os.path.join(app.config['UPLOAD_PATH'], filename))
        else:
            filename = 'null'
        reviewer = Reviewer(
            title=form.title.data, 
            firstname=firstname,
            lastname=lastname, 
            email=form.email.data, 
            organization=form.organization.data, 
            orcid=form.orcid.data, 
            bio=form.bio.data, 
            filename=filename, 
            signed=True)
        db.session.add(reviewer)
        db.session.commit()
        flash('You have registered to the reviewer database. Thanks!', 'warning')
        return redirect(url_for('reviewer', _anchor="registerBox"))
    return render_template('enroll.html', form=form)


@app.route('/download/<int:file_id>', methods=['GET', 'POST'])
def download(file_id):
    file = File.query.get_or_404(file_id)
    path = os.path.join(current_app.root_path, app.config['FILE_PATH'])
    return send_from_directory(path, file.link, as_attachment=True, attachment_filename="%s" % file.name)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500