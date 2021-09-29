import { collection, addDoc } from "firebase/firestore";
// import db from "./lib/firebase";

export function seedDatabase(db) {
  const users = [
    {
      userId: "1",
      username: "thomas",
      fullName: "Thomas Sowell",
      emailAddress: "thomas@sowell.com",
      following: [],
      followers: ["qt2DLK9zHKQajl3s18dYQQLgzfs1"],
      dateCreated: Date.now(),
    },
    {
      userId: "2",
      username: "vincent",
      fullName: "Vincent Van Gogh",
      emailAddress: "vincent@vangogh.com",
      following: [],
      followers: ["qt2DLK9zHKQajl3s18dYQQLgzfs1"],
      dateCreated: Date.now(),
    },
    {
      userId: "3",
      username: "jordan",
      fullName: "Jordan B Peterson",
      emailAddress: "jordan@peterson.com",
      following: [],
      followers: ["qt2DLK9zHKQajl3s18dYQQLgzfs1"],
      dateCreated: Date.now(),
    },
    {
      userId: "4",
      username: "orwell",
      fullName: "George Orwell",
      emailAddress: "george@orwell.com",
      following: [],
      followers: ["qt2DLK9zHKQajl3s18dYQQLgzfs1"],
      dateCreated: Date.now(),
    },
  ];

  for (let k = 0; k < users.length; k++) {
    const addUsers = async (db) => {
      const docRef = await addDoc(collection(db, "users"), users[k]);
    };
    addUsers(db);
  }

  // Add a new document with a generated id.

  for (let i = 1; i <= 5; ++i) {
    const addPhotos = async (db) => {
      const docRef = await addDoc(collection(db, "photos"), {
        photoId: i,
        userId: "2",
        imageSrc: `/images/users/vincent/${i}.jpg`,
        caption: "Meet my new masterpiece!",
        likes: [],
        comments: [
          {
            displayName: "orwell",
            comment: "Love this place, looks like my animal farm!",
          },
          {
            displayName: "jordan",
            comment: "Would you mind if I used this picture?",
          },
        ],
        userLatitude: "40.7128°",
        userLongitude: "74.0060°",
        dateCreated: Date.now(),
      });
    };
    addPhotos(db);
  }
}
