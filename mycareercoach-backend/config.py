import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

class Config:
    # MongoDB Configuration
    # MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/mycareercoach_db")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://AndersonKamsong:Ander123@cluster0.9rlip3r.mongodb.net/mycareercoach_db")

    # JWT Configuration
    # A strong secret key is crucial for security. Generate a random one.
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-default-key-please-change-in-prod")
    JWT_ACCESS_TOKEN_EXPIRES = 3600 # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 2592000 # 30 days
    
    # File Uploads Configuration
    # Define where uploaded files will be stored.
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static/uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB limit for file uploads

    # Ensure the upload folder exists
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

class DevelopmentConfig(Config):
    DEBUG = True
    # Development-specific settings if any

class ProductionConfig(Config):
    DEBUG = False
    # Production-specific settings if any (e.g., more secure logging)

# You can choose which config to use, e.g., based on FLASK_ENV env var
# For now, we'll default to DevelopmentConfig in app.py