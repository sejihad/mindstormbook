// src/pages/GoogleSuccess.jsx

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN_SUCCESS } from "../../constants/userContants";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // 1. Token Save
      localStorage.setItem("token", token);

      // 2. Fetch User using token (or backend can send full user directly)
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/v1/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data.user;

          // 3. Redux Persist
          dispatch({ type: LOGIN_SUCCESS, payload: user });

          // 4. Redirect to Homepage
          navigate("/");
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return <p>Logging you in...</p>;
};

export default GoogleSuccess;
