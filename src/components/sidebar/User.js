import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { LoggedInUserContext } from "../../pages/dashboard";

export default function User() {
  const loggedinUser = useContext(LoggedInUserContext);
  return loggedinUser.userId ? (
    <div className="grid grid-cols-3 items-center">
      <Link to={`/profile:${loggedinUser.userId}`}>
        <img
          className="rounded-full w-16 h-16 object-cover col-span-1"
          src={
            loggedinUser
              ? `images/avatars/${loggedinUser.username}.jpg`
              : `images/avatars/default.jpg`
          }
          alt="profile"
        />
      </Link>
      <div className="col-span-2">
        <p className="font-semibold">{loggedinUser.username}</p>
        <p className="text-gray-base">{loggedinUser.fullName}</p>
      </div>
    </div>
  ) : (
    <Skeleton count={1} height={40}></Skeleton>
  );
}
