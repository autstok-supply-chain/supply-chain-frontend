import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from './routes/index';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline />
        <Routes />
      </div>
    );
  }
}

export default App;
