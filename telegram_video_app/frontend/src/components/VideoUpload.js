import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Snackbar } from '@mui/material';
import { useHistory } from 'react-router-dom';

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // For success message
  const history = useHistory(); // For redirection

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
      setOpenSnackbar(true); // Show success message
      setTimeout(() => {
        history.push('/videos'); // Redirect after success
      }, 2000); // Redirect after 2 seconds
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

      {/* Snackbar for showing success message */}
      <Snackbar
        open={openSnackbar}
        message="Successfully uploaded"
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      />
    </div>
  );
};

export default VideoUpload;
