import React, { useContext, useEffect, useState } from "react";
import { LoggedInUserContext } from "../App";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import db from "../lib/firebase";
import Skeleton from "react-loading-skeleton";
import SinglePost from "./post/SinglePost";
import NewPost from "./post/NewPost";
export default function Timeline() {
  const { following, userId } = useContext(LoggedInUserContext);
  const [followedUsersDetails, setFollowedUsersDetails] = useState([]);
  const [postInfo, setPostInfo] = useState(null);
  const [list, setList] = useState(null);
  let data = [];
  let posts = [];
  // query the posts based on the following list
  useEffect(() => {
    following && setList([...following, userId]);
  }, [following]);

  useEffect(() => {
    list && list.length > 0
      ? list.forEach((id) => {
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
              posts.sort((a, b) => b.data.dateCreated - a.data.dateCreated);
              setPostInfo(posts);
            })
            .catch((error) => console.log(error));
        })
      : setPostInfo([]);
  }, [list]);

  // query the followed user details by id
  useEffect(() => {
    list &&
      list.forEach((id) => {
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
  }, [list]);

  // filter username based on userId
  const getUsername = (arr, id) => {
    const filteredArr = arr.filter((item) => item.userId === id);
    return filteredArr;
  };
  return (
    <div className="h-full flex flex-col gap-8">
      <NewPost></NewPost>
      {following && following.length === 0 ? (
        <div className=" text-center font-semibold h-screen">
          Follow others to see photos!
        </div>
      ) : !postInfo ? (
        <Skeleton count={3} height={300}></Skeleton>
      ) : postInfo.length > 0 ? (
        <div className="flex flex-col gap-8">
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
      ) : null}
    </div>
  );
}
