import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import db from "../../lib/firebase";
export default function SuggestedProfile({ userId, profile }) {
  const [followed, setFollowed] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  // /////// For clicked user profile: find avatar in the collection
  useEffect(() => {
    const getAvatarbyId = async () => {
      const docRef = doc(db, "avatars", profile.data.userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setImageUrl(docSnap.data().imageSrc);
      }
    };
    profile.data.userId && getAvatarbyId();
  }, [profile.data.userId]);
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
        followers: arrayUnion(userId),
      });
    };
    updateFollowing(db);
    updateFollowed(db);
  };
  return (
    <div className="grid grid-cols-3 gap-6 justify-between items-center">
      <div className="flex gap-2 col-span-1 items-center">
        <img
          src={
            imageUrl ? imageUrl : `/images/avatars/${profile.data.username}.jpg`
          }
          alt="profile"
          className="rounded-full w-8 h-8 object-cover"
          onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
        />
        <Link to={`/profile/${profile.data.userId}`}>
          <p className="font-semibold text-sm text-gray-base">
            {profile.data.username}
          </p>
        </Link>
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
