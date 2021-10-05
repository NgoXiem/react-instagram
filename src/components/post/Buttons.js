import React, { useState, useContext, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import db from "../../lib/firebase";
import { LoggedInUserContext } from "../../App";

export default function Buttons({ photoId, likes, handleClickMesssge }) {
  const [liked, setLiked] = useState(false);
  const [countLike, setCountLike] = useState(likes.length);
  const loggedinUser = useContext(LoggedInUserContext);

  useEffect(() => {
    const isLiked = async () => {
      const docRef = doc(db, "photos", photoId);
      const docSnap = await getDoc(docRef);
      return docSnap.data().likes;
    };
    isLiked().then((data) => setLiked(data.includes(loggedinUser.userId)));
  }, [photoId, loggedinUser.userId]);

  const handleClickHeart = () => {
    // update and remove liked status
    const likePost = async () => {
      const followingRef = doc(db, "photos", photoId);
      const updateDoc = await updateDoc(followingRef, {
        likes: arrayUnion(loggedinUser.userId),
      });
      updateDoc()
        .then(() => setLiked(true))
        .catch((error) => console.log(error));
    };
    const unlikePost = async () => {
      const followingRef = doc(db, "photos", photoId);
      await updateDoc(followingRef, {
        likes: arrayRemove(loggedinUser.userId),
      });
      updateDoc()
        .then(() => setLiked(false))
        .catch((error) => console.log(error));
    };
    if (liked) {
      setCountLike(countLike - 1);
      unlikePost();
    } else {
      likePost();
      setCountLike(countLike + 1);
    }
  };
  return (
    <>
      <div className="flex gap-3 pl-5">
        <button onClick={() => handleClickHeart()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${liked ? "fill-current text-red-500" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <button onClick={() => handleClickMesssge()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
      <div className="font-bold pl-5">{countLike} likes</div>
    </>
  );
}
