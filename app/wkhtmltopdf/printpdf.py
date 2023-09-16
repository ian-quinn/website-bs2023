import jinja2
import pdfkit
from datetime import datetime
import sys, os

def print_certification(reviewer_name, reviewer_title, review_abstract, review_paper, 
    wkhtmltopdf_path, resource_path, output_path):

    today_date = datetime.today().strftime("%d %b, %Y")
    month = datetime.today().strftime("%B")

    context = {
        'res_background': 'file:///' + os.path.join(resource_path, "cert_background.png").replace("\\","/"),
        'res_signature': 'file:///' + os.path.join(resource_path, "cert_signature.png").replace("\\","/"),
        'res_font': 'file:///' + os.path.join(resource_path, "NotoSans-Regular.ttf").replace("\\","/"),
        'reviewer_name': reviewer_name, 
        'reviewer_title': reviewer_title, 
        'num_abs': review_abstract, 
        'num_paper': review_paper, 
        'date': today_date,
    }
    options = {
        'page-size': 'B5',
        'orientation': 'Landscape',
        'margin-top': '0.5mm',
        'margin-right': '0mm',
        'margin-bottom': '0mm',
        'margin-left': '0mm',
        "enable-local-file-access": ""
    }

    template_loader = jinja2.FileSystemLoader(resource_path)
    template_env = jinja2.Environment(loader=template_loader)

    template = template_env.get_template('certificate.html')
    output_text = template.render(context)

    print(output_text, file=sys.stdout)

    config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path)

    pdfkit.from_string(output_text, output_path,  options=options, configuration=config)

def print_attendance(delegate_name, delegate_title, delegate_id, 
    papers, mode_attendance, 
    wkhtmltopdf_path, resource_path, output_path):

    today_date = datetime.today().strftime("%d %b, %Y")
    month = datetime.today().strftime("%B")

    context = {
        'res_background': 'file:///' + os.path.join(resource_path, "cert_background2.png").replace("\\","/"),
        'res_signature_1': 'file:///' + os.path.join(resource_path, "cert_signature.png").replace("\\","/"),
        'res_signature_2': 'file:///' + os.path.join(resource_path, "cert_signature_da.png").replace("\\","/"),
        'res_font_1': 'file:///' + os.path.join(resource_path, "NotoSans-Regular.ttf").replace("\\","/"),
        'res_font_2': 'file:///' + os.path.join(resource_path, "NotoSans-Bold.ttf").replace("\\","/"),
        'res_font_3': 'file:///' + os.path.join(resource_path, "NotoSans-Light.ttf").replace("\\","/"),
        'res_logo': 'file:///' + os.path.join(resource_path, "bs2023-logo.png").replace("\\","/"),
        'delegate_name': delegate_name, 
        'delegate_title': delegate_title, 
        'mode_attendance': mode_attendance,
        'papers': papers,
        'user_id': delegate_id, 
        'date': today_date
    }
    options = {
        'page-size': 'B5',
        'orientation': 'Landscape',
        'margin-top': '0.5mm',
        'margin-right': '0mm',
        'margin-bottom': '0mm',
        'margin-left': '0mm',
        "enable-local-file-access": ""
    }

    template_loader = jinja2.FileSystemLoader(resource_path)
    template_env = jinja2.Environment(loader=template_loader)

    template = template_env.get_template('cert_delegate.html')
    output_text = template.render(context)

    print(output_text, file=sys.stdout)

    config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path)

    pdfkit.from_string(output_text, output_path,  options=options, configuration=config)

def print_attendance_letter(delegate_name, delegate_title, 
    reviewer_company, reviewer_address, reviewer_city, reviewer_country, 
    papers, mode_attendance, 
    wkhtmltopdf_path, resource_path, output_path):
    today_date = datetime.today().strftime("%d %b, %Y")

    context = {
        'res_signature_1': 'file:///' + os.path.join(resource_path, "cert_signature.png").replace("\\","/"),
        'res_signature_2': 'file:///' + os.path.join(resource_path, "cert_signature_da.png").replace("\\","/"),
        'res_logo': 'file:///' + os.path.join(resource_path, "bs2023-logo.png").replace("\\","/"),
        'res_font': 'file:///' + os.path.join(resource_path, "NotoSans-Regular.ttf").replace("\\","/"),
        'title': delegate_title,
        'name': delegate_name, 
        'company': reviewer_company,
        'address': reviewer_address, 
        'city': reviewer_city, 
        'country': reviewer_country,
        'mode_attendance': mode_attendance,
        'papers': papers,
        'date': today_date,
    }
    options = {
        'page-size': 'A4',
        'orientation': 'Portrait',
        'margin-top': '20mm',
        'margin-right': '20mm',
        'margin-bottom': '20mm',
        'margin-left': '20mm',
        'encoding': 'UTF-8',
        "enable-local-file-access": ""
    }

    template_loader = jinja2.FileSystemLoader(resource_path)
    template_env = jinja2.Environment(loader=template_loader)

    template = template_env.get_template('attendance_letter.html')
    output_text = template.render(context)

    config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path)
    pdfkit.from_string(output_text, output_path,  options=options, configuration=config)

def print_bonafide(reviewer_name, reviewer_title, 
    reviewer_company, reviewer_address, reviewer_city, reviewer_country, 
    review_abstract, review_paper, 
    wkhtmltopdf_path, resource_path, output_path):
    today_date = datetime.today().strftime("%d %b, %Y")

    context = {
        'res_signature_1': 'file:///' + os.path.join(resource_path, "cert_signature.png").replace("\\","/"),
        'res_signature_2': 'file:///' + os.path.join(resource_path, "cert_signature_da.png").replace("\\","/"),
        'res_logo': 'file:///' + os.path.join(resource_path, "bs2023-logo.png").replace("\\","/"),
        'res_font': 'file:///' + os.path.join(resource_path, "NotoSans-Regular.ttf").replace("\\","/"),
        'title': reviewer_title,
        'name': reviewer_name, 
        'company': reviewer_company,
        'address': reviewer_address, 
        'city': reviewer_city, 
        'country': reviewer_country,
        'date': today_date,
        'num_abs': review_abstract, 
        'num_paper': review_paper
    }
    options = {
        'page-size': 'A4',
        'orientation': 'Portrait',
        'margin-top': '50mm',
        'margin-right': '20mm',
        'margin-bottom': '20mm',
        'margin-left': '20mm',
        'encoding': 'UTF-8',
        "enable-local-file-access": ""
    }

    template_loader = jinja2.FileSystemLoader(resource_path)
    template_env = jinja2.Environment(loader=template_loader)

    template = template_env.get_template('bonafide.html')
    output_text = template.render(context)

    config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path)
    pdfkit.from_string(output_text, output_path,  options=options, configuration=config)


def print_reservation(title, name, guest_name, with_child, 
    company, fax, phone, room_type, 
    date_arrival, date_departure, 
    flight_arrival, flight_departure, 
    payment_method, payment_info, confirmation_code, 
    wkhtmltopdf_path, resource_path, output_path):

    today_date = datetime.today().strftime("%d %b, %Y")

    context = {
        'res_logo': 'file:///' + os.path.join(resource_path, "radisson-logo.png").replace("\\","/"),
        'res_font': 'file:///' + os.path.join(resource_path, "NotoSans-Regular.ttf").replace("\\","/"),
        # 'res_font_cn': 'file:///' + os.path.join(resource_path, "Yahei.ttf").replace("\\","/"),
        'title': title,
        'name': name, 
        'company': company, 
        'fax': fax, 
        'phone': phone, 
        'date': today_date,
        'guest': guest_name,
        'child': with_child,
        'room_type': room_type,
        'date_arrival': date_arrival,
        'date_departure': date_departure, 
        'flight_arrival': flight_arrival,
        'flight_departure': flight_departure, 

        'payment_info': payment_info,
        'payment_method': payment_method,
        'confirmation_code': confirmation_code
    }
    options = {
        'page-size': 'A4',
        'orientation': 'Portrait',
        'margin-top': '4mm',
        'margin-right': '4mm',
        'margin-bottom': '4mm',
        'margin-left': '4mm',
        'encoding': 'UTF-8',
        "enable-local-file-access": ""
    }

    template_loader = jinja2.FileSystemLoader(resource_path)
    template_env = jinja2.Environment(loader=template_loader)

    template = template_env.get_template('reservation.html')
    output_text = template.render(context)

    print(output_path, file=sys.stdout)

    config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path)
    pdfkit.from_string(output_text, output_path, options=options, configuration=config)