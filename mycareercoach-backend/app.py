from flask import Flask
from config import Config
from extensions import init_extensions

# Import Blueprints
from auth import auth_bp
from blueprints.student import student_bp
from blueprints.counselor import counselor_bp
from blueprints.admin import admin_bp
from blueprints.public_content import public_content_bp
from blueprints.assessments import assessments_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions (PyMongo, JWTManager)
    init_extensions(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(student_bp, url_prefix='/api/student')
    app.register_blueprint(counselor_bp, url_prefix='/api/counselor')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(public_content_bp, url_prefix='/api/public')
    app.register_blueprint(assessments_bp, url_prefix='/api/assessments')

    @app.route('/')
    def index():
        return "MyCareerCoach Backend is running!"

    return app

if __name__ == '__main__':
    app = create_app()
    # app.run(debug=True)
    app.run(debug=True, port=8045, host='0.0.0.0')