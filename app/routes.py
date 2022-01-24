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
#from app.models import User, Paper, Post, Comment, News, File, Project, History, Category, Photo
#from app.forms import LoginForm, RegistrationForm, EditProfileForm


@app.route('/')
@app.route('/index')
def index():
    papers = Paper.query.filter_by(category = 1).order_by(Paper.date.desc()).limit(5).all()
    newss = News.query.order_by(News.date.desc()).limit(5).all()
    return render_template('index.html', title='Home', papers=papers, newss=newss)
# @login_required

def get_locale():
    if current_user.is_authenticated and current_user.locale is not None:
        return current_user.locale

    locale = request.cookies.get('locale')
    if locale is not None:
        return locale
    return request.accept_languages.best_match(current_app.config['LOCALES'])


@app.route('/set_locale/<locale>')
def set_locale(locale):
    if locale not in current_app.config['LOCALES']:
        return jsonify(message='Invalid locale.'), 404
    response = make_response(redirect(request.referrer))
    if current_user.is_authenticated:
        current_user.locale = locale
        db.session.commit()
    else:
        response.set_cookie('locale', locale, max_age= 60*60*24*30)
    return response


@app.route('/download')
def bookshelf():
    #list = os.listdir(app.config['BOOKSHELF_PATH'])
    files = File.query.all()
    document = File.query.filter_by(category=1).order_by(File.name.desc()).all()
    package = File.query.filter_by(category=2).order_by(File.name.desc()).all()
    video = File.query.filter_by(category=3).order_by(File.name.desc()).all()
    miscs = File.query.filter_by(category=0).order_by(File.name.desc()).all()
    return render_template('bookshelf.html', files=files, document=document, package=package, video=video, miscs=miscs)


@app.route('/download/<int:file_id>/delete', methods=['POST'])
def delete_file(file_id):
    file = File.query.get_or_404(file_id)
    file_path = os.path.join(app.config['BOOKSHELF_PATH'], file.link)
    if os.path.exists(file_path):
        os.remove(file_path)
    db.session.delete(file)
    db.session.commit()
    flash('File deleted.', 'danger')
    return redirect(url_for('bookshelf'))


@app.route('/download/<int:file_id>/download', methods=['GET', 'POST'])
def download(file_id):
    file = File.query.get_or_404(file_id)
    uploads = os.path.join(current_app.root_path, app.config['BOOKSHELF_PATH'])
    return send_from_directory(directory=uploads, filename=file.link, as_attachment=True, attachment_filename="%s" % file.name)


@app.route('/download/<int:file_id>/block', methods=['GET', 'POST'])
def block(file_id):
    file = File.query.get_or_404(file_id)
    file.islocked = not file.islocked
    db.session.commit()
    return redirect(url_for('bookshelf'))
