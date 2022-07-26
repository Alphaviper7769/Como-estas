import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink
} from 'react-router-dom';

import { AuthContext } from './components/context/auth-context';
import { useAuth } from './components/hooks/auth-hook';
import ParticleBackground from './components/particle/ParticleBackground';

import { Auth } from './pages/Auth';
import { SignupEmp } from './pages/employer/SignupEmp';
import { SignupSeeker } from './pages/employee/SignupSeeker';

function App() {
  // const { id, admin, token, login, logout } = useAuth();
  // const auth = useContext(AuthContext);

  return (
    // <AuthContext.Provider value={{
    //   admin: admin,
    //   userId: id,
    //   token: token,
    //   login: login,
    //   logout: logout
    // }}>
    <>
      <ParticleBackground />
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" exact element={<Auth />} />
            {/* <Route path="signup" exact element={admin ? <SignupEmp /> : <SignupSeeker />} /> */}
            <Route path='/signup' exact element={<SignupEmp />} />
          </Routes>
        </Router>
      </div>
    {/*</AuthContext.Provider>*/}
    </>
  );
}

export default App;
