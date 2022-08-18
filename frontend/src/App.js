import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate
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
import { Inbox } from './pages/Inbox';

function App() {
  // Context API
  const { userId, admin, token, login, logout } = useAuth();

  return (
    <AuthContext.Provider value={{
      admin: admin,
      userId: userId,
      token: token,
      login: login,
      logout: logout
    }}>
      <div className="App">
        <Router>
          {!!token && <Navbar />}
          <Routes>
            {!token && <Route path="/" exact element={<Auth />} />}
            {token && <Route path="/" exact element={<Navigate to="/dashboard" />} />}
            {!token && <Route path='/signup' exact element={<SignupEmp />} />}
            {!!token && admin && <Route path='/dashboard' exact element={<Dashboard />} />}
            {!!token && !admin && <Route path='/dashboard' exact element={<SeekerDashboard />} />}
            {!!token && <Route path='/dashboard/inbox' exact element={<Inbox />} />}
            {!!token && admin && <Route path='/dashboard/applications/:uid' element={} />}
            <Route path="/logout" exact element={<Navigate to="/" />} />
            {!token && <Route path="/dashboard" element={<Navigate to="/" />} />}
          </Routes>
        </Router>
      </div>
      <Contactus />
    </AuthContext.Provider>
  );
}

export default App;
