import React, { useEffect, useState, useContext, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import db from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { LoggedInUserContext } from "../../App";
import SuggestedProfile from "./SuggestedProfile";

export default function Suggestion() {
  const { following, userId } = useContext(LoggedInUserContext);
  const [profiles, setProfiles] = useState(null);
  const isMounted = useRef(true);
  let data = [];
  // query data in firestore to get all the users I'm not following (using userId)
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    const getSuggestedProfiles = async (db) => {
      const q = query(
        collection(db, "users"),
        where("userId", "not-in", [...following, userId])
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    };
    userId &&
      getSuggestedProfiles(db)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            data = [
              ...data,
              {
                id: doc.id,
                data: doc.data(),
              },
            ];
          });
          isMounted && setProfiles(data);
        })
        .catch((error) => console.log(error));
  }, [userId]);

  return (
    <div>
      <p className="font-bold text-gray-base mb-5">Suggestions for you</p>
      <div className="grid grid-cols-1 gap-5">
        {!profiles ? (
          <Skeleton count={3} height={20}></Skeleton>
        ) : profiles.length > 0 ? (
          profiles.map((profile) => (
            <SuggestedProfile
              key={profile.id}
              userId={userId}
              profile={profile}
            ></SuggestedProfile>
          ))
        ) : null}
      </div>
    </div>
  );
}
