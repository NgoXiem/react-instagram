import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { LoggedInUserContext } from "../../App";
import { doc, getDoc } from "firebase/firestore";
import db from "../../lib/firebase";
export default function User() {
  const loggedinUser = useContext(LoggedInUserContext);
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    const getAvatarbyId = async () => {
      const docRef = doc(db, "avatars", loggedinUser.userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setImageUrl(docSnap.data().imageSrc);
      } else {
        console.log("No such document");
      }
    };
    loggedinUser.userId && getAvatarbyId();
  }, [loggedinUser]);

  return loggedinUser.userId ? (
    <div className="flex gap-5 items-center max-w-sm">
      <img
        className="rounded-full w-16 h-16 object-cover col-span-1"
        src={imageUrl ? imageUrl : `/images/avatars/default.jpg`}
        alt="profile"
        onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
      />
      <div className="col-span-1">
        <Link to={`/profile/${loggedinUser.userId}`}>
          <p className="font-semibold">{loggedinUser.username}</p>
        </Link>
        <p className="text-gray-base">{loggedinUser.fullName}</p>
      </div>
    </div>
  ) : (
    <Skeleton count={1} height={40}></Skeleton>
  );
}
