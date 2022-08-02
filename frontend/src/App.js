import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink
} from 'react-router-dom';

import { AuthContext } from './components/context/auth-context';
import { useAuth } from './components/hooks/auth-hook';

import { Navbar } from './components/navigation/Navbar';
import { Auth } from './pages/Auth';
import { SignupEmp } from './pages/employer/SignupEmp';
import { SignupSeeker } from './pages/employee/SignupSeeker';
import { Dashboard } from './pages/employer/Dashboard';
import { SeekerDashboard } from './pages/employee/Dashboard';
import { Contactus } from './pages/Contactus';

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
          <Navbar links={['Dashboard', 'Contact-Us', 'Profile', 'LOGOUT']} />
          <Routes>
            <Route path="/" exact element={<Auth />} />
            {/* <Route path="signup" exact element={admin ? <SignupEmp /> : <SignupSeeker />} /> */}
            <Route path='/signup' exact element={<SignupEmp />} />
            <Route path='/dashboard' exact element={<Dashboard />} />
            <Route path='/dashboards' exact element={<SeekerDashboard />} />
          </Routes>
        </Router>
      </div>
      <Contactus />
    {/*</AuthContext.Provider>*/}
    </>
  );
}

export default App;
