import React, { useState } from "react";
import Form from "./Form";
import { formatDistance } from "date-fns";
import Skeleton from "react-loading-skeleton";
export default function Comments({
  user,
  comments,
  dateCreated,
  inputRef,
  caption,
  photoId,
}) {
  const [allComments, setAllComments] = useState(comments);
  return (
    <>
      {!user ? (
        <Skeleton count={3}></Skeleton>
      ) : (
        <>
          <div>
            <div className="flex gap-3 pl-5">
              <p className="font-bold">{user.username}</p>
              <p>{caption}</p>
            </div>
            {allComments.map((item, index) => (
              <div key={index} className="flex gap-3 pl-5">
                <p className="font-bold">{item.displayName}</p>
                <p>{item.comment}</p>
              </div>
            ))}
          </div>
          <div className="uppercase pl-5 text-xs text-gray-base">
            {formatDistance(new Date(dateCreated), new Date(), {
              addSuffix: true,
            })}
          </div>
          <Form
            inputRef={inputRef}
            photoId={photoId}
            allComments={allComments}
            setAllComments={setAllComments}
          ></Form>
        </>
      )}
    </>
  );
}
