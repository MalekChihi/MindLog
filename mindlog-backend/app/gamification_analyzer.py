# mindlog-backend/app/gamification_analyzer.py

from flask import current_app
from PIL import Image
import io

def get_mood_from_image(image_bytes: bytes) -> str:
    """
    Analyzes an image and returns a one-word mood.
    Uses the globally initialized Gemini model.
    """
    model = current_app.gamification_model
    if not model:
        raise ConnectionError("Gemini AI model is not available.")

    prompt = """
    You are an expert mood detection AI. Analyze the human face in the image and respond ONLY with one word that best describes the person's mood, like:
    happy, sad, angry, calm, tired, stressed, or anxious.
    Respond with a single lowercase word only and nothing else.
    """
    
    # The Gemini API expects a PIL Image object for image inputs
    pil_image = Image.open(io.BytesIO(image_bytes))
    
    try:
        response = model.generate_content([prompt, pil_image])
        return response.text.strip().lower()
    except Exception as e:
        current_app.logger.error(f"Gamification mood detection error: {e}")
        # Return a neutral/default mood on error
        return "neutral"

def suggest_activity_for_mood(mood: str) -> str:
    """
    Suggests a calming or uplifting activity based on the detected mood.
    Uses the globally initialized Gemini model.
    """
    model = current_app.gamification_model
    if not model:
        raise ConnectionError("Gemini AI model is not available.")

    sleep_related_moods = {"tired", "stressed", "sad", "anxious", "angry", "worried", "burnedout"}
    
    if mood in sleep_related_moods:
        prompt = f"""
        You are a sleep coach AI. Suggest a calming activity for someone who feels {mood} and might have sleep difficulties.
        Only give relaxing, sleep-supporting exercises such as deep breathing, gentle yoga, or mindfulness.
        Keep it short, clear, and comforting. Max 2 sentences. No greetings.
        """
    else:
        prompt = f"""
        You are a wellness assistant. Suggest a fun, simple, and uplifting activity for someone feeling {mood}.
        Examples: doodling, nature walk, listening to music, light stretching.
        Keep it short, suitable for all ages, and encouraging. No extra explanation or greetings.
        """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        current_app.logger.error(f"Gamification activity suggestion error: {e}")
        return "Take a moment for a few deep, slow breaths."