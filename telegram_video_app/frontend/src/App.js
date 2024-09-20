
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoUpload from './components/VideoUpload';
import UploadedVideos from './components/UploadedVideos';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoUpload />} />
        <Route path="/videos" element={<UploadedVideos />} />
      </Routes>
    </Router>
  );
};

export default App;
