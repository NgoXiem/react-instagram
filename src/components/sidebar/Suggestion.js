import React, { useEffect, useState, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import db from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { LoggedInUserContext } from "../../pages/dashboard";
import { Link } from "react-router-dom";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default function Suggestion() {
  const { following, userId } = useContext(LoggedInUserContext);
  const [profiles, setProfiles] = useState();
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    let data = [];
    const getSuggestedProfiles = async (db) => {
      const q = query(
        collection(db, "users"),
        where("userId", "not-in", [...following, userId])
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data = [
          ...data,
          {
            id: doc.id,
            data: doc.data(),
          },
        ];
        setProfiles(data);
      });
    };
    userId && getSuggestedProfiles(db);
  }, [userId]);

  // Atomically add a new following to the "following" array field.
  const handleClick = () => {
    const updateFollowing = async (db) => {
      const followingRef = doc(db, "users", userId);
      await updateDoc(followingRef, {
        following: arrayUnion(""),
      });
    };
    updateFollowing(db);
    setFollowed(true);
  };
  return (
    <div>
      <p className="font-bold text-gray-500 mb-5">Suggestions for you</p>
      <div className="grid grid-cols-1 gap-5">
        {profiles ? (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className="grid grid-cols-3 gap-6 justify-between items-center"
            >
              <div className="flex gap-2 col-span-1 items-center">
                <Link to={`/profiles:${profile.data.userId}`}>
                  <img
                    src={`/images/avatars/${profile.data.username}.jpg`}
                    alt="profile"
                    className="rounded-full w-8 h-8 object-cover"
                  />
                </Link>
                <p className="font-semibold">{profile.data.username}</p>
              </div>
              <div className="col-span-2">
                <button
                  className="text-sm font-semibold text-blue-500"
                  onClick={() => handleClick()}
                >
                  Follow
                </button>
              </div>
            </div>
          ))
        ) : (
          <Skeleton count={3} height={20}></Skeleton>
        )}
      </div>
    </div>
  );
}
