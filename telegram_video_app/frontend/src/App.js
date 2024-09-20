import React, { useState, useEffect } from 'react';
import VideoUpload from './VideoUpload';
import VideoList from './VideoList';

function App() {
  const [videos, setVideos] = useState([]);

  // Fetch the videos from the backend when the app loads
  useEffect(() => {
    fetch('/get-videos')
      .then(response => response.json())
      .then(data => setVideos(data))
      .catch(error => console.error('Error fetching videos:', error));
  }, []);

  return (
    <div>
      <h1>Video Upload App</h1>
      <VideoUpload onUpload={() => {
        // Refetch videos after upload
        fetch('/get-videos')
          .then(response => response.json())
          .then(data => setVideos(data))
          .catch(error => console.error('Error fetching videos:', error));
      }} />
      <VideoList videos={videos} />
    </div>
  );
}

export default App;
