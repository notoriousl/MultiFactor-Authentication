import pyotp
import time
import logging

logger = logging.getLogger(__name__)

class TOTPService:
    def __init__(self, secret):
        self.secret = secret

    def generate(self):
        try:
            totp = pyotp.TOTP(self.secret, interval=30)
            code = totp.now()
            time_left = int(30 - (time.time() % 30))
            return code, time_left
        except Exception as e:
            logger.error(f"TOTP generation error: {str(e)}")
            raise

    def verify(self, code):
        try:
            totp = pyotp.TOTP(self.secret)
            return totp.verify(code)
        except Exception as e:
            logger.error(f"TOTP verification error: {str(e)}")
            raise