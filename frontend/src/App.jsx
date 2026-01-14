import { Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './services/authService';
import './App.css';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Group from './pages/Group';
import GroupDetails from './pages/GroupDetails';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import FoodDetails from './pages/FoodDetails';
import Claims from './pages/Claims';
import CityUsers from './pages/CityUsers';
import Navbar from './components/layout/Navbar';

function App() {
  const user = getCurrentUser();
  const isAuthenticated = !!user;

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:id"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/food/:id"
          element={isAuthenticated ? <FoodDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/city/available"
          element={isAuthenticated ? <Marketplace /> : <Navigate to="/login" />}
        />
        <Route
          path="/city/users"
          element={isAuthenticated ? <CityUsers /> : <Navigate to="/login" />}
        />
        <Route
          path="/groups"
          element={isAuthenticated ? <Group /> : <Navigate to="/login" />}
        />
        <Route
          path="/group/:id"
          element={isAuthenticated ? <GroupDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/claims"
          element={isAuthenticated ? <Claims /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App