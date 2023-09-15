import os, sys
from sys import platform
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    	'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    IMG_PATH = os.path.join(basedir, 'app/static/img')
    FILE_PATH = os.path.join(basedir, 'app/downloads')
    UPLOAD_PATH = os.path.join(basedir, 'app/uploads')
    WKRESOURCE_PATH = os.path.join(basedir, 'app/wkhtmltopdf')
    if platform == 'linux' or platform == 'linux2':
        WKHTMLTOPDF_PATH = '/usr/local/bin/wkhtmltopdf'
    else:
        WKHTMLTOPDF_PATH = r'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe'
    CERT_PATH = os.path.join(basedir, 'app/static/cert')
    BOOKING_PATH = os.path.join(basedir, 'app/static/booking')
    POSTER_PATH = os.path.join(basedir, 'app/static/poster')
    RECORDING_PATH = os.path.join(basedir, 'app/downloads/recordings')
    
    LOCALES = ['en', 'zh']
    BABEL_DEFAULT_LOCALE = LOCALES[1]

    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT'))
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL')
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    ADMINS = os.environ.get('ADMINS')