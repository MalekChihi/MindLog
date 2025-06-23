import json
from flask import current_app

def analyze_mood_entry(mood_text: str) -> dict:
    """
    Analyzes a user's mood entry using the Gemini AI model and returns a structured JSON response.
    Requires app.journal_model to be set in the Flask app context.
    """
    prompt = f"""
    You are a caring and thoughtful mental well-being assistant.
    A user has written about their current emotional state.

    --- USER MOOD ENTRY ---
    "{mood_text}"

    --- YOUR TASK ---
    Please analyze the user's mood and provide a helpful, supportive response in JSON format with:

    1. "emotional_summary": (string) A gentle reflection or summary of what the user might be feeling.
    2. "possible_cause": (string) A possible cause or interpretation of their emotional state (if possible).
    3. "supportive_tip": (string) One simple and supportive piece of advice to help them feel a little better.
    4. "reflection_question": (string) A compassionate, reflective question they can consider.

    ONLY return a valid JSON response.

    Example:
    {{
      "emotional_summary": "It sounds like you're feeling a bit overwhelmed and emotionally drained.",
      "possible_cause": "You may be carrying a lot of responsibilities or expectations.",
      "supportive_tip": "Try stepping away for a few minutes today to do something just for yourself—like a short walk or mindful breathing.",
      "reflection_question": "What would being kind to yourself look like right now?"
    }}
    """

    try:
        model = current_app.journal_model
        response = model.generate_content(prompt)

        if hasattr(response, 'text'):
            json_text = response.text.strip().replace('```json', '').replace('```', '')
            return json.loads(json_text)
        else:
            return {
                "error": "No text found in model response.",
                "raw_response": str(response)
            }

    except json.JSONDecodeError as e:
        return {
            "error": "Failed to parse AI response as JSON.",
            "details": str(e),
            "raw_response": response.text if 'response' in locals() else None
        }
    except Exception as e:
        return {
            "error": "Unexpected error occurred.",
            "details": str(e)
        }
