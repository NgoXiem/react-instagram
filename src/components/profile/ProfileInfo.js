import React, { useState, useContext, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { LoggedInUserContext } from "../../App";
import db from "../../lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  getDoc,
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
  const [image, setImage] = useState();
  const [error, setError] = useState(null);
  const { userId } = useContext(LoggedInUserContext);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [clickedAvatarUrl, setClickedAvatarUrl] = useState(null);
  const imageRef = useRef();

  useEffect(() => {
    imageRef.current = avatar.imagePath;
  }, [avatar]);

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
      /////////// Delete old avatar in cloud storage
      const oldAvatarRef = ref(storage, `avatars/${imageRef.current}`);
      imageRef.current &&
        deleteObject(oldAvatarRef)
          .then(() => {
            console.log("deleted successfully");
          })
          .catch((error) => {
            console.log(error);
          });
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
          setImage(null);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDownloadUrl(downloadURL);
            // update avatar info to the "avatars" collection in firestore
            const updateNewAvatar = async () => {
              const docRef = doc(db, "avatars", userId);
              await updateDoc(docRef, {
                imageSrc: downloadURL,
                userId: userId,
                imagePath: image.name,
              });
            };
            updateNewAvatar();
          });
        }
      );
    }
  };
  ///// Get avatar based on avatar Id
  useEffect(() => {
    const getAvatarbyId = async () => {
      const docRef = doc(db, "avatars", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAvatar(docSnap.data());
      } else {
        // if there is no data for avatar before, create an avatar document in firestore
        const addNewDoc = async () => {
          await setDoc(doc(db, "avatars", userId), {
            id: userId,
          });
        };
        userId && addNewDoc();
      }
    };
    userId && getAvatarbyId();
  }, [userId, downloadUrl]);

  return !photos ? (
    <Skeleton count={1} height={150}></Skeleton>
  ) : photos ? (
    <div className="grid grid-cols-3 justify-center items-center py-10 border-b w-full mobiles:grid-cols-2 mobiles:py-8">
      <div className="col-span-1 flex justify-center items-center">
        {userId === clickedUser.id ? (
          <img
            className="rounded-full w-36 h-36 object-cover mobiles:w-24 mobiles:h-24"
            src={
              avatar.imageSrc ? avatar.imageSrc : "/images/avatars/default.jpg"
            }
            alt="profile"
            onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
          ></img>
        ) : (
          <img
            className="rounded-full w-36 h-36 object-cover mobiles:w-24 mobiles:h-24"
            src={
              clickedAvatarUrl
                ? clickedAvatarUrl
                : `/images/avatars/${clickedUser.data.username}.jpg`
            }
            alt="profile"
            onError={(e) => (e.target.src = "/images/avatars/default.jpg")}
          ></img>
        )}
      </div>
      <div className="col-span-2 grid grid-rows-3 gap-3 mobiles:col-span-1">
        <div className="flex gap-10 items-center mobiles:gap-3">
          <h1 className="text-3xl font-light pb-1 mobiles:text-xl">
            {clickedUser.data.username}
          </h1>
          <button
            className={`bg-blue-500 text-white font-semibold px-6 py-1 mobiles:px-3 rounded text-sm ${
              userId === clickedUser.id ? "hidden" : ""
            }`}
            onClick={() => handleClick()}
          >
            {follow ? "Unfollow" : "Follow"}
          </button>
        </div>
        <div className="flex gap-10 pt-1 mobiles:gap-2 mobiles:text-sm mobiles:pt-0 mobiles:flex-wrap">
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
        <p className="font-semibold mobiles:text-md">
          {clickedUser.data.fullName}
        </p>
      </div>
      {userId === clickedUser.id && (
        <>
          <form
            onSubmit={(e) => handleUpload(e)}
            className="flex flex-col gap-2 text-sm justify-center items-center mt-2 mobiles:col-span-2"
          >
            <input
              type="file"
              onChange={(e) => handleChange(e)}
              className=""
            ></input>
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
