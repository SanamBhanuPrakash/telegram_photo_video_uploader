// src/components/UploadedVideos.js

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const UploadedVideos = () => {
  const video = JSON.parse(localStorage.getItem('uploadedVideo'));

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '50px', textAlign: 'center' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Uploaded Video Details
          </Typography>
          {video ? (
            <div>
              <Typography variant="body1">{`Name: ${video.name}`}</Typography>
              <Typography variant="body1">{`Size: ${video.size} bytes`}</Typography>
            </div>
          ) : (
            <Typography variant="body1">No video uploaded</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadedVideos;
