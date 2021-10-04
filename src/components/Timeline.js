import React, { useContext, useEffect, useState } from "react";
import { LoggedInUserContext } from "../App";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import db from "../lib/firebase";
import Skeleton from "react-loading-skeleton";
import SinglePost from "./post/SinglePost";

export default function Timeline() {
  const { following } = useContext(LoggedInUserContext);
  const [followed, setFollowed] = useState(null);
  const [postInfo, setPostInfo] = useState(null);
  let data = [];
  let posts = [];
  // useEffect(() => {
  //   following &&
  //     following.map((id) => {
  //       const getPhotosbyUserId = async () => {
  //         const q = query(collection(db, "photos"), where("userId", "==", id));
  //         const querySnapshot = await getDocs(q);
  //         querySnapshot.forEach((doc) => {
  //           posts = [
  //             ...posts,
  //             {
  //               id: doc.id,
  //               data: doc.data(),
  //             },
  //           ];
  //         });
  //         setPostInfo(posts);
  //       };
  //       following && getPhotosbyUserId();
  //     });
  // }, [following]);
  // console.log(posts);

  // query the followed user by id
  useEffect(() => {
    following &&
      following.forEach((id) => {
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

  // query the posts of the followed users
  useEffect(() => {
    followed &&
      followed.forEach((item) => {
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
        <Skeleton count={1} height={400}></Skeleton>
      ) : postInfo.length > 0 ? (
        <div className="flex flex-col gap-8 ">
          {postInfo.map((post) => (
            <div
              key={post.id}
              className="border flex flex-col gap-3 bg-white pt-5 rounded "
            >
              <SinglePost post={post} followed={followed}></SinglePost>
            </div>
          ))}
        </div>
      ) : (
        <div>You haven't followed anyone yet!</div>
      )}
    </div>
  );
}
