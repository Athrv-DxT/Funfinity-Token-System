import smtplib
from email.mime.text import MIMEText
from email.utils import formataddr
from typing import Optional

from flask import current_app


def send_credentials_email(to_email: str, username: str, password: str) -> None:
	subject = "Your Account Credentials"
	body = (
		"Please find your credentials\n\n"
		f"username: {username}\n"
		f"password: {password}\n"
	)
	msg = MIMEText(body)
	msg["Subject"] = subject
	msg["From"] = formataddr(("Token Wallet", current_app.config["FROM_EMAIL"]))
	msg["To"] = to_email

	smtp_host = current_app.config["SMTP_HOST"]
	smtp_port = current_app.config["SMTP_PORT"]
	smtp_user = current_app.config.get("SMTP_USER")
 
	smtp_pass = current_app.config.get("SMTP_PASS")

	# Use SSL for port 465, TLS for other ports
	if smtp_port == 465:
		with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
			if smtp_user and smtp_pass:
				server.login(smtp_user, smtp_pass)
			server.sendmail(current_app.config["FROM_EMAIL"], [to_email], msg.as_string())
	else:
		with smtplib.SMTP(smtp_host, smtp_port) as server:
			server.starttls()
			if smtp_user and smtp_pass:
				server.login(smtp_user, smtp_pass)
			server.sendmail(current_app.config["FROM_EMAIL"], [to_email], msg.as_string())


