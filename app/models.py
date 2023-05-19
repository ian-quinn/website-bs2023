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

class Reviewer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    title = db.Column(db.Integer)
    firstname = db.Column(db.String(32))
    lastname = db.Column(db.String(32))
    organization = db.Column(db.String(256))
    email = db.Column(db.String(128))
    orcid = db.Column(db.String(32))
    bio = db.Column(db.Text)
    filename = db.Column(db.String(64))
    signed = db.Column(db.Boolean, default=True)

class Invitation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    email = db.Column(db.String(128))
    name = db.Column(db.String(64))
    gender = db.Column(db.Integer)
    date_birth = db.Column(db.DateTime)
    date_arrival = db.Column(db.DateTime)
    date_departure = db.Column(db.DateTime)
    passport_no = db.Column(db.String(12))
    passport_country = db.Column(db.String(24))
    delegate_type = db.Column(db.Integer)
    application_type = db.Column(db.Integer)
    requirement = db.Column(db.Text)
    filename = db.Column(db.String(64))

class Accommodation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    email = db.Column(db.String(128))
    title = db.Column(db.Integer)
    firstname = db.Column(db.String(32))
    lastname = db.Column(db.String(32))
    country = db.Column(db.String(24))
    date_checkin = db.Column(db.DateTime)
    date_checkout = db.Column(db.DateTime)
    room_type = db.Column(db.Integer)
    guest_firstname = db.Column(db.String(32))
    guest_lastname = db.Column(db.String(32))
    is_visa = db.Column(db.Boolean, default=False)
    is_paid = db.Column(db.Boolean, default=False)
    requirement = db.Column(db.Text)
    payment_info = db.Column(db.String(128))
    filename = db.Column(db.String(64))