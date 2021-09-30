import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Timeline from "../components/Timeline";
import Sidebar from "../components/sidebar/Sidebar";
import db from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserContext } from "../App";

export const LoggedInUserContext = React.createContext(null);
export default function Dashboard() {
  const user = useContext(UserContext);
  const [data, setData] = useState({});
  const isMounted = React.createRef(false);
  useEffect(() => {
    return (isMounted.current = true);
  });
  useEffect(() => {
    const getUser = async (db) => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    };
    user &&
      getUser(db).then((data) => {
        if (data) {
          isMounted && setData(data);
        } else {
          console.log("No such document!");
        }
      });
    getUser(db);
  }, [user]);
  return (
    <LoggedInUserContext.Provider value={data}>
      <div>
        <Header></Header>
        <div className="max-w-screen-lg grid grid-cols-3 items-center justify-between mx-auto mt-10 gap-10">
          <div className="col-span-2 border">
            <Timeline></Timeline>
          </div>
          <div className="col-span-1">
            <Sidebar></Sidebar>
          </div>
        </div>
      </div>
    </LoggedInUserContext.Provider>
  );
}
