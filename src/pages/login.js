import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { app } from "../lib/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const auth = getAuth();

  const isInvalid = email === "" || password === "";
  const handleFB = (e) => {
    // e.preventDefault();
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        console.log("signed in");

        const user = result.user;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        history.push("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        setError(error.message);
        setEmail("");
        setPassword("");
      });
  };
  return (
    <div className="bg-gray-background">
      <div className=" pt-10 container mx-auto">
        <div className="flex flex-row justify-center items-center ">
          <div className="container w-1/3 hidden md:flex ">
            <img
              src="/images/iphone-with-profile.jpg"
              alt="iphone-with-profile"
            />
          </div>
          <div className="text-sm bg-white">
            <div className="flex flex-col border mb-5 p-10 ">
              <div className="flex justify-center items-center mb-10">
                <img src="/images/logo.png" alt="logo" />
              </div>
              <form
                className="flex flex-col gap-5"
                onSubmit={(e) => handleSubmit(e)}
              >
                {error && <div className="text-sm text-red-600">{error}</div>}

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
                <div className="text-center font-semibold text-sm text-gray-500">
                  OR
                </div>
                <div className="text-blue-700 font-semibold text-center">
                  <p
                    href="#"
                    onClick={(e) => handleFB(e)}
                    className="cursor-pointer"
                  >
                    Log in with Facebook
                  </p>
                </div>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white rounded px-2 py-1 font-medium ${
                    isInvalid && "opacity-50"
                  }`}
                  disabled={isInvalid}
                >
                  Log In
                </button>
              </form>
            </div>
            <div className="border py-3 px-2 text-center">
              Don't have an account?
              <Link to="/signup" className=" text-blue-400 font-medium ml-1">
                {" "}
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
