from app import app
from app import db
from hashlib import md5
from datetime import datetime


############# bookshelf supporting  ########################
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    firstname = db.Column(db.String(32))
    lastname = db.Column(db.String(32))
    email = db.Column(db.String(64))
    message = db.Column(db.String(8))
    is_optin = db.Column(db.Boolean, default=False)
    
class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    link = db.Column(db.String(32))