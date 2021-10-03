import "./styles/app.css";
import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import db from "./lib/firebase";

const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const NotFound = lazy(() => import("./pages/notfound"));
const Profile = lazy(() => import("./pages/profile"));

export const UserContext = React.createContext(null);
export const LoggedInUserContext = React.createContext(null);
export default function App() {
  // const {id} = useParams();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [data, setData] = useState({});
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setUser(null);
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
          setData(data);
        } else {
          console.log("No such document!");
        }
      });
  }, [user]);

  return (
    <UserContext.Provider value={user}>
      <LoggedInUserContext.Provider value={data}>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/login" component={Login}></Route>
              <Route path="/signup" component={Signup}></Route>
              <Route path="/profile/:id" component={Profile}></Route>
              <PrivateRoute>
                <Route exact path="/" component={Dashboard}></Route>
              </PrivateRoute>
              <Route component={NotFound}></Route>
            </Switch>
          </Suspense>
        </Router>
      </LoggedInUserContext.Provider>
    </UserContext.Provider>
  );
}
