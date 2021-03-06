import React, { useState, useContext } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import db from "../../lib/firebase";
import { UserContext } from "../../App";

export default function NewPost() {
  const user = useContext(UserContext);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const isInvalid = caption === "" || image === null;

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = (e) => {
    e.preventDefault();
    const storage = getStorage();
    const postRef = ref(storage, `images/${image.name}`);
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
        setCaption("");
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Add a new document in collection "photos"
          const addNewPhoto = async () => {
            await addDoc(collection(db, "photos"), {
              caption: caption,
              imageSrc: downloadURL,
              userId: user.uid,
              dateCreated: Date.now(),
              photoId: Date.now(),
              comments: [],
              likes: [],
            });
          };
          addNewPhoto().then(() => {
            window.location.reload();
          });
        });
      }
    );
  };
  return (
    <div>
      <form
        onSubmit={(e) => handleUpload(e)}
        className="flex flex-col gap-5 border px-3 py-3"
      >
        <input
          type="text"
          placeholder="Enter your caption..."
          onChange={(e) => setCaption(e.target.value)}
          value={caption}
          className="focus: outline-none px-2 py-3 bg-gray-background mobiles:text-xs"
        />
        <input
          type="file"
          onChange={(e) => handleChange(e)}
          className="text-sm mobiles:text-xs"
        />
        {error && <p>{error}</p>}
        <button
          type="submit"
          disabled={isInvalid}
          className={`bg-blue-500 text-white text-sm rounded px-5 py-1 font-medium w-min ${
            isInvalid ? "opacity-50" : ""
          }`}
        >
          Post
        </button>
      </form>
    </div>
  );
}
