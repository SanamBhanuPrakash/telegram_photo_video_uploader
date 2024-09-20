import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await fetch('/videos'); // Assuming you have an endpoint that lists videos
      const data = await response.json();
      setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.name}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={`/thumbnail/${video.name}`} // Assuming you have a way to serve thumbnails
                alt={video.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VideoList;
