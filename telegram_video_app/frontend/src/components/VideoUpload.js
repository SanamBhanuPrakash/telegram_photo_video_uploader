import React, { useState } from 'react';

function VideoUpload({ onUpload }) {
  const [message, setMessage] = useState('');

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        setMessage('Video uploaded successfully!');
        onUpload();  // Refresh the video list after upload
        setTimeout(() => setMessage(''), 3000);  // Hide message after 3 seconds
      })
      .catch(error => {
        console.error('Error uploading video:', error);
        setMessage('Error uploading video.');
      });
  };

  return (
    <div>
      <h2>Upload a Video</h2>
      <input type="file" accept="video/*" onChange={handleUpload} />
      {message && <p>{message}</p>}
    </div>
  );
}

export default VideoUpload;
