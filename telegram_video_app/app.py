from flask import Flask, request, jsonify, render_template, send_from_directory
import os, json, math
from datetime import datetime
from telegram import Bot
import logging

# Initialize Flask app
app = Flask(__name__)

# Configure app settings
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'mp4', 'mkv', 'avi', 'mov'}
MAX_FILE_SIZE_MB = 2000  # Max file size for splitting in MB

# Use environment variables for Telegram bot token and chat ID
BOT_TOKEN = os.getenv('BOT_TOKEN')
CHAT_ID = os.getenv('CHAT_ID')
bot = Bot(token=BOT_TOKEN)

# File for metadata
metadata_file = 'file_metadata.json'

# Enable logging
logging.basicConfig(level=logging.INFO)
logging.info("Starting app with Telegram Bot Token and Chat ID")
logging.info(f"BOT_TOKEN: {BOT_TOKEN}, CHAT_ID: {CHAT_ID}")

# Ensure the metadata file is loaded or initialized
if os.path.exists(metadata_file) and os.path.getsize(metadata_file) > 0:
    with open(metadata_file, 'r') as f:
        try:
            file_metadata = json.load(f)
        except json.JSONDecodeError:
            file_metadata = {}  # Initialize to empty dictionary if JSON is invalid
else:
    file_metadata = {}

# Ensure upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Split large video files into parts
def split_file(filepath, filename):
    file_size = os.path.getsize(filepath)
    part_size = MAX_FILE_SIZE_MB * 1024 * 1024
    num_parts = math.ceil(file_size / part_size)

    part_files = []
    with open(filepath, 'rb') as f:
        for i in range(num_parts):
            part_filename = f'{filename}.part{i+1}'
            with open(os.path.join(app.config['UPLOAD_FOLDER'], part_filename), 'wb') as part:
                part.write(f.read(part_size))
            part_files.append(part_filename)
    return part_files

# Upload file parts to Telegram
def upload_to_telegram(filepath):
    with open(filepath, 'rb') as video_file:
        bot.send_video(chat_id=CHAT_ID, video=video_file, supports_streaming=True)

# Main route
@app.route('/')
def index():
    return render_template('index.html')

# Route for uploading files
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Split file if it's too large
        part_files = split_file(filepath, filename)

        # Upload each part to Telegram
        for part_file in part_files:
            upload_to_telegram(os.path.join(app.config['UPLOAD_FOLDER'], part_file))

        # Save metadata
        file_metadata[filename] = {
            "name": filename,
            "size": os.path.getsize(filepath),
            "parts": part_files,
            "date_added": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        with open(metadata_file, 'w') as f:
            json.dump(file_metadata, f)

        return jsonify({"message": "File uploaded successfully", "filename": filename}), 201
    else:
        return jsonify({"error": "Unsupported file format"}), 400

# Route for listing uploaded videos
@app.route('/videos', methods=['GET'])
def list_videos():
    # Get the list of uploaded videos from the file_metadata.json
    return render_template('videos.html', videos=file_metadata)

# Route for downloading files
@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    if filename in file_metadata:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

# Run app in debug mode for troubleshooting
if __name__ == '__main__':
    app.run(debug=True)
