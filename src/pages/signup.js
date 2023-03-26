import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { app } from "../lib/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Add a new document in collection "users"
        const user = userCredential.user;
        const addUser = async () => {
          await setDoc(doc(db, "users", user.uid), {
            userId: user.uid,
            username: username.toLowerCase(),
            fullName: fullname,
            email: email.toLowerCase(),
            following: ["2"],
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
    <div className="bg-gray-background min-h-screen">
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
                  value={username}
                />
                <input
                  type="text"
                  placeholder="Full name"
                  className="border p-1 focus:outline-none focus:border-gray-500 rounded"
                  onChange={(e) => setFullname(e.target.value)}
                  value={fullname}
                />
                <input
                  type="text"
                  placeholder="Email address"
                  className="border p-1 focus:outline-none focus:border-gray-500 rounded"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border p-1 focus:outline-none focus:border-gray-500 rounded"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
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
