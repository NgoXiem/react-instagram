import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import ProfilePhoto from "../components/profile/ProfilePhoto";
import ProfileInfo from "../components/profile/ProfileInfo";
import { useParams } from "react-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../lib/firebase";
export default function Profile() {
  const { id } = useParams();
  const [clickedUser, setClickedUser] = useState(null);
  const [photos, setPhotos] = useState(null);
  let data = [];

  useEffect(() => {
    const getUserbyId = async () => {
      const q = query(collection(db, "users"), where("userId", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data = [...data, { id: doc.id, data: doc.data() }];
      });
      setClickedUser(data[0]);
    };
    getUserbyId();
  }, [id]);

  // get photo collections from database based on userId
  let posts = [];
  useEffect(() => {
    const getPhotosByUserId = async () => {
      const q = query(
        collection(db, "photos"),
        where("userId", "==", clickedUser.data.userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot;
    };
    clickedUser &&
      getPhotosByUserId()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            posts = [...posts, { id: doc.id, data: doc.data() }];
          });
          setPhotos(posts);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [clickedUser]);

  return (
    <div className="mt-24">
      <Header></Header>
      <div className="grid grid-cols-1 justify-between items-center max-w-screen-lg mx-auto">
        <ProfileInfo clickedUser={clickedUser} photos={photos}></ProfileInfo>
        <ProfilePhoto photos={photos}></ProfilePhoto>
      </div>
    </div>
  );
}
