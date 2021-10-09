import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { LoggedInUserContext } from "../../App";
import db from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
export default function PostHeader({ user }) {
  const loggedinUser = useContext(LoggedInUserContext);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    async function getAvatarById(id) {
      const q = query(collection(db, "avatars"), where("userId", "==", id));
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    }
    getAvatarById(loggedinUser.userId).then((querySnapshot) =>
      querySnapshot.forEach((doc) => setImageUrl(doc.data().imageSrc))
    );
  }, [loggedinUser.userId]);

  return (
    <>
      {!user ? (
        <Skeleton count={1}></Skeleton>
      ) : (
        <div className="flex gap-3 items-center pl-5 pb-1">
          <img
            className="w-8 h-8 rounded-full object-cover"
            alt="profile"
            src={
              loggedinUser.userId === user.userId
                ? imageUrl
                : `/images/avatars/${user.username}.jpg`
            }
            onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
          />
          <Link to={`/profile/${user.userId}`}>
            <span className="font-bold">{user.username}</span>
          </Link>
        </div>
      )}
    </>
  );
}
