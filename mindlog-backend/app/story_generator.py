# mindlog-backend/app/story_generator.py

import os
import requests
from gtts import gTTS
from moviepy import ImageSequenceClip, AudioFileClip
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import random
from flask import current_app # To use the logger

# --- Configuration ---

# IMPORTANT: We will get the API key from our environment variables for security.
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY") 
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

# Therapy scenarios - The core prompts for the AI
THERAPY_SCENARIOS = {
    "Insomnia": """Create a 100-word sleep story beginning with: "{user_words}". Include:
    - Heavy eyelids
    - Warmth spreading through body
    - Breathing slowing down
    - Gradual drift into sleep""",

    "Nightmares": """Write a 100-word story starting with: "{user_words}" featuring:
    - Darkness becoming comforting
    - A protective light
    - Sounds becoming distant
    - Fear transforming into safety""",

    "Sleep Anxiety": """Develop a 100-word story opening with: "{user_words}" containing:
    - Anxious thoughts dissolving
    - Progressive muscle relaxation
    - External sounds fading
    - Gentle sleep onset"""
}

# --- Helper Functions (from the notebook) ---

def _generate_story_text(prompt, model="mistral-tiny"):
    """Calls the Mistral AI API to generate the story text."""
    if not MISTRAL_API_KEY:
        raise ValueError("MISTRAL_API_KEY is not set in the environment.")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {MISTRAL_API_KEY}"
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.5,
        "max_tokens": 400
    }
    response = requests.post(MISTRAL_API_URL, headers=headers, json=data)
    response.raise_for_status() # This will raise an HTTPError for bad responses (4xx or 5xx)
    return response.json()["choices"][0]["message"]["content"]

def _text_to_speech(text, filename):
    """Converts text to an MP3 audio file."""
    tts = gTTS(text=text, lang='en', slow=True)
    tts.save(filename)
    return filename

def _create_text_frame(text, width=800, height=600):
    # This function is complex and seems to have an error in the original notebook.
    # It has been simplified for stability. A more robust solution might be needed long-term.
    img = Image.new('RGB', (width, height), (8, 37, 103)) # Dark blue background
    draw = ImageDraw.Draw(img)

    # Simplified text drawing
    try:
        # Use a commonly available font if possible, otherwise default
        font = ImageFont.truetype("arial.ttf", 24)
    except IOError:
        font = ImageFont.load_default()
    
    # Simple text wrapping logic
    margin = 40
    offset = 50
    for line in text.split('\n'):
        draw.text((margin, offset), line, font=font, fill=(255, 255, 255))
        offset += font.getbbox(line)[3] + 5 if hasattr(font, 'getbbox') else font.getsize(line)[1]

    return np.array(img)

# def _create_video_from_audio(story_text, audio_path, video_path):
#     """Creates a simple video with text overlayed, synced to audio duration."""
#     try:
#         audio_clip = AudioFileClip(audio_path)
#         duration = audio_clip.duration
        
#         # Create a single image frame for the video
#         frame = _create_text_frame(story_text)
        
#         # Create a video clip from the single frame, lasting the duration of the audio
#         video_clip = ImageSequenceClip([frame], durations=[duration])
#         final_clip = video_clip.set_audio(audio_clip)

#         # Write the video file
#         final_clip.write_videofile(
#             video_path,
#             codec='libx264',
#             audio_codec='aac',
#             fps=24,
#             threads=4,
#             preset='ultrafast',
#             logger=None # Suppress moviepy console output
#         )
#         return video_path
#     finally:
#         if 'audio_clip' in locals():
#             audio_clip.close()
#         if 'final_clip' in locals():
#             final_clip.close()

# Copy this entire function and paste it into story_generator.py

def _create_video_from_audio(story_text, audio_path, video_path):
    """Creates a simple video with text overlayed, synced to audio duration."""
    # Using 'with' statements for automatic resource cleanup
    with AudioFileClip(audio_path) as audio_clip:
        duration = audio_clip.duration
        
        # Create a single image frame for the video
        frame = _create_text_frame(story_text)
        
        # Create a video clip from the single frame
        with ImageSequenceClip([frame], durations=[duration]) as video_clip:
            
            # --- THIS IS THE FIX ---
            # Set the audio of the video clip directly
            video_clip.audio = audio_clip

            # Write the video file using the modified video_clip
            video_clip.write_videofile(
                video_path,
                codec='libx264',
                audio_codec='aac',
                fps=24,
                threads=4,
                preset='ultrafast',
                logger=None # Suppress moviepy console output
            )
    return video_path

# --- MAIN FUNCTION (This is what our route will call) ---

def create_story_assets(theme, user_words):
    """
    Main function to generate story, audio, and video.
    Returns a dictionary with the story text and relative paths to the assets.
    """
    # 1. Get the prompt and generate the story text
    prompt = THERAPY_SCENARIOS[theme].format(user_words=user_words)
    story_text = _generate_story_text(prompt)

    # 2. Define file paths. We'll save files into a static/uploads directory.
    # This ensures Flask can serve them to the user.
    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
    os.makedirs(upload_folder, exist_ok=True) # Ensure the directory exists

    base_filename = f"story_{random.randint(1000, 9999)}"
    audio_filepath = os.path.join(upload_folder, f"{base_filename}.mp3")
    video_filepath = os.path.join(upload_folder, f"{base_filename}.mp4")

    # 3. Generate the audio file
    _text_to_speech(story_text, audio_filepath)

    # 4. Generate the video file
    _create_video_from_audio(story_text, audio_filepath, video_filepath)

    # 5. Return the story text and RELATIVE URLs for the frontend
    # The frontend will combine this with the BASE_URL
    return {
        "story": story_text,
        "audio_url": f"/static/uploads/{base_filename}.mp3",
        "video_url": f"/static/uploads/{base_filename}.mp4"
    }


# import requests
# import json
# from IPython.display import display, HTML, Audio, Video
# import ipywidgets as widgets
# from gtts import gTTS
# import os
# from base64 import b64encode
# from moviepy import ImageSequenceClip, AudioFileClip, concatenate_videoclips
# import numpy as np
# from PIL import Image, ImageDraw, ImageFont
# import random
# from io import BytesIO
# # Initialize Mistral API
# MISTRAL_API_KEY = "Ws5TioMifBo0CfMK4XTxKhSO38ISTe4C"  # Replace with your key
# MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

# # Therapy scenarios
# THERAPY_SCENARIOS = {
#     "Insomnia": """Create a 100-word sleep story beginning with: "{user_words}". Include:
#     - Heavy eyelids
#     - Warmth spreading through body
#     - Breathing slowing down
#     - Gradual drift into sleep""",

#     "Nightmares": """Write a 100-word story starting with: "{user_words}" featuring:
#     - Darkness becoming comforting
#     - A protective light
#     - Sounds becoming distant
#     - Fear transforming into safety""",

#     "Sleep Anxiety": """Develop a 100-word story opening with: "{user_words}" containing:
#     - Anxious thoughts dissolving
#     - Progressive muscle relaxation
#     - External sounds fading
#     - Gentle sleep onset"""
# }

# def generate_story(prompt, model="mistral-tiny"):
#     headers = {
#         "Content-Type": "application/json",
#         "Authorization": f"Bearer {MISTRAL_API_KEY}"
#     }

#     data = {
#         "model": model,
#         "messages": [{"role": "user", "content": prompt}],
#         "temperature": 0.5,
#         "max_tokens": 400
#     }

#     response = requests.post(MISTRAL_API_URL, headers=headers, json=data)
#     if response.status_code == 200:
#         return response.json()["choices"][0]["message"]["content"]
#     return f"Error: {response.text}"

# def text_to_speech(text, filename='sleep_story.mp3'):
#     """Convert text to audio with slow speech rate"""
#     tts = gTTS(text=text, lang='en', slow=True)
#     tts.save(filename)
#     return filename

# def create_text_frame(text, width=800, height=600):
#     """Create a single frame with text using Pillow"""
#     img = Image.new('RGB', (width, height), (8, 37, 103))
#     draw = ImageDraw.Draw(img)

#     # Add stars
#     for _ in range(20):
#         x, y = random.randint(0, width), random.randint(0, height//2)
#         size = random.randint(1, 3)
#         draw.ellipse((x, y, x+size, y+size), fill=(255, 255, 255))

#     # Add text with word wrapping
#     try:
#         font = ImageFont.truetype("DejaVuSans.ttf", 24)
#     except:
#         font = ImageFont.load_default()

#     # Modern PIL version uses textbbox instead of getsize
#     if hasattr(font, 'getbbox'):
#         bbox = font.getbbox("A")
#         char_width = bbox[2] - bbox[0]
#         char_height = bbox[3] - bbox[1]
#     else:
#         # Fallback for older PIL versions
#         char_width, char_height = font.getsize("A")

#     chars_per_line = width // char_width
#     max_lines = (height - 200) // char_height
#     y_offset = 100

#     words = text.split()
#     line = ""
#     line_count = 0

#     for word in words:
#         test_line = f"{line} {word}".strip()
#         test_bbox = font.getbbox(test_line) if hasattr(font, 'getbbox') else font.getsize(test_line)
#         test_width = test_bbox[2] - test_bbox[0] if hasattr(font, 'getbbox') else test_bbox[0]

#         if test_width <= width - 100:
#             line = test_line
#         else:
#             draw.text((50, y_offset), line, font=font, fill=(255, 255, 255))
#             y_offset += char_height + 10
#             line_count += 1
#             line = word

#             if line_count >= max_lines:
#                 break

#     if line and line_count < max_lines:
#         draw.text((50, y_offset), line, font=font, fill=(255, 255, 255))

#     return np.array(img)

# def create_animated_video(story_text, audio_file, output_file='sleep_story.mp4'):
#     """Create video using only Pillow (no ImageMagick)"""
#     # Create audio clip
#     audio = AudioFileClip(audio_file)
#     duration = audio.duration

#     # Create frames (we'll use just one frame with the full text)
#     frame = create_text_frame(story_text)

#     # Create video clip (single frame for the whole duration)
#     clip = ImageSequenceClip([frame], durations=[duration])
#     clip = clip.set_audio(audio)

#     # Write video file
#     clip.write_videofile(
#         output_file,
#         codec='libx264',
#         audio_codec='aac',
#         fps=24,
#         threads=4,
#         preset='ultrafast'
#     )
#     return output_file

# def on_generate_clicked(b):
#     with output:
#         output.clear_output()
#         theme = theme_dropdown.value
#         user_words = user_input.value.strip()

#         if not user_words:
#             display(HTML("<p style='color:red'>Please enter your sleep intention</p>"))
#             return

#         # Generate story
#         display(HTML("<h3 style='color:#4a6fa5'>🌿 Crafting your sleep story...</h3>"))
#         prompt = THERAPY_SCENARIOS[theme].format(user_words=user_words)
#         story = generate_story(prompt)

#         if story.startswith("Error:"):
#             display(HTML(f"<p style='color:red'>{story}</p>"))
#             return

#         # Create audio
#         display(HTML("<p>🔊 Generating soothing audio...</p>"))
#         audio_file = text_to_speech(story)
#         audio_player = Audio(audio_file)

#         # Create animated video
#         display(HTML("<p>🎬 Creating animated video...</p>"))
#         video_file = create_animated_video(story, audio_file)

#         # Display results
#         display(HTML("<h3 style='margin-top:20px;'>📖 Full Story Text</h3>"))
#         display(HTML(f"""
#         <div style='background:#f8f9fa; padding:15px; border-radius:8px; margin:10px 0; max-height:300px; overflow-y:auto;'>
#             <div style='white-space: pre-wrap; line-height:1.7;'>{story}</div>
#         </div>
#         """))

#         display(HTML("<h3>🔈 Audio Version</h3>"))
#         display(audio_player)

#         display(HTML("<h3>🎥 Animated Video</h3>"))
#         display(Video(video_file, embed=True, html_attributes="controls autoplay"))

#         # Download buttons
#         with open(video_file, 'rb') as f:
#             video_data = f.read()
#         with open(audio_file, 'rb') as f:
#             audio_data = f.read()

#         display(HTML(
#             f"""
#             <div style='display:flex; flex-wrap:wrap; gap:10px; margin:20px 0;'>
#                 <a download='sleep_story.mp4' href='data:video/mp4;base64,{b64encode(video_data).decode()}'
#                 style='padding:10px; background:#4a6fa5; color:white; border-radius:5px; text-decoration:none;'>
#                 📹 Download Video
#                 </a>

#                 <a download='sleep_story.mp3' href='data:audio/mp3;base64,{b64encode(audio_data).decode()}'
#                 style='padding:10px; background:#4a6fa5; color:white; border-radius:5px; text-decoration:none;'>
#                 🔈 Download Audio
#                 </a>

#                 <a download='sleep_story.txt' href='data:text/plain;base64,{b64encode(story.encode()).decode()}'
#                 style='padding:10px; background:#4a6fa5; color:white; border-radius:5px; text-decoration:none;'>
#                 📝 Download Text
#                 </a>
#             </div>
#             """
#         ))

# # UI Elements
# theme_dropdown = widgets.Dropdown(
#     options=list(THERAPY_SCENARIOS.keys()),
#     value="Insomnia",
#     description="Sleep Issue:",
#     style={'description_width': 'initial'}
# )

# user_input = widgets.Textarea(
#     placeholder="Type your positive intention (e.g., 'My mind is calm and ready for sleep')",
#     description="Your Words:",
#     layout=widgets.Layout(width='90%', height='80px')
# )

# generate_button = widgets.Button(
#     description="Create Sleep Story",
#     button_style='success',
#     icon='moon',
#     layout=widgets.Layout(width='200px')
# )
# generate_button.on_click(on_generate_clicked)

# output = widgets.Output()

# # Display UI
# display(HTML("""
# <div style='background:#4a6fa5; padding:15px; border-radius:8px; color:white;'>
#     <h1 style='margin:0;'>🌙 Sleep Story Generator</h1>
#     <p style='margin:5px 0 0;'>Get your story in text, audio, and video formats</p>
# </div>
# """))

# display(theme_dropdown)
# display(user_input)
# display(generate_button)
# display(output)

# # Footer
# display(HTML("""
# <div style='margin-top:20px; padding:10px; background:#f5f5f5; border-radius:5px; text-align:center;'>
#     <p>For best results: Watch the video fullscreen with headphones</p>
# </div>
# """))