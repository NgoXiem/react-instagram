import React from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

export default function PostHeader({ user, imageUrl }) {
  return (
    <>
      {!user ? (
        <Skeleton count={1}></Skeleton>
      ) : (
        <div className="flex gap-3 items-center pl-5 pb-1">
          <img
            className="w-8 h-8 rounded-full object-cover"
            alt="profile"
            src={imageUrl ? imageUrl : `/images/avatars/${user.username}.jpg`}
            onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
          />
          <Link to={`/profile/${user.userId}`}>
            <span className="font-bold mobiles:text-xs">{user.username}</span>
          </Link>
        </div>
      )}
    </>
  );
}
