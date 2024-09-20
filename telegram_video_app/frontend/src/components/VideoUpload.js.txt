import React, { useState } from 'react';
import { Button, TextField, CircularProgress } from '@mui/material';

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setLoading(false);
    if (response.ok) {
      alert(`File uploaded: ${data.filename}`);
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <div>
      <TextField
        type="file"
        onChange={handleFileChange}
        label="Choose a video"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button
        onClick={handleUpload}
        variant="contained"
        color="primary"
        disabled={!file || loading}
      >
        Upload Video
      </Button>
      {loading && <CircularProgress />}
    </div>
  );
};

export default VideoUpload;
