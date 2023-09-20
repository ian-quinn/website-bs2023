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
    is_child = db.Column(db.Boolean, default=False)
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
    filename_letter = db.Column(db.String(64))
    company = db.Column(db.String(64))
    address = db.Column(db.String(64))
    city = db.Column(db.String(64))
    country = db.Column(db.String(64))


# ----------------------- USER LOGIN ---------------- #


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True)
    name = db.Column(db.String(32))
    counter = db.Column(db.Integer, index=True, default=int)
    auth_link = db.Column(db.String(256))

    def generate_auth_link(self, expiration):
        # for generating token we use JSON Web Token library
        self.auth_link = jwt.encode(
            {
            'exp': datetime.utcnow() + timedelta(seconds=expiration), 
            'user_id': self.id
            }, 
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
    subject = db.Column(db.String(256)) # abandoned
    name = db.Column(db.String(32)) # abandoned
    email = db.Column(db.String(64))
    title = db.Column(db.String(256))
    author = db.Column(db.String(32))
    abstract = db.Column(db.Text)
    cateogry = db.Column(db.Integer)
    keywords = db.Column(db.String(128))
    imgpath = db.Column(db.String(128)) # abandoned
    wavpath = db.Column(db.String(128)) # abandoned
    movpath = db.Column(db.String(128)) # abandoned
    path_img = db.Column(db.String(128))
    path_wav = db.Column(db.String(128))
    path_mp4 = db.Column(db.String(128))
    path_webm = db.Column(db.String(128))
    path_cover = db.Column(db.String(128))
    is_private = db.Column(db.Boolean, default=False)
    auth_link = db.Column(db.String(256))

    def generate_auth_link(self):
        self.auth_link = jwt.encode(
            {
                'poster_id': self.id
            }, 
            app.config['SECRET_KEY'], algorithm='HS256')
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def verify_auth_link(auth_link):
        try:
            decoded_data = jwt.decode(auth_link, app.config['SECRET_KEY'], algorithms=['HS256'])
            poster = Poster.query.get(decoded_data['poster_id'])
            return poster
        except jwt.exceptions.ExpiredSignatureError:
            return None
        except jwt.exceptions.InvalidTokenError:
            return None


# ----------------------- RECORDINGS GALLERY --------------------- #

class Recording(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    title = db.Column(db.String(256))
    chair = db.Column(db.String(32))
    cochair = db.Column(db.String(32))
    presenter = db.Column(db.String(128))
    cateogry = db.Column(db.Integer) # abandoned
    cate = db.Column(db.Integer)
    path_mp4 = db.Column(db.String(128))
    path_pdf = db.Column(db.String(128))
    path_cover = db.Column(db.String(128))
    is_private = db.Column(db.Boolean, default=False)



# ----------------------- RECORDINGS GALLERY --------------------- #

class Delegate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conftool = db.Column(db.Integer)
    email = db.Column(db.String(128))
    title = db.Column(db.String(16))
    firstname = db.Column(db.String(32))
    lastname = db.Column(db.String(32))
    company = db.Column(db.String(64))
    address = db.Column(db.String(64))
    city = db.Column(db.String(64))
    country = db.Column(db.String(64))

    mode_presentation = db.Column(db.Integer)
    mode_attendance = db.Column(db.Integer)
    papers = db.Column(db.String(32)) # a string to be split for integer index of paper

    chair_codes = db.Column(db.String(256))
    chair_names = db.Column(db.String(256))

    certpath_attendance = db.Column(db.String(64))
    certpath_attendance_letter = db.Column(db.String(64))
    certpath_papers = db.Column(db.String(256))
    certpath_sessionchair = db.Column(db.String(64))
    
class Paper(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128))
    conftool = db.Column(db.Integer)
    session_code = db.Column(db.String(16))
    session_name = db.Column(db.String(32))
    mode_presentation = db.Column(db.Integer) # research paper = 1 / project report = 0
    title = db.Column(db.String(256))
    authors = db.Column(db.String(256))
    is_paid = db.Column(db.Boolean, default=True)
    path_cert = db.Column(db.String(64))
    path_letter = db.Column(db.String(64))
    text_auhtors = db.Column(db.Text)
    text_organization = db.Column(db.Text)


class Survey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    cookie = db.Column(db.String(256))
    identity = db.Column(db.Integer) # what is your identity of participation? A. Presenter/author B. Reviewer C. Invited speaker D. Exhibitor
    qA = db.Column(db.Integer) # attendance mode A. Physical B. Virtual
    qB = db.Column(db.Integer) # what type of institution do you work for 
    qC = db.Column(db.Integer) # what is the nature of your work

    q01 = db.Column(db.Integer) # How useful did you find the conference overall
    q02 = db.Column(db.Integer) # PRESENTER/AUTHOR ONLY How did you find the review process
    q03 = db.Column(db.Integer) # REVIEWER ONLY how did you find the review process
    q04 = db.Column(db.Integer) # Usefulness of website
    q05 = db.Column(db.Integer) # How do you rate the conference fees, was good value for money?
    p06 = db.Column(db.Integer) # How useful did you find the keynote speeches
    p07 = db.Column(db.Integer) # Rate the technical papers overall quality?
    p08 = db.Column(db.Integer) # How did you find the length of the conference / number of days
    q09 = db.Column(db.Integer) # How did you hear about the building simulation conference
    q10 = db.Column(db.Integer) # will you attend the next building simulation conference in Brisbane, Australia?
    q11 = db.Column(db.Integer) # did you attend the last building simulation conference, BS2021
    q12 = db.Column(db.Text) # additional comments

    #--------------------------------------------------------------------------------
    
    p01 = db.Column(db.Integer) # How did you find the meeting facilities and location
    p02 = db.Column(db.Integer) # how did you find the pick up / shuttle bus service?
    p03 = db.Column(db.Integer) # Was there sufficient time to network and socialize
    p04 = db.Column(db.Integer) # how did you find the exhibition in general
    p05 = db.Column(db.Integer) # what did you think of the scientific quality of the poster session
    p06 = db.Column(db.Integer) # how would you rate the social program (reception cocktail, banquet, river cruise)?
    p07 = db.Column(db.Integer) # the venue and catering were suitable for the conference?
    p08 = db.Column(db.Integer) # how did you find the conference guide system (guide book, signs, map)

    #--------------------------------------------------------------------------------
    v01 = db.Column(db.Integer) # how was the quality of the audio
    v02 = db.Column(db.Integer) # how was the quality of the video
    v03 = db.Column(db.Integer) # what did you think of the online sessions
    v04 = db.Column(db.Text) # textbox for why
    v05 = db.Column(db.Integer) # did you get a chance to ask questions
    v06 = db.Column(db.Text) # textbox for why
    v07 = db.Column(db.Integer) # PRESENTER/AUTHOR ONLY: were the guidelines/templates for producing the video clear and adequate
    v08 = db.Column(db.Integer) # Rate the live-streaming and video replay
    v09 = db.Column(db.Integer) # Moving to a hybrid conference with a more immersive experience is expensive...
