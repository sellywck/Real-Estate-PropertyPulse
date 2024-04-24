import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);

  // firebase authentication
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    handleIdentityUpdate();
  }, [currentUser]);

  function handleIdentityUpdate() {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setIdentity(decodedToken);
    } else {
      setIdentity(null);
    }
  }

  function handleIdentitySignOut() {
    setIdentity(null);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        identity,
        handleIdentityUpdate,
        handleIdentitySignOut,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
