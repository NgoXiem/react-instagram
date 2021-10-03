import React, { useState, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { LoggedInUserContext } from "../../App";
import db from "../../lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default function ProfileInfo({ clickedUser, photos, loggedinUserId }) {
  const [follow, setFollow] = useState(null);
  const [countFollow, setCountFollow] = useState(null);
  const { userId } = useContext(LoggedInUserContext);

  useEffect(() => {
    if (clickedUser) {
      setFollow(clickedUser.data.followers.includes(userId));
      setCountFollow(clickedUser.data.followers.length);
    }
  }, [clickedUser, userId]);

  const handleClick = () => {
    const followUser = async () => {
      const followRef = doc(db, "users", clickedUser.id);
      await updateDoc(followRef, {
        followers: arrayUnion(userId),
      });
      setFollow(true);
    };
    const unfollowUser = async () => {
      const unfollowRef = doc(db, "users", clickedUser.id);
      await updateDoc(unfollowRef, {
        followers: arrayRemove(userId),
      });
      setFollow(false);
    };
    const addFollowing = async () => {
      const update = doc(db, "users", userId);
      await updateDoc(update, {
        following: arrayUnion(clickedUser.data.userId),
      });
    };
    const removeFollowing = async () => {
      const update = doc(db, "users", userId);
      await updateDoc(update, {
        following: arrayRemove(clickedUser.data.userId),
      });
    };
    if (follow) {
      unfollowUser();
      setCountFollow(countFollow - 1);
      removeFollowing();
    } else {
      followUser();
      setCountFollow(countFollow + 1);
      addFollowing();
    }
  };
  return !photos ? (
    <Skeleton count={1} height={150}></Skeleton>
  ) : photos ? (
    <div className="grid grid-cols-3 justify-center items-center py-10 border-b w-full">
      <div className="col-span-1 flex justify-center items-center">
        <img
          className="rounded-full w-36 h-36 object-cover"
          src={`/images/avatars/${clickedUser.data.username}.jpg`}
          alt="profile"
        />
      </div>
      <div className="col-span-2 grid grid-rows-3 gap-3">
        <div className="flex gap-10 items-center">
          <h1 className="text-3xl font-light pb-1">
            {clickedUser.data.username}
          </h1>
          <button
            className={`bg-blue-500 text-white font-semibold px-6 py-1 rounded text-sm ${
              loggedinUserId === clickedUser.id ? "hidden" : ""
            }`}
            onClick={() => handleClick()}
          >
            {follow ? "Unfollow" : "Follow"}
          </button>
        </div>

        <div className="flex gap-10 pt-1">
          <p>
            <span className="font-semibold">{photos.length}</span> posts
          </p>
          <p>
            <span className="font-semibold">{countFollow}</span> followers
          </p>
          <p>
            <span className="font-semibold">
              {clickedUser.data.following.length}
            </span>{" "}
            following
          </p>
        </div>
        <p className="font-semibold ">{clickedUser.data.fullName}</p>
      </div>
    </div>
  ) : null;
}
