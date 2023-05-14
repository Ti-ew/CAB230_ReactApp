import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();
const API_URL = `http://sefdb02.qut.edu.au:3000`;
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bearerToken, setBearerToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  let refreshTimeoutId = null;
  useEffect(() => {
    if (bearerToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [bearerToken]);
  const refreshTokens = async () => {
    try {
      const response = await fetch(`${API_URL}/user/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const { bearerToken, refreshToken } = await response.json();

      setBearerToken(bearerToken.token);
      setRefreshToken(refreshToken.token);
      setTimeout(refreshTokens, (bearerToken.expires_in - 5) * 1000);
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
    }
  };
  const login = (loginBearerToken, loginRefreshToken) => { // Renamed parameters
    setBearerToken(loginBearerToken);
    setRefreshToken(loginRefreshToken);
    setIsLoggedIn(true);
    setTimeout(refreshTokens, (loginBearerToken.expires_in - 5) * 1000); // Use the renamed parameter
  };

  const logout = async () => {
    clearTimeout(refreshTimeoutId); // Clear the token refresh timeout

    try {
      const response = await fetch(`${API_URL}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    setBearerToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        bearerToken,
        refreshToken,
        login,
        logout,
        refreshTokens, // include the new refreshTokens function in the context value
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
