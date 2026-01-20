import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import * as auth from "../utils/auth";
import "./styles/App.css";
import { getToken, setToken } from "../utils/token";
import * as api from "../utils/api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "" });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const jwt = getToken();
    if (!jwt) {
      return;
    }
    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        setIsLoggedIn(true);
        setUserData({ username, email });
        navigate("/ducks");
      })
      .catch(console.error);
  }, [navigate]);

  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      return;
    }
    auth
      .login({ identifier: username, password })
      .then((data) => {
        if (data.jwt) {
          setToken(data.jwt);
          setIsLoggedIn(true);
          setUserData(data.user);
        }
      })
      .catch(console.error);
  };

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth
        .register({ username, email, password })
        .then(() => {
          navigate("/login", { replace: true });
        })
        .catch(console.error);
    }
  };

  return (
    <Routes>
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile userData={userData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin} />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
        }
      />
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
