import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Buttons from "./Buttons";
import Comments from "./Comments";
import Skeleton from "react-loading-skeleton";
import PostHeader from "./Header";
export default function SinglePost({ post, followed }) {
  const inputRef = useRef(null);
  const handleClickMesssge = () => {
    inputRef.current.focus();
  };
  // find the username based on the useId in photo data
  const followedUser = (userId) => {
    if (followed) {
      const [{ id, data }] = followed.filter(
        (item) => item.data.userId === userId
      );
      return data;
    }
  };

  return (
    <>
      {!followed ? (
        <Skeleton count={1} height={400}></Skeleton>
      ) : followed.length > 0 ? (
        <>
          <PostHeader
            username={followedUser(post.data.userId).username}
            userId={post.data.userId}
          ></PostHeader>
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
