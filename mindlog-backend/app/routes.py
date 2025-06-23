from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import User, ChatHistory
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import story_generator, journal_analyzer
import datetime
import base64
from . import gamification_analyzer # <-- IMPORT THE NEW MODULE
import base64
from app.journal_analyzer import analyze_mood_entry  # 
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required
from PIL import Image
import io

# --- BLUEPRINT DEFINITIONS ---
auth_bp = Blueprint('auth', __name__)
chat_bp = Blueprint('chat', __name__)
story_bp = Blueprint('story', __name__)
journal_bp = Blueprint('journal', __name__)
gamification_bp = Blueprint('gamification', __name__)

# Initialize gamification generator
# gamification = GamificationGenerator()

# --- AUTHENTICATION ROUTES (under auth_bp) ---

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    user = User(
        email=data['email'],
        name=data.get('name', ''),
        terms_accepted=data.get('terms_accepted', False)
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token, 'user_id': user.id}), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'profilePicUrl': user.profile_image
    }), 200


# --- CHATBOT ROUTE (under chat_bp) ---

@chat_bp.route("/chat", methods=['POST'])
def chat_with_gemini():
    # Check if the chat service was initialized correctly in __init__.py
    if not current_app.chat_session:
        return jsonify({"error": "Chat service is not configured or available."}), 503

    message = request.json.get('message')
    if not message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Access the persistent chat session from the application context
        chat_session = current_app.chat_session
        response = chat_session.send_message(message)
        return jsonify({"response": response.text})
    except Exception as e:
        current_app.logger.error(f"Gemini API call failed: {e}")
        return jsonify({"error": "Failed to get response from AI model"}), 500

@story_bp.route("/generate-story", methods=['POST'])
def generate_story_route():
    data = request.get_json()
    if not data or 'theme' not in data or 'user_words' not in data:
        return jsonify({"error": "Missing 'theme' or 'user_words' in request"}), 400

    theme = data.get('theme')
    user_words = data.get('user_words')
    current_app.logger.info(f"Received story request with theme: {theme} and words: {user_words}")

    try:
        # Call the main function from our new module
        result = story_generator.create_story_assets(theme, user_words)
        
        # Return the dictionary it provides
        return jsonify(result), 200

    except Exception as e:
        current_app.logger.error(f"Story generation failed: {e}")
        return jsonify({"error": "An internal error occurred while generating the story."}), 500

@journal_bp.route('/analyze', methods=['POST'])
def analyze_journal():
    data = request.get_json()
    mood_text = data.get('entry')

    if not mood_text:
        return jsonify({"error": "No mood entry provided."}), 400

    result = analyze_mood_entry(mood_text)

    if "error" in result:
        return jsonify(result), 500

    return jsonify(result), 200

@gamification_bp.route("/detect-mood", methods=['POST'])
@jwt_required()
def detect_mood_route():
    try:
        data = request.get_json(force=True)  # <- force=True forcera le parsing même sans header correct
    except Exception as e:
        current_app.logger.error(f"JSON parsing failed: {e}")
        return jsonify({"error": "Invalid JSON payload."}), 400

    base64_image_data = data.get('image_data') if data else None
    if not base64_image_data:
        return jsonify({"error": "No image_data provided"}), 400

    try:
        image_bytes = base64.b64decode(base64_image_data)
        detected_mood = gamification_analyzer.get_mood_from_image(image_bytes)
        activity_suggestion = gamification_analyzer.suggest_activity_for_mood(detected_mood)

        return jsonify({
            "mood": detected_mood,
            "activity_suggestion": activity_suggestion
        }), 200

    except Exception as e:
        current_app.logger.error(f"Mood detection route failed: {e}")
        return jsonify({"error": "An internal error occurred during mood detection."}), 500
