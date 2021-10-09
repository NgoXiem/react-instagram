import React, { useRef } from "react";
import Buttons from "./Buttons";
import Comments from "./Comments";
import Skeleton from "react-loading-skeleton";
import PostHeader from "./PostHeader";

export default function SinglePost({ post, users, userId, getUsername }) {
  const inputRef = useRef(null);
  const handleClickMesssge = () => {
    inputRef.current.focus();
  };
  const [user] = getUsername(users, userId);

  return (
    <>
      {!post ? (
        <Skeleton count={1} height={400}></Skeleton>
      ) : post ? (
        <>
          <PostHeader user={user} userId={post.data.userId}></PostHeader>
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
            user={user}
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
