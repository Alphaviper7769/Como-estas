import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink
} from 'react-router-dom';

import { AuthContext } from './components/context/auth-context';
import { useAuth } from './components/hooks/auth-hook';

import { Navbar } from './components/utils/Navbar';
import { Auth } from './pages/Auth';
import { SignupEmp } from './pages/employer/SignupEmp';
import { SignupSeeker } from './pages/employee/SignupSeeker';
import { Dashboard } from './pages/employer/Dashboard';

function App() {
  // Context API
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
      <div className="App">
        {/* {!!token && <Navbar links={['Dashboard', 'Contact Us', 'Profile', 'LOGOUT']} />} */}
        <Router>
          <Routes>
            <Route path="/" exact element={<Auth />} />
            {/* <Route path="signup" exact element={admin ? <SignupEmp /> : <SignupSeeker />} /> */}
            <Route path='/signup' exact element={<SignupEmp />} />
            <Route path='/dashboard' exact element={<Dashboard />} />
          </Routes>
        </Router>
      </div>
    {/*</AuthContext.Provider>*/}
    </>
  );
}

export default App;
