from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# --- BLUEPRINT DEFINITIONS ---
# Blueprint for all authentication-related routes
auth_bp = Blueprint('auth', __name__)

# Blueprint for all chatbot-related routes
chat_bp = Blueprint('chat', __name__)


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