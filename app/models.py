from app import app
from app import db
from hashlib import md5
from datetime import datetime


############# bookshelf supporting  ########################
class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(64))
    size = db.Column(db.String(64))
    bookend = db.Column(db.String(8))
    category = db.Column(db.Integer)
    link = db.Column(db.String(64))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    islocked = db.Column(db.Boolean, default=False)

############# album supporting  ########################
class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    link = db.Column(db.String(64))
    size = db.Column(db.String(16))
