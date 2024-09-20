from flask import Flask, request, jsonify, render_template, send_from_directory
import os, json, math
from datetime import datetime
from telegram import Bot

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'mp4', 'mkv', 'avi', 'mov'}
MAX_FILE_SIZE_MB = 2000  # Max file size for splitting in MB
BOT_TOKEN = '8070122008:AAFE1EzRODhycdMHA3pes3usZmF8uDdqtLM'  # Replace with your bot token
CHAT_ID = '1001645098763'  # Replace with your chat ID
bot = Bot(token=BOT_TOKEN)

metadata_file = 'file_metadata.json'

# Load or initialize metadata storage
if os.path.exists(metadata_file):
    with open(metadata_file, 'r') as f:
        file_metadata = json.load(f)
else:
    file_metadata = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Split large files into chunks
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

# Upload to Telegram
def upload_to_telegram(filepath):
    with open(filepath, 'rb') as video_file:
        bot.send_video(chat_id=CHAT_ID, video=video_file, supports_streaming=True)

# Main page
@app.route('/')
def index():
    return render_template('index.html')

# File upload route
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

# Search route
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q').lower()
    results = {k: v for k, v in file_metadata.items() if query in k.lower()}
    return jsonify(results)

# File download route
@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    if filename in file_metadata:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
