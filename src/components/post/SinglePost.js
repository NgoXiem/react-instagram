import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Buttons from "./Buttons";
import Comments from "./Comments";
import Skeleton from "react-loading-skeleton";

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
      {!followed ? (
        <Skeleton count={1} height={400}></Skeleton>
      ) : followed.length > 0 ? (
        <>
          <div className="flex gap-3 items-center pl-5 pb-1">
            <img
              className="w-8 h-8 rounded-full object-cover"
              alt="profile"
              src={`images/avatars/${
                followedUser(post.data.userId).username
              }.jpg`}
            />
            <Link to={`/profile/${post.data.userId}`}>
              <span className="font-bold">
                {followedUser(post.data.userId).username}
              </span>
            </Link>
          </div>
          <div>
            <img
              className="w-full h-full object-cover"
              src={post.data.imageSrc}
              alt={post.data.caption}
              onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
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
      ) : null}
    </>
  );
}
