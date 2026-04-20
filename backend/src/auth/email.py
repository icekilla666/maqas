import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl
import logging
from src.configs import settings

logger = logging.getLogger(__name__)

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
    
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_SERVER,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=True,
            tls_context=ssl_context,
            timeout=10
        )
        logger.info(f"Письмо отправлено на {email}")
        return True
    except Exception as e:
        logger.error(f"Ошибка отправки: {e}")
        return False