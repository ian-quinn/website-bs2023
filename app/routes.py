import os, sys
import time
import re, json
from datetime import datetime

from flask import flash
from flask import render_template, send_from_directory, current_app
from flask import redirect, url_for, request, make_response, jsonify
from flask import get_flashed_messages, g
from flask import Markup

from flask_login import current_user, login_user, logout_user, login_required

from werkzeug.urls import url_parse
from werkzeug.utils import secure_filename

from app import app, db
from app.models import Message, File, Reviewer, Invitation, Accommodation, Certificate, Poster, Recording, Delegate, Paper
from app.models import User, get_or_create
from app.forms import MessageForm, EnrollForm, InvitationForm, AccommodationForm, RetrieveAccommodationForm
from app.forms import ReviewerForm, CertificateForm, LoginForm
from app.email import send_auth_link

from app.wkhtmltopdf import printpdf


@app.route('/', methods=['GET', 'POST'])
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

# ------------------------------------------------------------- #
@app.route('/timeline')
def timeline():
    return render_template('timeline.html')

@app.route('/submit')
def submit():
    return render_template('submit.html')

@app.route('/registration')
def registration():
    return render_template('registration.html')

@app.route('/publication')
def publication():
    return render_template('publication.html')

@app.route('/guide/finalupload')
def guide_finalupload():
    return render_template('guide_finalupload.html')

@app.route('/guide/author')
def guide_author():
    return render_template('guide_author.html')

@app.route('/guide/reviewer')
def guide_reviewer():
    return render_template('guide_reviewer.html')

@app.route('/guide/sessionchair')
def guide_sessionchair():
    return render_template('guide_sessionchair.html')

@app.route('/guide/participant')
def guide_participant():
    return render_template('guide_participant.html')

@app.route('/guide/accommodation', methods=['GET', 'POST'])
def guide_accommodation():
    form = RetrieveAccommodationForm()
    if form.validate_on_submit():
        email = form.email.data.lower()
        reservations = Accommodation.query.filter_by(email = email).all()

        msg = f'We cannot find the record. Please go to <a href="https://bs2023.org/accommodation">Accommodation</a> for your reservation.'

        if len(reservations) > 0:
            roomtype = "King"
            booking_id = reservations[0].id
            if reservations[0].room_type == 2:
                roomtype = "Twin"

            delta = (reservations[0].date_checkout - reservations[0].date_checkin).total_seconds()
            days = round(delta / 86400, 0)

            guestname_1 = f'{reservations[0].firstname} {reservations[0].lastname}'
            guestname_2 = ''
            if reservations[0].guest_firstname or reservations[0].guest_lastname:
                guestname_2 = f'{reservations[0].guest_firstname} {reservations[0].guest_lastname}'
            title = ''
            if reservations[0].title == 1:
                title = "Mrs."
            elif reservations[0].title == 2:
                title = "Ms."
            elif reservations[0].title == 3:
                title = "Mr."
            else:
                title = ""

            msg = f'Here is your booking information: <br/>' + \
                f'<strong>1</strong> Deluxe Room | Type: <strong>{roomtype}</strong> bed | <strong>{days:.0f}</strong> nights<br/>' + \
                f'Check-in after: <strong>{datetime.strftime(reservations[0].date_checkin, "%Y-%m-%d")} 15:00</strong>. Check-out before <strong>{datetime.strftime(reservations[0].date_checkout, "%Y-%m-%d")} 12:00</strong><br/>' + \
                f'<div style="font-size: 11px; line-height:17px;">Radisson Blu Forest Manor Hotel, Shanghai Hongqiao<br/>' + \
                f'<i class="far fa-map"></i> 839 Jin Feng Road, Shanghai, 201100, China. <i class="far fa-envelope"></i> secretariate@bs2023.org</div><br/>'

            if not reservations[0].filename:
                booking_name = f'booking_{reservations[0].email}.pdf'
                resource_path = os.path.join(current_app.root_path, app.config['WKRESOURCE_PATH'])
                output_path = os.path.join(app.config['BOOKING_PATH'], booking_name)
                printpdf.print_reservation(
                    title, 
                    guestname_1,
                    guestname_2,
                    reservations[0].is_child,
                    reservations[0].company, 
                    reservations[0].no_fax, 
                    reservations[0].no_phone, 
                    reservations[0].room_type,
                    reservations[0].date_checkin.strftime("%d %b, %Y"), 
                    reservations[0].date_checkout.strftime("%d %b, %Y"), 
                    reservations[0].flight_arrival, 
                    reservations[0].flight_departure, 
                    reservations[0].payment_method, 
                    reservations[0].payment_info, 
                    reservations[0].no_confirmation, 
                    app.config['WKHTMLTOPDF_PATH'], 
                    resource_path, 
                    output_path)

                reservations[0].filename = booking_name
                db.session.commit()

            if reservations[0].is_paid:
                msg = msg + f'We have received your full payment. Thanks for your booking!'
                if reservations[0].payment_info:
                    msg = msg + f'<br/>Your payment info: <i>{reservations[0].payment_info}</i>'
                if reservations[0].filename:
                    msg = msg + f'<br/>Click here to download your <a href="{ url_for("download_reservation", booking_id=booking_id) }" target="_blank">Proof of Accommodation</a> (Hotel Itinerary Reservation).'
                # elif reservations[0].is_visa:
                #     msg = msg + '<br/>You may download the proof of accommodation here when it is ready. Please allow us 7 days to process your request.'
            else:
                msg = msg + f'Accommodation fee: <strong>USD {130 * days:.0f}</strong> (CNY {780 * days:.0f}).<br/>' + \
                f'Room held for 7 days before a successful payment. Please pay the fee in ConfTool by following steps.'

        wrapper_msg = Markup(msg)
        flash(wrapper_msg, 'warning')
        return redirect(url_for('guide_accommodation'))
    return render_template('guide_accommodation.html', form=form)


# --------------------------- PROGRAM -------------------------- #


@app.route('/theme')
def theme():
    return render_template('theme.html')

@app.route('/keynote')
def keynote():
    return render_template('keynote.html')

@app.route('/program')
def program():
    return render_template('program.html')

@app.route('/workshop')
def workshop():
    return render_template('workshops.html')

@app.route('/invited-speech')
def invited():
    return render_template('invited-speech.html')

@app.route('/techtour')
def techtour():
    return render_template('techtours.html')

@app.route('/rivercruise')
def rivercruise():
    return render_template('rivercruise.html')

@app.route('/competition')
def competition():
    return render_template('competition.html')


# ------------------------- EVENTS ----------------------------- #


@app.route('/awards')
def awards():
    return render_template('awards.html')

@app.route('/virtual')
def virtual():
    return render_template('virtual.html')


# -------------------------- GUIDE ----------------------------- #


@app.route('/venue')
def venue():
    return render_template('venue.html')

@app.route('/accommodation', methods=['GET', 'POST'])
def accommodation():
    form = AccommodationForm()
    if form.validate_on_submit():
        checkin = form.date_checkin.data
        checkout = form.date_checkout.data
        accommodation = Accommodation(
            email=form.email.data.lower(), 
            country=form.country.data,
            title=form.title.data, 
            firstname=form.firstname.data,
            lastname=form.lastname.data,
            date_checkin=checkin,
            date_checkout=checkout,
            room_type=form.room_type.data,
            guest_lastname = form.guest_lastname.data,
            guest_firstname = form.guest_firstname.data,
            is_visa = form.is_visa.data, 
            requirement=form.requirement.data, 
            company = form.company.data,
            no_fax = form.no_fax.data,
            no_phone = form.no_phone.data, 
            flight_arrival = form.flight_arrival.data, 
            flight_departure = form.flight_departure.data)

        db.session.add(accommodation)
        db.session.commit()

        roomtype = "King"
        if form.room_type.data == 2:
            roomtype = "Twin"

        delta = (checkout - checkin).total_seconds()
        days = round(delta / 86400, 0)
        successful_msg = f'Thanks for your reservation! Here is your booking information: <br/>' + \
            f'<strong>1</strong> Deluxe Room | Type: <strong>{roomtype}</strong> bed | <strong>{days:.0f}</strong> nights<br/>' + \
            f'Check-in after: {datetime.strftime(checkin, "%Y-%m-%d")} 15:00. Check-out before {datetime.strftime(checkout, "%Y-%m-%d")} 12:00<br/>' + \
            f'<div style="font-size: 11px; line-height:15px;">Radisson Blu Forest Manor Hotel, Shanghai Hongqiao<br/>' + \
            f'<i class="far fa-map"></i> 839 Jin Feng Road, Shanghai, 201100, China. <i class="far fa-envelope"></i> secretariate@bs2023.org</div><br/>' + \
            f'Amount due: <strong>USD {130 * days:.0f}</strong> (CNY {780 * days:.0f}).<br/>' + \
            f'Room held for 7 days before a successful payment. Please pay the fee as following steps.'

        wrapper_msg = Markup(successful_msg)
        flash(wrapper_msg, 'warning')
        return redirect(url_for('guide_accommodation'))
        
    num_king = Accommodation.query.filter_by(room_type = 1).count()
    num_twin = Accommodation.query.filter_by(room_type = 2).count()
    return render_template('accommodation.html', form=form, num_king = 136 - num_king, num_twin = 136 - num_twin)

@app.route('/visa', methods=['GET', 'POST'])
def visa():
    form = InvitationForm()
    if form.validate_on_submit():
        if form.file.data:
            f = form.file.data
            filename = email.lower() + '_' + datetime.now().strftime('%m%d%H%M') + '.pdf'
            if os.path.splitext(f.filename)[1] != '.pdf':
                flash('Only support PDF', 'danger')
                return redirect(url_for('visa'))
            f.save(os.path.join(app.config['UPLOAD_PATH'], filename))
        else:
            filename = 'null'
        invitation = Invitation(
            email=form.email.data.lower(), 
            name=form.name.data,
            gender=form.gender.data,
            date_birth=form.date_birth.data,
            date_arrival=form.date_arrival.data,
            date_departure=form.date_departure.data,
            passport_no=form.passport_no.data,
            passport_country=form.passport_country.data,
            delegate_type=form.delegate_type.data,
            application_type=form.application_type.data, 
            requirement=form.requirement.data, 
            filename=filename)
        db.session.add(invitation)
        db.session.commit()
        flash('We will contact you shortly via email', 'warning')
        return redirect(url_for('visa', _anchor="requestBox"))

    return render_template('visa.html', form=form)


# -------------------------- SPONSOR ----------------------------- #


# Sponsor region
@app.route('/sponsors')
def sponsors():
    return render_template('sponsors.html')

@app.route('/contribute')
def contribute():
    return render_template('contribute.html')


# -------------------------- ABOUT ----------------------------- #


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
    form_apply = ReviewerForm()
    form_cert = CertificateForm()

    if form_apply.validate_on_submit():
        firstname = form_apply.firstname.data
        lastname = form_apply.lastname.data
        if form_apply.file.data:
            f = form_apply.file.data
            filename = firstname.lower() + "_" + lastname.lower() + '_' + datetime.now().strftime('%m%d%H%M') + '.pdf'
            if os.path.splitext(f.filename)[1] != '.pdf':
                flash('Only support PDF', 'danger')
                return redirect(url_for('reviewer'))
            f.save(os.path.join(app.config['UPLOAD_PATH'], filename))
        else:
            filename = 'null'
        reviewer = Reviewer(
            title=form_apply.title.data, 
            firstname=firstname,
            lastname=lastname, 
            email=form_apply.email.data, 
            organization=form_apply.organization.data, 
            orcid=form_apply.orcid.data, 
            bio=form_apply.bio.data, 
            filename=filename, 
            signed=True)
        db.session.add(reviewer)
        db.session.commit()
        flash('You have registered to the reviewer database. Thanks!', 'success')
        return redirect(url_for('reviewer', _anchor="registerBox"))
            
    return render_template('enroll.html', form_apply=form_apply, form_cert=form_cert)


@app.route('/reviewer/certificate', methods=['GET', 'POST'])
def get_cert():
    form_apply = ReviewerForm()
    form_cert = CertificateForm()

    if form_cert.validate_on_submit():
        email = form_cert.email.data.lower()
        certificates = Certificate.query.filter_by(email = email).all()
        msg = f'We cannot find the record in the database. Please contact <a href="mailto:secretariat@bs2023.org">secretariat@bs2023.org</a> to claim your certificate if needed.'
        
        if len(certificates) > 0:
            if not certificates[0].filename:
                certificate_name = f'cert_{email}.pdf'
                resource_path = os.path.join(current_app.root_path, app.config['WKRESOURCE_PATH'])
                output_path = os.path.join(app.config['CERT_PATH'], certificate_name)
                printpdf.print_certification(certificates[0].firstname + " " + certificates[0].lastname, 
                    certificates[0].title, certificates[0].num_abs, certificates[0].num_paper, 
                    app.config['WKHTMLTOPDF_PATH'], resource_path, output_path)
                # print(output_path, file=sys.stdout)
                certificates[0].filename = certificate_name
                db.session.commit()
            if not certificates[0].filename_letter:
                bonifide_name = f'letter_{email}.pdf'
                resource_path = os.path.join(current_app.root_path, app.config['WKRESOURCE_PATH'])
                output_path = os.path.join(app.config['CERT_PATH'], bonifide_name)
                printpdf.print_bonafide(certificates[0].firstname + " " + certificates[0].lastname, 
                    certificates[0].title, certificates[0].company, certificates[0].address, 
                    certificates[0].city, certificates[0].country, certificates[0].num_abs, certificates[0].num_paper, 
                    app.config['WKHTMLTOPDF_PATH'], resource_path, output_path)
                # print(output_path, file=sys.stdout)
                certificates[0].filename_letter = bonifide_name
                db.session.commit()
            msg = f'PDF printed. Click here to download your \
                <a href="{ url_for("download_certificate", cert_id=certificates[0].id, type_id=1) }" target="_blank">certificate</a> \
                / <a href="{ url_for("download_certificate", cert_id=certificates[0].id, type_id=0) }" target="_blank">bonifide letter</a>.'
            flash(Markup(msg), 'warning')
            return redirect(url_for('reviewer'))
        else:
            msg = "No record found."
        flash(msg, 'warning')

    return render_template('enroll.html', form_apply=form_apply, form_cert=form_cert)


@app.route('/certificate', methods=['GET', 'POST'])
def certificate():
    form_cert = CertificateForm()

    if form_cert.validate_on_submit():
        email = form_cert.email.data.lower()
        delegates = Delegate.query.filter_by(email = email).all()
        
        msg = f'We cannot find the record in the database. Please contact <a href="mailto:secretariat@bs2023.org">secretariat@bs2023.org</a> to claim your certificate if needed.'
        
        if len(delegates) > 0:
            if not delegates[0].certpath_attendance:
                cert_attendance_name = f'cert_{email}.pdf'
                resource_path = os.path.join(current_app.root_path, app.config['WKRESOURCE_PATH'])
                output_path = os.path.join(app.config['CERT_PATH'], cert_attendance_name)
                # check if there is any paper
                papers = []
                if delegates[0].papers != "":
                    paper_ids = delegates[0].papers.split(",")
                    print(paper_ids, file=sys.stdout)
                    for paper_id in paper_ids:
                        papers.append(Paper.query.filter_by(conftool = int(paper_id)).first())

                printpdf.print_attendance(delegates[0].firstname + " " + delegates[0].lastname, delegates[0].title, delegates[0].conftool, 
                    papers, delegates[0].mode_attendance, 
                    app.config['WKHTMLTOPDF_PATH'], resource_path, output_path)
                # print(output_path, file=sys.stdout)
                delegates[0].certpath_attendance = cert_attendance_name
                db.session.commit()
            msg = f'PDF printed. Click here to download your \
                <a href="{ url_for("download_certificate", cert_id=delegates[0].id, type_id=3) }" target="_blank">certificate</a>'
            flash(Markup(msg), 'warning')
            return redirect(url_for('certificate'))
        else:
            msg = "No record found."
        flash(msg, 'warning')

    return render_template('certificate.html', form_cert=form_cert)


@app.route('/download/<int:file_id>', methods=['GET', 'POST'])
def download(file_id):
    file = File.query.get_or_404(file_id)
    path = os.path.join(current_app.root_path, app.config['FILE_PATH'])
    return send_from_directory(path, file.link, as_attachment=True, attachment_filename="%s" % file.name)

@app.route('/download/accommodation/<int:booking_id>', methods=['GET', 'POST'])
def download_reservation(booking_id):
    accommodation = Accommodation.query.get_or_404(booking_id)
    path = os.path.join(current_app.root_path, app.config['BOOKING_PATH'])
    return send_from_directory(path, accommodation.filename, as_attachment=True, attachment_filename="%s" % accommodation.filename)

@app.route('/download/recording/<int:recording_id>', methods=['GET', 'POST'])
def download_recording(recording_id):
    recording = Recording.query.get_or_404(recording_id)
    path = os.path.join(current_app.root_path, app.config['RECORDING_PATH'])
    print(path, file=sys.stdout)
    return send_from_directory(path, recording.path_mp4, as_attachment=True, attachment_filename="%s" % recording.path_mp4)

# certificate type_id == 1: reviewer certificate
# certificate type_id == 2: reviewer bonafide letter
# certificate type_id == 3: attendance certificate
# certificate type_id == 4: 
# certificate type_id == 5: 

@app.route('/download/certificate/<int:cert_id>#<int:type_id>', methods=['GET', 'POST'])
def download_certificate(cert_id, type_id):
    if type_id == 1:
        certificate = Certificate.query.get_or_404(cert_id)
        path = os.path.join(current_app.root_path, app.config['CERT_PATH'])
        return send_from_directory(path, certificate.filename, 
            as_attachment=True, attachment_filename="%s" % certificate.filename)
    elif type_id == 2:
        certificate = Certificate.query.get_or_404(cert_id)
        path = os.path.join(current_app.root_path, app.config['CERT_PATH'])
        return send_from_directory(path, certificate.filename_letter, 
            as_attachment=True, attachment_filename="%s" % certificate.filename_letter)
    elif type_id == 3:
        delegate = Delegate.query.get_or_404(cert_id)
        path = os.path.join(current_app.root_path, app.config['CERT_PATH'])
        return send_from_directory(path, delegate.certpath_attendance, 
            as_attachment=True, attachment_filename="%s" % delegate.certpath_attendance)


# -------------------------- ERROR ----------------------------- #

@app.route('/unsubscribed', methods=['GET'])
def unsubscribed():
    return render_template('000.html')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500


# --------------- POSTER GALLERY & USER MANAGEMENT ---------------#
@app.route('/gallery', methods=['GET', 'POST'])
def gallery():
    form = LoginForm()
    if current_user.is_authenticated:
        return render_template('gallery.html', form=form, name=current_user.name)
    if form.validate_on_submit():
        # creates a user if email is not in db, and returns user if it is
        user = get_or_create(db.session, User, email=form.email.data)
        expiration = 150   # expiration in seconds
        user.generate_auth_link(expiration=expiration)
        send_auth_link(user, expiration=expiration)  # send an email
        flash('Your login link has been sent to {}'.format(form.email.data))
        return render_template('gallery.html', form=form)
    return render_template('gallery.html', form=form)

@app.route('/poster')
def poster():
    posters = Poster.query.order_by(Poster.id.asc()).all()
    if current_user.is_authenticated:
        return render_template('posters.html', name=current_user.name, posters=posters)
    return render_template('posters.html', posters=posters)

@app.route('/poster#<int:cate_id>')
def poster_cate(cate_id):
    posters = Poster.query.order_by(Poster.id.asc()).all()
    if current_user.is_authenticated:
        return render_template('posters.html', name=current_user.name, posters=posters, cate_id=cate_id)
    return render_template('posters.html', posters=posters, cate_id=cate_id)

@app.route('/poster/<token>')
def qr_poster(token):
    poster = Poster.verify_auth_link(token)
    if poster and poster.auth_link == token:
        path_img = url_for('static', filename='poster/' + poster.path_img) if poster.path_img else ''
        path_mp4 = url_for('static', filename='poster/' + poster.path_mp4) if poster.path_mp4 else ''
        path_webm = url_for('static', filename='poster/' + poster.path_webm) if poster.path_webm else ''
        path_cover = url_for('static', filename='poster/' + poster.path_cover) if poster.path_cover else ''
        return render_template(
            'poster.html', title=poster.title, author=poster.author, abstract=poster.abstract,
            path_img=path_img, path_mp4=path_mp4, path_webm=path_webm, path_cover=path_cover, 
            is_freepass=True 
            )
        

@app.route('/poster/<int:poster_id>')
def view_poster(poster_id):
    poster = Poster.query.get_or_404(poster_id)

    posters = Poster.query.order_by(Poster.id.asc()).all()
    ids = []
    for i in range(len(posters)):
        ids.append(posters[i].id)
    id_loc = ids.index(poster_id)
    next_loc = id_loc + 1 if id_loc < len(ids) - 1 else id_loc - len(ids) + 1
    prev_loc = id_loc - 1

    path_img = url_for('static', filename='poster/' + poster.path_img) if poster.path_img else ''
    path_mp4 = url_for('static', filename='poster/' + poster.path_mp4) if poster.path_mp4 else ''
    path_webm = url_for('static', filename='poster/' + poster.path_webm) if poster.path_webm else ''
    path_cover = url_for('static', filename='poster/' + poster.path_cover) if poster.path_cover else ''
    return render_template(
        'poster.html', title=poster.title, author=poster.author, abstract=poster.abstract,
        path_img=path_img, path_mp4=path_mp4, path_webm=path_webm, path_cover=path_cover, paper_id=poster.id, 
        is_freepass=False, next_id=ids[next_loc], prev_id=ids[prev_loc], id_loc=id_loc, id_total=len(ids)
        )

@login_required
@app.route('/regenposterqrauthcode')
def regenposterqrauthcode():
    posters = Poster.query.all()
    for poster in posters:
        poster.generate_auth_link()
    return redirect(url_for('poster'))

# @login_required
# @app.route('/stats')
# def stats():
#     if current_user.is_anonymous:
#         return redirect(url_for('poster'))
#     user = User.query.get(current_user.id)
#     return render_template('stats.html', user=user)


# --------------- POSTER GALLERY & USER MANAGEMENT ---------------#

@app.route('/replay')
def replay():
    recordings = Recording.query.order_by(Recording.timestamp.asc()).all()
    if current_user.is_authenticated:
        return render_template('recordings.html', name=current_user.name, recordings=recordings)
    return render_template('recordings.html', recordings=recordings)

@app.route('/replay#<int:cate_id>')
def replay_cate(cate_id):
    recordings = Recording.query.order_by(Recording.timestamp.asc()).all()
    for item in recordings[::-1]:
        if item.cate != cate_id:
            recordings.remove(item)

    if current_user.is_authenticated:
        return render_template('recordings.html', name=current_user.name, recordings=recordings, cate_id=cate_id)
    return render_template('recordings.html', recordings=recordings, cate_id=cate_id)



@app.route('/auth/<token>', methods=['GET'])
def auth(token):
    user = User.verify_auth_link(token)
    # check not only a correct token but if it's the latest too
    if user and user.auth_link == token:
        login_user(user)
        user.counter += 1
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('gallery'))
    elif current_user.is_authenticated:
        return redirect(url_for('gallery'))
    else:
        flash('Wrong or expired token. Please request another link by your registered email.')
        return redirect(url_for('gallery'))


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('gallery'))
