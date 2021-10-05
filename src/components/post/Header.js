import React from "react";
import { Link } from "react-router-dom";

export default function PostHeader({ username, userId }) {
  return (
    <div className="flex gap-3 items-center pl-5 pb-1">
      <img
        className="w-8 h-8 rounded-full object-cover"
        alt="profile"
        src={`images/avatars/${username}.jpg`}
      />
      <Link to={`/profile/${userId}`}>
        <span className="font-bold">{username}</span>
      </Link>
    </div>
  );
}
