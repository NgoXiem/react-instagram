import React from "react";
import Skeleton from "react-loading-skeleton";
export default function ProfilePhoto({ photos }) {
  return (
    <div className="my-10">
      {!photos ? (
        <Skeleton count={1} height={500}></Skeleton>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-5">
          {photos.map((photo) => (
            <div className="relative" key={photo.id}>
              <img
                className="w-full h-full object-cover"
                src={photo.data.imageSrc}
                alt="post"
              />
              <div className="opacity-0 flex absolute top-0 flex-row items-center justify-center gap-6 bg-gray-600 bg-opacity-25 w-full h-full hover:opacity-100">
                <div className="flex text-white font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 fill-current text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{photo.data.comments.length}</span>
                </div>
                <div className="flex text-white font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 fill-current text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{photo.data.likes.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No post yet!</div>
      )}
    </div>
  );
}
