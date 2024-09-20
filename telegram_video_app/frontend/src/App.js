import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import VideoUpload from './components/VideoUpload';
import VideoList from './components/VideoList';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/upload" component={VideoUpload} />
        <Route path="/videos" component={VideoList} />
      </Switch>
    </Router>
  );
};

export default App;
