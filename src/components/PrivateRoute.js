import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { app } from "../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState({});
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);
  return user ? <>{children}</> : <Redirect to="/login"></Redirect>;
}
