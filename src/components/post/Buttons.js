import React, { useState, useRef } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import db from "../../lib/firebase";

export default function Buttons({ username, photoId, userId, likes }) {
  const [liked, setLiked] = useState(false);
  const [countLike, setCountLike] = useState(likes);
  const [comment, setComment] = useState("");
  const inputRef = useRef(null);

  const handleClickHeart = () => {
    setLiked((liked) => !liked);
    // update and remove liked status
    const likePost = async (db) => {
      const followingRef = doc(db, "photos", photoId);
      await updateDoc(followingRef, {
        likes: arrayUnion(userId),
      });
      setCountLike(countLike + 1);
    };
    const unlikePost = async (db) => {
      const followingRef = doc(db, "photos", photoId);
      await updateDoc(followingRef, {
        likes: arrayRemove(userId),
      });
      setCountLike(countLike - 1);
    };

    !liked ? likePost(db) : unlikePost(db);
  };
  const handleClickMesssge = () => {
    inputRef.current.focus();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("commented");
    const commentPost = async (db) => {
      const followingRef = doc(db, "photos", photoId);
      await updateDoc(followingRef, {
        comments: arrayUnion({
          comment: comment,
          displayName: username,
        }),
      });
      commentPost(db);
    };
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
      <div className="border-t py-4 px-4">
        <form
          className="flex justify-between"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            className="w-full h-full outline-none opacity-40 focus:opacity-100"
            type="text"
            placeholder="Add a comment..."
            ref={inputRef}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className={`font-semibold text-blue-500 ${
              comment.length > 0 ? "opacity-100" : "opacity-40"
            }`}
          >
            Post
          </button>
        </form>
      </div>
    </>
  );
}
