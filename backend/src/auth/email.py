import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl
import certifi

from src.configs import settings

async def send_verification_email(email: str, verification_link: str):
    msg = MIMEMultipart()
    msg["From"] = settings.SMTP_USER
    msg["To"] = email
    msg["Subject"] = "Verify your email"
    body = f"""
Hello!

Please verify your email by clicking the link below:

{verification_link}

If you did not create an account, you can ignore this email.
    """
    msg.attach(MIMEText(body, "plain"))
    ssl_context = ssl.create_default_context(cafile=certifi.where())
    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_SERVER,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
            tls_context=ssl_context,
            timeout=10
        )
        return True
    except Exception:
        return False