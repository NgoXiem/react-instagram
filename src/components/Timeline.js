import React, { useContext, useEffect, useState } from "react";
import { LoggedInUserContext } from "../App";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../lib/firebase";
import Skeleton from "react-loading-skeleton";
import SinglePost from "./post/SinglePost";

export default function Timeline() {
  const { following } = useContext(LoggedInUserContext);
  const [followedUsersDetails, setFollowedUsersDetails] = useState([]);
  const [postInfo, setPostInfo] = useState(null);
  let data = [];
  let posts = [];

  // query the posts based on the following list

  useEffect(() => {
    following && following.length > 0
      ? following.forEach((id) => {
          const getPhotosbyUserId = async (db) => {
            const q = query(
              collection(db, "photos"),
              where("userId", "==", id)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot;
          };
          getPhotosbyUserId(db)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                posts = [
                  ...posts,
                  {
                    id: doc.id,
                    data: doc.data(),
                  },
                ];
              });
              setPostInfo(posts);
            })
            .catch((error) => console.log(error));
        })
      : setPostInfo([]);
  }, [following]);

  // query the followed user details by id
  useEffect(() => {
    following &&
      following.forEach((id) => {
        const getUserbyUserId = async (db) => {
          const q = query(collection(db, "users"), where("userId", "==", id));
          const querySnapshot = await getDocs(q);
          return querySnapshot;
        };
        return getUserbyUserId(db)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              data = [
                ...data,
                {
                  userId: doc.data().userId,
                  username: doc.data().username,
                },
              ];
            });
            setFollowedUsersDetails(data);
          })
          .catch((error) => console.log(error));
      });
  }, [following]);
  // filter username based on userId
  const getUsername = (arr, id) => {
    const filteredArr = arr.filter((item) => item.userId === id);
    return filteredArr;
  };
  return (
    <div>
      {
        !postInfo ? (
          <Skeleton count={1} height={400}></Skeleton>
        ) : postInfo.length > 0 ? (
          <div className="flex flex-col gap-8 ">
            {postInfo.map((post) => (
              <div
                key={post.id}
                className="border flex flex-col gap-3 bg-white pt-5 rounded "
              >
                <SinglePost
                  post={post}
                  users={followedUsersDetails}
                  userId={post.data.userId}
                  getUsername={getUsername}
                ></SinglePost>
              </div>
            ))}
          </div>
        ) : null
        // <div className="font-semibold text-lg text-center h-screen">
        //   You haven't followed anyone yet!
        // </div>
      }
    </div>
  );
}
