import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { app } from "../lib/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useHistory } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import db from "../lib/firebase";

export default function Header() {
  const isMounted = useRef(true);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("default");
  const [userId, setUserId] = useState("");
  const history = useHistory();
  const auth = getAuth();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isMounted && setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        isMounted && setUser(null);
        localStorage.removeItem("user");
      }
    });
  }, [auth]);

  useEffect(() => {
    const getUser = async (db) => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    };
    user &&
      getUser(db).then((data) => {
        if (data) {
          setUsername(data.username);
          setUserId(data.userId);
        } else {
          console.log("No such document!");
        }
      });
  }, [user]);

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return user ? (
    <header className="border-b pb-2 bg-white fixed top-0 w-full z-10 px-10">
      <div className="flex justify-between mx-auto items-center pt-4 max-w-screen-lg container">
        <div>
          <Link to="/">
            <img
              className="w-3/6 cursor-pointer"
              src="/images/logo.png"
              alt="logo"
            />
          </Link>
        </div>
        <div>
          <div className="flex flex-row items-center gap-5">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
            <button onClick={() => handleSignout()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
            <Link to={`/profile/${userId}`}>
              <img
                src={`/images/avatars/${username}.jpg`}
                alt="profile"
                className="rounded-full h-8 w-8 object-cover "
                onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  ) : (
    <header className="">
      <div className="flex justify-between mx-auto items-center border-b-1 mt-5 max-w-screen-lg container">
        <div>
          <div>
            <img
              className="w-3/6 cursor-pointer"
              src="/images/logo.png"
              alt="logo"
            />
          </div>
        </div>
        <div className="flex">
          <Link
            to="/login"
            className="bg-blue-500 text-sm sm:text-xs font-semibold text-white px-2 py-1 text-center rounded cursor-pointer"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-blue-500 text-sm sm:text-xs font-semibold ml-3 px-2 py-1 text-center rounded cursor-pointer"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
