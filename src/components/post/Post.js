import React from "react";
import { Link } from "react-router-dom";
import { formatDistance, subDays } from "date-fns";
import Buttons from "./Buttons";
export default function Post({ posts, followed }) {
  // find the username based on the useId in photo data
  const followedUser = (userId) => {
    const [{ id, data }] = followed.filter(
      (item) => item.data.userId === userId
    );
    return data;
  };

  return (
    <div className="flex flex-col gap-8 ">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border flex flex-col gap-3 bg-white pt-5 rounded "
        >
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
            likes={post.data.likes.length}
            username={followedUser(post.data.userId).username}
          ></Buttons>
          <div>
            <div className="flex gap-3 pl-5">
              <p className="font-bold">
                {followedUser(post.data.userId).username}
              </p>
              <p>{post.data.caption}</p>
            </div>
            {post.data.comments.map((item, index) => (
              <div key={index} className="flex gap-3 pl-5">
                <p className="font-bold">{item.displayName}</p>
                <p>{item.comment}</p>
              </div>
            ))}
          </div>
          <div className="uppercase pl-5 text-xs text-gray-base">
            {formatDistance(new Date(post.data.dateCreated), new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
