// src/components/VideoUpload.js

import React, { useState } from 'react';
import { Button, Typography, Card, CardContent, Link } from '@mui/material';

const VideoUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    localStorage.setItem('uploadedVideo', JSON.stringify({ name: file.name, size: file.size }));
  };

  const handleUpload = () => {
    alert("File uploaded successfully");
    window.location.href = '/videos';
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', padding: '50px' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome to the Video Upload App
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Select a video to upload:
          </Typography>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ margin: '20px 0', padding: '10px' }}
          />
          <Typography variant="body1" color="textPrimary">
            {file && file.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file}
          >
            Upload Video
          </Button>
          <br />
          <Link href="/videos" underline="hover">
            View Uploaded Videos
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUpload;
