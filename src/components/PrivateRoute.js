import React, { useEffect, useState, useRef } from "react";
import { Redirect } from "react-router";
import { app } from "../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState({});
  const isMounted = useRef(false);
  const auth = getAuth();
  useEffect(() => {
    return (isMounted.current = true);
  });
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isMounted && setUser(user);
      } else {
        isMounted && setUser(null);
      }
    });
  }, [auth]);
  return user ? <>{children}</> : <Redirect to="/login"></Redirect>;
}
