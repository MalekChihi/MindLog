from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import logging
from datetime import timedelta

# --- NEW: Import libraries for Gemini and .env loading ---
import google.generativeai as genai
from dotenv import load_dotenv

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()  # Create JWTManager instance

def create_app(config_object='app.config.DevelopmentConfig'):
    """Application factory with improved JWT handling and Gemini AI integration"""
    
    # --- NEW: Load environment variables from .env file at the very start ---
    # This will find the .env file in your mindlog-backend/ directory
    load_dotenv()
    
    app = Flask(__name__, instance_relative_config=True)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
    )
    app.logger.info("Starting Flask application...")

    # Load configuration
    # ... (your existing config loading code remains the same)
    try:
        app.config.from_object(config_object)
        if 'JWT_SECRET_KEY' not in app.config:
            app.config['JWT_SECRET_KEY'] = os.urandom(32).hex()
        if 'JWT_ALGORITHM' not in app.config:
            app.config['JWT_ALGORITHM'] = 'HS256'
        if 'JWT_EXPIRATION' not in app.config:
            app.config['JWT_EXPIRATION'] = timedelta(hours=24)
        app.logger.info("JWT configuration verified")
    except Exception as e:
        app.logger.error(f"Configuration error: {str(e)}")
        raise

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # --- NEW: Initialize Gemini AI Model ---
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            app.logger.error("GEMINI_API_KEY not found in .env file. Chat functionality will be disabled.")
            app.chat_session = None # Set to None if key is missing
        else:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            # Attach the chat session to the app object so it's accessible in routes
            app.chat_session = model.start_chat(history=[])
            app.logger.info("Successfully initialized Gemini AI Model and started chat session.")
    except Exception as e:
        app.logger.error(f"Failed to initialize Gemini AI Model: {e}")
        app.chat_session = None

    # Configure CORS - Your chat route will be /api/chat, so this will cover it.
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', '*'),
            "supports_credentials": True
        }
    })

    # Register blueprints
    # --- NEW: We will create a new blueprint for chat routes ---
    from .routes import auth_bp, chat_bp # Import both blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(chat_bp, url_prefix='/api') # Register the chat blueprint
    
    app.logger.info("Registered all blueprints")

    # Simple health check
    @app.route('/')
    def health_check():
        return jsonify({"status": "healthy"}), 200

    app.logger.info("Application initialization complete")
    return app