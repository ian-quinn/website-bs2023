from flask import Flask
from flask import request, current_app
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect
from flask_mail import Mail
from flask_datepicker import datepicker
from flask_login import LoginManager
from flask_mail import Mail

import os, sys


# application factory functions:
app = Flask(__name__)
app.config.from_object(Config)

# app.config.update(dict(
#     DEBUG = True,
#     MAIL_SERVER = '',
#     MAIL_PORT = 465,
#     MAIL_USE_TLS = False,
#     MAIL_USE_SSL = True,
#     MAIL_USERNAME = '',
#     MAIL_PASSWORD = '',
# ))


db = SQLAlchemy(app)
migrate = Migrate(app, db, compare_type=True)
mail = Mail(app)
csrf = CSRFProtect(app)
datepicker = datepicker(app)
login = LoginManager(app)
mail = Mail(app)

# 	locale = request.cookies.get('locale')
# 	if locale is not None:
# 		return locale
# 	return request.accept_languages.best_match(current_app.config['LOCALES'])

# app.jinja_env.globals.update(get_locale=get_locale)


from app import routes, models


# if not app.debug:
#     if app.config['MAIL_SERVER']:
#         auth = None
#         if app.config['MAIL_USERNAME'] or app.config['MAIL_PASSWORD']:
#             auth = (app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
#         secure = None
#         if app.config['MAIL_USE_TLS']:
#             secure = ()
#         mail_handler = SMTPHandler(
#             mailhost=(app.config['MAIL_SERVER'], app.config['MAIL_PORT']),
#             fromaddr='no-reply@' + app.config['MAIL_SERVER'],
#             toaddrs=app.config['ADMINS'], subject='Microblog Failure',
#             credentials=auth, secure=secure)
#         mail_handler.setLevel(logging.ERROR)
#         app.logger.addHandler(mail_handler)
#         print('error with Post.search', file=sys.stderr)

#     if not os.path.exists('logs'):
#         os.mkdir('logs')
#     file_handler = RotatingFileHandler('logs/microblog.log', maxBytes=10240,
#                                        backupCount=10)
#     file_handler.setFormatter(logging.Formatter(
#         '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
#     file_handler.setLevel(logging.INFO)
#     app.logger.addHandler(file_handler)

#     app.logger.setLevel(logging.INFO)
#     app.logger.info('Logger standing by')