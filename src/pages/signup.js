import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { app } from "../lib/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import db from "../lib/firebase";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const auth = getAuth();
  const isInvalid = email === "" || password === "" || username === "";

  const handleFB = (e) => {
    e.preventDefault();
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        history.push("/dashboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // Add a new document in collection "users"
        const user = userCredential.user;
        const addUser = async () => {
          await setDoc(doc(db, "users", user.uid), {
            userId: user.uid,
            username: username.toLowerCase(),
            fullName: username.fullname,
            email: email.toLowerCase(),
            following: ["2", "3", "4"],
            followers: [],
            dateCreated: Date.now(),
          });
        };
        addUser(db);
        history.push("/");
      })
      .catch((error) => {
        setError(error.message);
        setEmail("");
        setPassword("");
        setUsername("");
        setFullname("");
      });
  };

  return (
    <div className="bg-gray-background">
      <div className=" pt-10 container mx-auto">
        <div className="flex flex-row justify-center items-center ">
          <div className="text-sm bg-white">
            <div className="flex flex-col border p-10">
              <div className="flex justify-center items-center mb-5">
                <img src="/images/logo.png" alt="logo" />
              </div>
              <div className="font-semibold text-gray-400 text-lg max-w-xs text-center">
                Sign up to see photos and videos from your friends.
              </div>
              <div className="border p-1 text-center bg-blue-500 rounded my-5">
                <a
                  href="/login"
                  className=" text-white font-medium ml-1 tracking-wide"
                  onClick={(e) => handleFB(e)}
                >
                  Log in with Facebook
                </a>
              </div>
              <form
                className="flex flex-col gap-5"
                onSubmit={(e) => handleSubmit(e)}
              >
                {error && <div className="text-sm text-red-600">{error}</div>}
                <input
                  type="text"
                  placeholder="Username"
                  className="border p-1 focus:outline-none focus:border-gray-500 rounded"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Full name"
                  className="border p-1 focus:outline-none focus:border-gray-500 rounded"
                  onChange={(e) => setFullname(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Email address"
                  className="border p-1 focus:outline-none focus:border-gray-500 rounded"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border p-1 focus:outline-none focus:border-gray-500 rounded"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className={`bg-blue-500 text-white rounded px-2 py-1 font-medium ${
                    isInvalid && "opacity-50"
                  }`}
                  disabled={isInvalid}
                >
                  Sign Up
                </button>
              </form>
            </div>
            <div className="border py-3 px-2 text-center mt-2">
              Have an account?
              <Link to="/login" className=" text-blue-400 font-medium ml-1">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
