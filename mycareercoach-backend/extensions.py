from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS

mongo = PyMongo()
jwt = JWTManager()
cors = CORS()

def init_extensions(app):
    mongo.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })