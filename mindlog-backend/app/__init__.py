# from flask import Flask, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager
# import os
# import logging
# from datetime import timedelta

# from dotenv import load_dotenv
# import google.generativeai as genai
# from google.generativeai import GenerativeModel

# # Load environment variables
# load_dotenv()

# # Load all API keys
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
# GAME_API_KEY = os.getenv("GAME_API_KEY")  # New key for gamification

# # Validate essential keys
# if not GEMINI_API_KEY:
#     raise EnvironmentError("GEMINI_API_KEY is missing from .env")
# if not GOOGLE_API_KEY:
#     raise EnvironmentError("GOOGLE_API_KEY is missing from .env")
# if not GAME_API_KEY:
#     raise EnvironmentError("GAME_API_KEY is missing from .env")

# # Configure Gemini globally for chatbot with primary key
# genai.configure(api_key=GEMINI_API_KEY)

# # Initialize core extensions
# db = SQLAlchemy()
# migrate = Migrate()
# jwt = JWTManager()

# def create_app(config_object='app.config.DevelopmentConfig'):
#     app = Flask(__name__, instance_relative_config=True)

#     # Setup logging
#     logging.basicConfig(
#         level=logging.INFO,
#         format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
#     )
#     app.logger.info("Starting Flask application...")

#     # Load configuration
#     try:
#         app.config.from_object(config_object)
#         app.config.setdefault('JWT_SECRET_KEY', os.urandom(32).hex())
#         app.config.setdefault('JWT_ALGORITHM', 'HS256')
#         app.config.setdefault('JWT_EXPIRATION', timedelta(hours=24))
#         app.logger.info("JWT configuration verified")
#     except Exception as e:
#         app.logger.error(f"Configuration error: {str(e)}")
#         raise

#     # Initialize extensions
#     db.init_app(app)
#     migrate.init_app(app, db)
#     jwt.init_app(app)

#     # Gemini chatbot model using GEMINI_API_KEY
#     try:
#         chat_model = GenerativeModel('gemini-1.5-flash')
#         app.chat_session = chat_model.start_chat(history=[])
#         app.logger.info("Gemini chatbot model initialized and chat session started.")
#     except Exception as e:
#         app.logger.error(f"Failed to initialize Gemini chatbot model: {e}")
#         app.chat_session = None

#     # Gemini journal analysis model using GOOGLE_API_KEY
#     try:
#         genai.configure(api_key=GOOGLE_API_KEY)
#         journal_model = GenerativeModel('gemini-1.5-flash')
#         app.journal_model = journal_model
#         app.logger.info("Journal analysis model initialized.")
#     except Exception as e:
#         app.logger.error(f"Failed to initialize journal analysis model: {e}")
#         app.journal_model = None

#     # Gemini gamification model using GAME_API_KEY
#     try:
#         genai.configure(api_key=GAME_API_KEY)
#         gamification_model = GenerativeModel('gemini-1.5-flash')
#         app.gamification_model = gamification_model
#         app.logger.info("Gamification mood detection model initialized.")
#     except Exception as e:
#         app.logger.error(f"Failed to initialize gamification model: {e}")
#         app.gamification_model = None

#     # Reconfigure back to GEMINI_API_KEY as default
#     genai.configure(api_key=GEMINI_API_KEY)

#     # Enable CORS
#     CORS(app, resources={
#         r"/api/*": {
#             "origins": app.config.get('CORS_ORIGINS', '*'),
#             "supports_credentials": True
#         }
#     })

#     # Register blueprints
#     from .routes import auth_bp, chat_bp, story_bp, journal_bp, gamification_bp  # Added gamification_bp
#     app.register_blueprint(auth_bp, url_prefix='/api')
#     app.register_blueprint(chat_bp, url_prefix='/api')
#     app.register_blueprint(story_bp, url_prefix='/api')
#     app.register_blueprint(journal_bp, url_prefix='/api/journal')
#     app.register_blueprint(gamification_bp, url_prefix='/api/gamification')  # New blueprint

#     # Health check route
#     @app.route('/')
#     def health_check():
#         return jsonify({
#             "status": "healthy",
#             "services": {
#                 "chat": bool(app.chat_session),
#                 "journal": bool(app.journal_model),
#                 "gamification": bool(app.gamification_model)
#             }
#         }), 200

#     return app

# # from flask import Flask, jsonify
# # from flask_sqlalchemy import SQLAlchemy
# # from flask_migrate import Migrate
# # from flask_cors import CORS
# # from flask_jwt_extended import JWTManager
# # import os
# # import logging
# # from datetime import timedelta
# # from dotenv import load_dotenv

# # # --- ONLY IMPORT THE MODEL CLASS, NOT THE WHOLE LIBRARY ---
# # from google.generativeai import GenerativeModel

# # # Load environment variables
# # load_dotenv()

# # # Initialize core extensions
# # db = SQLAlchemy()
# # migrate = Migrate()
# # jwt = JWTManager()

# # def create_app(config_object='app.config.DevelopmentConfig'):
# #     app = Flask(__name__, instance_relative_config=True)

# #     # --- Setup logging and app config (Unchanged) ---
# #     logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')
# #     app.logger.info("Starting Flask application...")
# #     app.config.from_object(config_object)

# #     # --- Initialize Extensions (Unchanged) ---
# #     db.init_app(app)
# #     migrate.init_app(app, db)
# #     jwt.init_app(app)
# #     CORS(app, resources={r"/api/*": {"origins": "*"}})

# #     # --- LOAD ALL API KEYS FROM .env ---
# #     # This is the only place we need to interact with os.getenv for these keys
# #     chat_api_key = os.getenv("GEMINI_API_KEY")
# #     journal_api_key = os.getenv("GOOGLE_API_KEY")
# #     gamification_api_key = os.getenv("GAME_API_KEY")

# #     # --- INITIALIZE EACH MODEL INDEPENDENTLY ---

# #     # 1. Gemini Chatbot Model
# #     if chat_api_key:
# #         try:
# #             # Pass the key directly using client_options
# #             chat_model = GenerativeModel('gemini-1.5-flash', client_options={"api_key": chat_api_key})
# #             app.chat_session = chat_model.start_chat(history=[])
# #             # We can still attach the model itself for other modules to use if needed
# #             app.chat_session.model = chat_model
# #             app.logger.info("Gemini chatbot model initialized.")
# #         except Exception as e:
# #             app.logger.error(f"Failed to initialize Gemini chatbot model: {e}")
# #             app.chat_session = None
# #     else:
# #         app.logger.error("GEMINI_API_KEY not found. Chatbot disabled.")
# #         app.chat_session = None

# #     # 2. Journal Analysis Model
# #     if journal_api_key:
# #         try:
# #             app.journal_model = GenerativeModel('gemini-1.5-flash', client_options={"api_key": journal_api_key})
# #             app.logger.info("Journal analysis model initialized.")
# #         except Exception as e:
# #             app.logger.error(f"Failed to initialize journal analysis model: {e}")
# #             app.journal_model = None
# #     else:
# #         app.logger.error("GOOGLE_API_KEY not found. Journal analysis disabled.")
# #         app.journal_model = None

# #     # 3. Gamification Model
# #     if gamification_api_key:
# #         try:
# #             app.gamification_model = GenerativeModel('gemini-1.5-flash', client_options={"api_key": gamification_api_key})
# #             app.logger.info("Gamification model initialized.")
# #         except Exception as e:
# #             app.logger.error(f"Failed to initialize gamification model: {e}")
# #             app.gamification_model = None
# #     else:
# #         app.logger.error("GAME_API_KEY not found. Gamification disabled.")
# #         app.gamification_model = None

# #     # --- Register Blueprints (Let's clean up the prefixes) ---
# #     from .routes import auth_bp, chat_bp, story_bp, journal_bp, gamification_bp
# #     app.register_blueprint(auth_bp, url_prefix='/api')
# #     app.register_blueprint(chat_bp, url_prefix='/api')
# #     app.register_blueprint(story_bp, url_prefix='/api')
# #     app.register_blueprint(journal_bp, url_prefix='/api/journal')
# #     app.register_blueprint(gamification_bp, url_prefix='/api/gamification')
# #     app.logger.info("All blueprints registered.")

# #     # ... Health check and return app (Unchanged) ...
# #     @app.route('/')
# #     def health_check():
# #         return jsonify({"status": "healthy"}), 200

# #     return app


##########################################################################
# from flask import Flask, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager
# import os
# import logging
# from datetime import timedelta
# from dotenv import load_dotenv
# import google.generativeai as genai
# from google.generativeai import GenerativeModel
# # Load environment variables
# load_dotenv()
# # Load both keys
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
# if not GEMINI_API_KEY:
#     raise EnvironmentError("GEMINI_API_KEY is missing from .env")
# if not GOOGLE_API_KEY:
#     raise EnvironmentError("GOOGLE_API_KEY is missing from .env")
# # Configure Gemini globally for chatbot
# genai.configure(api_key=GEMINI_API_KEY)
# # Initialize core extensions
# db = SQLAlchemy()
# migrate = Migrate()
# jwt = JWTManager()
# def create_app(config_object='app.config.DevelopmentConfig'):
#     app = Flask(__name__, instance_relative_config=True)
#     # Setup logging
#     logging.basicConfig(
#         level=logging.INFO,
#         format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
#     )
#     app.logger.info("Starting Flask application...")
#     # Load configuration
#     try:
#         app.config.from_object(config_object)
#         app.config.setdefault('JWT_SECRET_KEY', os.urandom(32).hex())
#         app.config.setdefault('JWT_ALGORITHM', 'HS256')
#         app.config.setdefault('JWT_EXPIRATION', timedelta(hours=24))
#         app.logger.info("JWT configuration verified")
#     except Exception as e:
#         app.logger.error(f"Configuration error: {str(e)}")
#         raise
#     # Initialize extensions
#     db.init_app(app)
#     migrate.init_app(app, db)
#     jwt.init_app(app)
#     # Gemini chatbot model using GEMINI_API_KEY
#     try:
#         chat_model = GenerativeModel('gemini-1.5-flash')
#         app.chat_session = chat_model.start_chat(history=[])
#         app.logger.info("Gemini chatbot model initialized and chat session started.")
#     except Exception as e:
#         app.logger.error(f"Failed to initialize Gemini chatbot model: {e}")
#         app.chat_session = None
#     # Gemini journal analysis model using GOOGLE_API_KEY
#     try:
#         # Configure for journal analysis using second key
#         genai.configure(api_key=GOOGLE_API_KEY)
#         journal_model = GenerativeModel('gemini-1.5-flash')
#         app.journal_model = journal_model
#         app.logger.info("Journal analysis model initialized.")
#     except Exception as e:
#         app.logger.error(f"Failed to initialize journal analysis model: {e}")
#         app.journal_model = None
#     # Reconfigure back to GEMINI_API_KEY to avoid overriding default model later
#     genai.configure(api_key=GEMINI_API_KEY)
#     # Enable CORS
#     CORS(app, resources={
#     r"/api/*": {
#         "origins": ["http://localhost:8081", "http://192.168.80.35:8081"],
#         "methods": ["GET", "POST", "PUT", "OPTIONS"],
#         "allow_headers": ["Content-Type", "Authorization"],
#         "supports_credentials": True
#     }
# })

#     # Register blueprints
#     from .routes import auth_bp, chat_bp, story_bp, journal_bp
#     app.register_blueprint(auth_bp, url_prefix='/api')
#     app.register_blueprint(chat_bp, url_prefix='/api')
#     app.register_blueprint(story_bp, url_prefix='/api')
#     app.register_blueprint(journal_bp, url_prefix='/api/journal')
#     # Health check route
#     @app.route('/')
#     def health_check():
#         return jsonify({"status": "healthy"}), 200
#     return app

# mindlog-backend/app/__init__.py

from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import logging
from datetime import timedelta
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai import GenerativeModel

# Load environment variables
load_dotenv()

# Load API keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GAME_API_KEY = os.getenv("GAME_API_KEY")  # ✅ New key for gamification

if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY is missing from .env")
if not GOOGLE_API_KEY:
    raise EnvironmentError("GOOGLE_API_KEY is missing from .env")
if not GAME_API_KEY:
    raise EnvironmentError("GAME_API_KEY is missing from .env")

# Configure Gemini globally (will be reconfigured as needed later)
genai.configure(api_key=GEMINI_API_KEY)

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_object='app.config.DevelopmentConfig'):
    app = Flask(__name__, instance_relative_config=True)

    # Logging setup
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s : %(message)s'
    )
    app.logger.info("Starting Flask application...")

    # Load config
    try:
        app.config.from_object(config_object)
        app.config.setdefault('JWT_SECRET_KEY', os.urandom(32).hex())
        app.config.setdefault('JWT_ALGORITHM', 'HS256')
        app.config.setdefault('JWT_EXPIRATION', timedelta(hours=24))
        app.logger.info("JWT configuration loaded.")
    except Exception as e:
        app.logger.error(f"Configuration error: {e}")
        raise

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Chatbot model (GEMINI_API_KEY)
    try:
        chat_model = GenerativeModel('gemini-1.5-flash')
        app.chat_session = chat_model.start_chat(history=[])
        app.logger.info("Chatbot model initialized.")
    except Exception as e:
        app.logger.error(f"Failed to init chatbot model: {e}")
        app.chat_session = None

    # Journal analysis model (GOOGLE_API_KEY)
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        journal_model = GenerativeModel('gemini-1.5-flash')
        app.journal_model = journal_model
        app.logger.info("Journal model initialized.")
    except Exception as e:
        app.logger.error(f"Failed to init journal model: {e}")
        app.journal_model = None

    # Gamification model (GAME_API_KEY)
    try:
        genai.configure(api_key=GAME_API_KEY)
        gamification_model = GenerativeModel('gemini-1.5-flash')
        app.gamification_model = gamification_model
        app.logger.info("Gamification model initialized.")
    except Exception as e:
        app.logger.error(f"Failed to init gamification model: {e}")
        app.gamification_model = None

    # Reconfigure to GEMINI_API_KEY (for default use elsewhere)
    genai.configure(api_key=GEMINI_API_KEY)

    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:8081", "http://192.168.80.35:8081"],
            "methods": ["GET", "POST", "PUT", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Register all blueprints
    from .routes import auth_bp, chat_bp, story_bp, journal_bp, gamification_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(chat_bp, url_prefix='/api')
    app.register_blueprint(story_bp, url_prefix='/api')
    app.register_blueprint(journal_bp, url_prefix='/api/journal')
    app.register_blueprint(gamification_bp, url_prefix='/api/gamification')  # ✅

    # Health check
    @app.route('/')
    def health_check():
        return jsonify({"status": "healthy"}), 200

    return app
