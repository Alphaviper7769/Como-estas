import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink
} from 'react-router-dom';

import { Auth } from './pages/Auth';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Auth />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
