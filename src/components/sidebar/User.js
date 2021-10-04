import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { LoggedInUserContext } from "../../App";

export default function User() {
  const loggedinUser = useContext(LoggedInUserContext);
  return loggedinUser.userId ? (
    <div className="grid grid-cols-3 items-center">
      <img
        className="rounded-full w-16 h-16 object-cover col-span-1"
        src={`images/avatars/${loggedinUser.username}.jpg`}
        alt="profile"
        onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
      />
      <div className="col-span-2">
        <Link to={`/profile/${loggedinUser.userId}`}>
          <p className="font-semibold">{loggedinUser.username}</p>
        </Link>
        <p className="text-gray-base">{loggedinUser.fullName}</p>
      </div>
    </div>
  ) : (
    <Skeleton count={1} height={40}></Skeleton>
  );
}
