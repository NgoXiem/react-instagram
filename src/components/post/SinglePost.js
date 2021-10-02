import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Buttons from "./Buttons";
import Comments from "./Comments";

export default function SinglePost({ post, followed }) {
  const inputRef = useRef(null);
  const handleClickMesssge = () => {
    inputRef.current.focus();
  };
  // find the username based on the useId in photo data
  const followedUser = (userId) => {
    const [{ id, data }] = followed.filter(
      (item) => item.data.userId === userId
    );
    return data;
  };

  return (
    <>
      <div className="flex gap-3 items-center pl-5 pb-1">
        <Link to={`/profile:${post.data.userId}`}>
          <img
            className="w-8 h-8 rounded-full object-cover"
            alt="profile"
            src={`images/avatars/${
              followedUser(post.data.userId).username
            }.jpg`}
          />
        </Link>
        <span className="font-bold">
          {followedUser(post.data.userId).username}
        </span>
      </div>
      <div>
        <img
          className="w-full h-full object-cover"
          src={post.data.imageSrc}
          alt={post.data.caption}
        />
      </div>
      <Buttons
        photoId={post.id}
        userId={post.data.userId}
        likes={post.data.likes}
        handleClickMesssge={handleClickMesssge}
      ></Buttons>
      <Comments
        photoId={post.id}
        userId={post.data.userId}
        username={followedUser(post.data.userId).username}
        inputRef={inputRef}
        comments={post.data.comments}
        caption={post.data.caption}
        dateCreated={post.data.dateCreated}
      ></Comments>
    </>
  );
}
