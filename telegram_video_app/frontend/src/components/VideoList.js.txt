import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await fetch('/videos');
      const data = await response.json();
      setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <div>
      {videos.map((video) => (
        <Card key={video.name} style={{ margin: '20px' }}>
          <CardMedia
            component="img"
            height="140"
            image={`/thumbnail/${video.name}`} // Replace with your thumbnail logic
            alt={video.name}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {video.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Size: {video.size} bytes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date Added: {video.date_added}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VideoList;
