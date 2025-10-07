import smtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os

email_regex = r"^\w+([\.-]\w+)*@\w+([\.-]\w+)*(\.\w{2,4})$"

def send_email(recipient_list, subject, body):
    msg = EmailMessage()
    msg['From'] = os.getenv("EMAIL_FROM")
    msg['To'] = ", ".join(recipient_list)
    msg['Subject'] = subject
    msg.set_content(body)

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(os.getenv("EMAIL_FROM"), os.getenv(
            "EMAIL_PASSWORD"))  # Replace with your password
        smtp.send_message(msg)


def send_html_email(recipient_list, subject, html_content):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    part1 = MIMEText(html_content, 'html')
    msg.attach(part1)
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(os.getenv("EMAIL_FROM"), os.getenv(
            "EMAIL_PASSWORD"))
        smtp.sendmail(os.getenv("EMAIL_FROM"), recipient_list, msg.as_string())