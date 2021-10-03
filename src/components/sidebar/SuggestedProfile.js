import React, { useState } from "react";
import { Link } from "react-router-dom";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import db from "../../lib/firebase";
export default function SuggestedProfile({ userId, profile }) {
  const [followed, setFollowed] = useState(false);
  const handleClick = (docId, profileUserId) => {
    setFollowed(true);
    // Atomically add a new following to the "following" array field.
    const updateFollowing = async (db) => {
      const followingRef = doc(db, "users", userId);
      await updateDoc(followingRef, {
        following: arrayUnion(profileUserId),
      });
    };
    // Atomically add a new followed to the "followed" array field.
    const updateFollowed = async (db) => {
      const followedRef = doc(db, "users", docId);
      await updateDoc(followedRef, {
        following: arrayUnion(userId),
      });
    };
    updateFollowing(db);
    updateFollowed(db);
  };
  return (
    <div className="grid grid-cols-3 gap-6 justify-between items-center">
      <div className="flex gap-2 col-span-1 items-center">
        <Link to={`/profile/${profile.data.userId}`}>
          <img
            src={`/images/avatars/${profile.data.username}.jpg`}
            alt="profile"
            className="rounded-full w-8 h-8 object-cover"
          />
        </Link>
        <p className="font-semibold text-sm text-gray-base">
          {profile.data.username}
        </p>
      </div>
      <div className="col-span-2">
        <button
          className={
            followed
              ? "text-xs font-bold text-gray-base"
              : "text-xs font-bold text-blue-400"
          }
          onClick={() => handleClick(profile.id, profile.data.userId)}
        >
          {followed ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}
