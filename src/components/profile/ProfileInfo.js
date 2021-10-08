import React, { useState, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { LoggedInUserContext } from "../../App";
import db from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref,
  deleteObject,
} from "@firebase/storage";

export default function ProfileInfo({ clickedUser, photos }) {
  const [follow, setFollow] = useState(null);
  const [countFollow, setCountFollow] = useState(null);
  const [avatar, setAvatar] = useState({});
  const [image, setImage] = useState({});
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const { userId } = useContext(LoggedInUserContext);

  // get initial number of following and followers
  useEffect(() => {
    if (clickedUser) {
      setFollow(clickedUser.data.followers.includes(userId));
      setCountFollow(clickedUser.data.followers.length);
    }
  }, [clickedUser, userId]);
  // toggle follow button
  const handleClick = () => {
    const followUser = async () => {
      const followRef = doc(db, "users", clickedUser.id);
      await updateDoc(followRef, {
        followers: arrayUnion(userId),
      });
      setFollow(true);
    };
    const unfollowUser = async () => {
      const unfollowRef = doc(db, "users", clickedUser.id);
      await updateDoc(unfollowRef, {
        followers: arrayRemove(userId),
      });
      setFollow(false);
    };
    const addFollowing = async () => {
      const update = doc(db, "users", userId);
      await updateDoc(update, {
        following: arrayUnion(clickedUser.data.userId),
      });
    };
    const removeFollowing = async () => {
      const update = doc(db, "users", userId);
      await updateDoc(update, {
        following: arrayRemove(clickedUser.data.userId),
      });
    };
    if (follow) {
      unfollowUser();
      setCountFollow(countFollow - 1);
      removeFollowing();
    } else {
      followUser();
      setCountFollow(countFollow + 1);
      addFollowing();
    }
  };
  ////////// interact with Firebase Storage to handle upload
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please choose file!");
    } else {
      const storage = getStorage();
      //////// Delete the old avatar in cloud storage and update avatar info in firestore
      //delete in storage
      // if (avatar) {
      //   const deleteRef = ref(storage, `avatars/${avatar.oldAvatar}`);
      //   deleteObject(deleteRef)
      //     .then(() => {
      //       console.log("deleted avatar");
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      //   // delete in firestore
      //   const deleteAvatar = async () => {
      //     await deleteDoc(doc(db, "avatars", avatar.id));
      //   };
      //   deleteAvatar();
      // }

      ////////// Upload new avatar to cloud storage
      const postRef = ref(storage, `avatars/${image.name}`);
      const metadata = {
        contentType: "image/jpeg",
      };
      const uploadTask = uploadBytesResumable(postRef, image, metadata);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const taskProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(taskProgress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setError(error.message);
          setProgress(null);
          setImage(null);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // update avatar info to the "avatars" collection in firestore
            const addNewAvatar = async () => {
              await addDoc(collection(db, "avatars"), {
                imageSrc: downloadURL,
                userId: userId,
                imagePath: image.name,
              });
            };
            addNewAvatar();
          });
        }
      );
    }
  };
  // get avatar based on userId
  useEffect(() => {
    const getAvatar = async () => {
      const q = query(collection(db, "avatars"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setAvatar({
          id: doc.id,
          imageSrc: doc.data().imageSrc,
          imagePath: doc.data().imagePath,
        });
      });
    };
    userId && getAvatar();
  }, [userId]);
  return !photos ? (
    <Skeleton count={1} height={150}></Skeleton>
  ) : photos ? (
    <div className="grid grid-cols-3 justify-center items-center py-10 border-b w-full">
      <div className="col-span-1 flex justify-center items-center">
        {userId === clickedUser.id ? (
          <img
            className="rounded-full w-36 h-36 object-cover"
            src={avatar ? avatar.imageSrc : `/images/avatars/default.jpg`}
            alt="profile"
            onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
          ></img>
        ) : (
          <img
            className="rounded-full w-36 h-36 object-cover"
            src={`/images/avatars/${clickedUser.data.username}.jpg`}
            alt="profile"
            onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
          ></img>
        )}
      </div>
      <div className="col-span-2 grid grid-rows-3 gap-3">
        <div className="flex gap-10 items-center">
          <h1 className="text-3xl font-light pb-1">
            {clickedUser.data.username}
          </h1>
          <button
            className={`bg-blue-500 text-white font-semibold px-6 py-1 rounded text-sm ${
              userId === clickedUser.id ? "hidden" : ""
            }`}
            onClick={() => handleClick()}
          >
            {follow ? "Unfollow" : "Follow"}
          </button>
        </div>
        <div className="flex gap-10 pt-1">
          <p>
            <span className="font-semibold">{photos.length}</span> posts
          </p>
          <p>
            <span className="font-semibold">{countFollow}</span> followers
          </p>
          <p>
            <span className="font-semibold">
              {clickedUser.data.following.length}
            </span>{" "}
            following
          </p>
        </div>
        <p className="font-semibold ">{clickedUser.data.fullName}</p>
      </div>
      {userId === clickedUser.id && (
        <>
          <form
            onSubmit={(e) => handleUpload(e)}
            className="flex flex-col gap-2 text-sm justify-center items-center mt-2"
          >
            <input type="file" onChange={(e) => handleChange(e)}></input>
            <button
              type="submit"
              className="bg-blue-500 rounded w-max px-3 py-1 mt-2 text-white font-semibold"
            >
              Update avatar
            </button>
          </form>
          {error && <p>{error}</p>}
        </>
      )}
    </div>
  ) : null;
}
