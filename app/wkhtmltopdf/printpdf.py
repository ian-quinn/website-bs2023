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
        'amount': review_abstract, 
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




def print_reservation(name, guest_name, company, fax, code, room_type, 
    date_arrival, date_departure, 
    wkhtmltopdf_path, resource_path, output_path):

    today_date = datetime.today().strftime("%d %b, %Y")

    context = {
        'res_logo': 'file:///' + os.path.join(resource_path, "radisson-logo.png").replace("\\","/"),
        'res_font': 'file:///' + os.path.join(resource_path, "NotoSans-Regular.ttf").replace("\\","/"),
        # 'res_font_cn': 'file:///' + os.path.join(resource_path, "Yahei.ttf").replace("\\","/"),
        'name': name, 
        'company': company, 
        'fax': fax, 
        'date': today_date,
        'guest': guest_name,
        'confirmation_code': code,
        'room_type': room_type,
        'date_arrival': date_arrival,
        'date_departure': date_departure
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