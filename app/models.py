from app import app
from app import db, login
from hashlib import md5
from datetime import datetime, timedelta
from flask_login import UserMixin
import jwt


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
    
    company = db.Column(db.String(64))
    no_fax = db.Column(db.String(32))
    no_phone = db.Column(db.String(32))
    flight_arrival = db.Column(db.String(32))
    flight_departure = db.Column(db.String(32))

    payment_method = db.Column(db.Integer, default=0)
    payment_info = db.Column(db.String(128))
    no_confirmation = db.Column(db.String(32))

    filename = db.Column(db.String(64))

class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conftool = db.Column(db.Integer)
    email = db.Column(db.String(128))
    title = db.Column(db.String(16))
    firstname = db.Column(db.String(32))
    lastname = db.Column(db.String(32))
    num_abs = db.Column(db.Integer)
    num_paper = db.Column(db.Integer)
    filename = db.Column(db.String(64))


# ----------------------- USER LOGIN ---------------- #


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True)
    name = db.Column(db.String(32))
    counter = db.Column(db.Integer, index=True, default=int)
    auth_link = db.Column(db.String(256))

    def generate_auth_link(self, expiration):
        # for generating token we use JSON Web Token library
        self.auth_link = jwt.encode({'exp': datetime.utcnow() + 
            timedelta(seconds=expiration), 'user_id': self.id}, 
            app.config['SECRET_KEY'], algorithm='HS256')
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def verify_auth_link(auth_link):
        try:
            decoded_data = jwt.decode(auth_link, app.config['SECRET_KEY'], algorithms=['HS256'])
            user = User.query.get(decoded_data['user_id'])
            return user
        except jwt.exceptions.ExpiredSignatureError:
            return None
        except jwt.exceptions.InvalidTokenError:
            return None


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


def get_or_create(session, model, **kwargs):
    instance = model.query.filter_by(**kwargs).first()
    if instance:
        return instance
    else:
        instance = model(**kwargs)
        session.add(instance)
        session.commit()
        return instance


# ----------------------- POSTER GALLERY --------------------- #

class Poster(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64))
    subject = db.Column(db.String(256))
    name = db.Column(db.String(32))
    abstract = db.Column(db.Text)
    email = db.Column(db.String(64))
    cateogry = db.Column(db.Integer)
    keywords = db.Column(db.String(128))
    imgpath = db.Column(db.String(128))
    wavpath = db.Column(db.String(128))
    movpath = db.Column(db.String(128))
    # add privacy boolean