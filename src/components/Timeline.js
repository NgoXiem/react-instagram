import React, { useContext, useEffect, useState } from "react";
import { LoggedInUserContext } from "../pages/dashboard";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../lib/firebase";
import Skeleton from "react-loading-skeleton";
import Post from "./post/Post";

export default function Timeline() {
  const { following } = useContext(LoggedInUserContext);
  const [followed, setFollowed] = useState(null);
  const [postInfo, setPostInfo] = useState(null);
  // query the followed user by id
  let data = [];
  let posts = [];
  useEffect(() => {
    following &&
      following.map((id) => {
        const getUserbyUserId = async (db) => {
          const q = query(collection(db, "users"), where("userId", "==", id));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            data = [
              ...data,
              {
                id: doc.id,
                data: doc.data(),
              },
            ];
          });
          setFollowed(data);
        };
        following && getUserbyUserId(db);
      });
  }, [following]);

  // query the photos of the followed users
  useEffect(() => {
    followed &&
      followed.map((item) => {
        const getPhotosbyUserId = async (db) => {
          const q = query(
            collection(db, "photos"),
            where("userId", "==", item.data.userId)
          );
          const querySnapshot = await getDocs(q);
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
        };
        followed && getPhotosbyUserId(db);
      });
  }, [followed]);

  return (
    <div>
      {!postInfo ? (
        <Skeleton count={1} height={100}></Skeleton>
      ) : postInfo.length > 0 ? (
        <Post posts={postInfo} followed={followed}></Post>
      ) : null}
    </div>
  );
}
