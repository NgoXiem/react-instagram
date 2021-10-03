import React, { useState, useContext } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import db from "../../lib/firebase";
import { LoggedInUserContext } from "../../App";

export default function Form({
  inputRef,
  photoId,
  allComments,
  setAllComments,
}) {
  const [comment, setComment] = useState("");
  const loggedinUser = useContext(LoggedInUserContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    setAllComments([
      ...allComments,
      { displayName: loggedinUser.username, comment: comment },
    ]);
    const commentPost = async () => {
      const photoRef = doc(db, "photos", photoId);
      await updateDoc(photoRef, {
        comments: arrayUnion({
          comment: comment,
          displayName: loggedinUser.username,
        }),
      });
    };
    commentPost();
    setComment("");
  };
  return (
    <div className="border-t py-4 px-4">
      <form className="flex justify-between" onSubmit={(e) => handleSubmit(e)}>
        <input
          className="w-full h-full outline-none opacity-40 focus:opacity-100"
          type="text"
          placeholder="Add a comment..."
          ref={inputRef}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <button
          type="submit"
          disabled={comment.length < 1}
          className={`font-semibold text-blue-500 ${
            comment.length > 0 ? "opacity-100" : "opacity-40"
          }`}
        >
          Post
        </button>
      </form>
    </div>
  );
}
