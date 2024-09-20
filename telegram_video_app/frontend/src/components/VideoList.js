import React from 'react';

function VideoList({ videos }) {
  return (
    <div>
      <h2>Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p>No videos uploaded.</p>
      ) : (
        <ul>
          {videos.map((video, index) => (
            <li key={index}>
              <video width="320" height="240" controls>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p>{video.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VideoList;
