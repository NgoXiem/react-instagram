import React from "react";
import Skeleton from "react-loading-skeleton";
export default function ProfilePhoto({ photos }) {
  return (
    <div className="my-10">
      {!photos ? (
        <Skeleton count={1} height={100}></Skeleton>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-5">
          {photos.map((photo) => (
            <img
              key={photo.id}
              className="w-full h-full object-cover"
              src={photo.data.imageSrc}
              alt="post"
            />
          ))}
        </div>
      ) : (
        <div className="text-center">No post yet!</div>
      )}
    </div>
  );
}
