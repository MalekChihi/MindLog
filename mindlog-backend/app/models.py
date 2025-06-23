# from werkzeug.security import generate_password_hash, check_password_hash
# from app import db

# class User(db.Model):
#     __tablename__ = 'users'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(255), nullable=False)
#     email = db.Column(db.String(120), nullable=False, unique=True)
#     phone_number = db.Column(db.String(20))
#     profile_image = db.Column(db.String(500))
#     password = db.Column(db.String(255), nullable=False)  # Matches your DB column
#     terms_accepted = db.Column(db.Boolean, nullable=False, default=False)
#     created_at = db.Column(db.DateTime, server_default=db.func.now())

#     def set_password(self, password):
#         self.password = generate_password_hash(password)

#     def check_password(self, password):
#         return check_password_hash(self.password, password)

# mindlog-backend/app/models.py

from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from datetime import datetime # Make sure datetime is imported

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone_number = db.Column(db.String(20))
    profile_image = db.Column(db.String(500))
    password = db.Column(db.String(255), nullable=False)
    terms_accepted = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # --- ADD THESE RELATIONSHIPS (The only addition to your existing User model) ---
    chat_history = db.relationship('ChatHistory', backref='user', lazy=True)
    story_history = db.relationship('StoryHistory', backref='user', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        # Your check_password method already correctly references `self.password`
        return check_password_hash(self.password, password)
    def __repr__(self):
        return f'<User {self.email}>'
# --- ADD THE NEW MODELS BELOW ---

class ChatHistory(db.Model):
    __tablename__ = 'chat_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    conversation_id = db.Column(db.String(100), nullable=True)  # Optional grouping of messages
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    is_deleted = db.Column(db.Boolean, default=False)

    __table_args__ = (
        db.Index('ix_user_id_timestamp', 'user_id', 'timestamp'),
    )

    def __repr__(self):
        return f'<ChatHistory {self.id} - User {self.user_id}>'
    
    
class StoryHistory(db.Model):
    __tablename__ = 'story_history' # Good practice to name the table

    id = db.Column(db.Integer, primary_key=True)
    # --- THIS IS THE CORRECTION ---
    # It now correctly points to the 'users.id' column
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    theme = db.Column(db.String(100), nullable=False)
    user_input = db.Column(db.Text, nullable=False)
    generated_story = db.Column(db.Text, nullable=False)
    audio_url = db.Column(db.String(255), nullable=True)
    video_url = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<StoryHistory {self.id}>'
    
  