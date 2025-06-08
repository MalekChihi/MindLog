from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.models import User
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    user = User(
        email=data['email'],
        name=data.get('name', ''),  # Optional field
        terms_accepted=data.get('terms_accepted', False)
    )
    user.set_password(data['password'])  # This hashes and stores the password
    
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
    
    return jsonify({
        'access_token': access_token,
        'user_id': user.id
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()  # This decorator ensures only logged-in users can access this
def get_profile():
    # Get the user ID from the JWT token (the one we set in the 'signin' route)
    current_user_id = get_jwt_identity()
    
    # Fetch the user from the database
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    # Return the user's public information
    return jsonify({
        'id': user.id,
        'name': user.name,  # This comes from your User model
        'email': user.email,
        'profilePicUrl': user.profile_image # Assumes you have a 'profile_image' field
    }), 200
