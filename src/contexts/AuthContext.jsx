
import { createContext, useContext, useState, useEffect } from "react";

// ✅ Exportamos también el contexto directamente
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    // AUTOLOGIN SOLO EN DESARROLLO Y CUANDO NO HAY USUARIO
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_AUTOLOGIN === "true" && !user) {
      const devUser = {
        _id: "dev-1",
        nombre: "Developer Local",
        role: "developer",
      };

      const fakeToken = "dev-token-local";

      localStorage.setItem("user", JSON.stringify(devUser));
      localStorage.setItem("token", fakeToken);

      setUser(devUser);
      setToken(fakeToken);

      console.log("%cAuto-login DEV habilitado → Role: developer", "color: #00c853");
    }
  }, []);

  const login = (userData, tokenData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente
export const useAuth = () => useContext(AuthContext);
