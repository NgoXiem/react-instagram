import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import db from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
export default function User() {
  const user = useContext(UserContext);
  const [data, setData] = useState({});
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
    getUser(db);
  }, [user]);
  return (
    <div className="grid grid-cols-3 items-center">
      <Link to={`/profile:${data.userId}`}>
        <img
          className="rounded-full w-16 h-16 object-cover col-span-1"
          src={
            data
              ? `images/avatars/${data.username}.jpg`
              : `images/avatars/default.jpg`
          }
          alt="profile"
        />
      </Link>
      <div className="col-span-2">
        <p className="font-semibold">{data.username}</p>
        <p>{data.fullName}</p>
      </div>
    </div>
  );
}
