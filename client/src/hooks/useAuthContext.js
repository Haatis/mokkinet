import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const apiUrl = "http://localhost:8800/api/login";

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(apiUrl, { headers })
        .then((response) => {
          const userData = response.data.user;
          setUser(userData);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
