import { collection, addDoc } from "firebase/firestore";

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

  // // Add a new document with a generated id.

  const addPhoto6 = async (db) => {
    await addDoc(collection(db, "photos"), {
      photoId: 6,
      userId: "2",
      imageSrc: `/images/users/orwell/1.jpg`,
      caption:
        "Whatever goes upon two legs is an enemy. Whatever goes upon four legs, or has wings, is a friend.!",
      likes: [],
      comments: [
        {
          displayName: "vincent",
          comment:
            "Those loose categories are very dangerous. You actually can interprete them in many ways",
        },
        {
          displayName: "jordan",
          comment:
            "You've got it right, Vincent. We have to think carefully so that we're not going to be prey to all sorts of propaganda!",
        },
      ],
      userLatitude: "40.7128°",
      userLongitude: "74.0060°",
      dateCreated: Date.now(),
    });
  };
  addPhoto6(db);

  const addPhoto7 = async (db) => {
    await addDoc(collection(db, "photos"), {
      photoId: 7,
      userId: "2",
      imageSrc: `/images/users/orwell/2.jpg`,
      caption: "Big Brother is watching you!",
      likes: [],
      comments: [
        {
          displayName: "vincent",
          comment:
            "I think what I'm thinking right now will be considered some kind of thoughtcrime LOL",
        },
        {
          displayName: "jordan",
          comment:
            "That's definitely the worst form of Hell. Together we have to work to prevent that kind of adversity.",
        },
      ],
      userLatitude: "40.7128°",
      userLongitude: "74.0060°",
      dateCreated: Date.now(),
    });
  };
  addPhoto7(db);

  const addPhoto8 = async (db) => {
    await addDoc(collection(db, "photos"), {
      photoId: 8,
      userId: "2",
      imageSrc: `/images/users/orwell/3.jpg`,
      caption: "My new book, 1984!",
      likes: [],
      comments: [
        {
          displayName: "jordan",
          comment: "Love this book!",
        },
        {
          displayName: "vincent",
          comment: "Would you mind if I used this picture?",
        },
      ],
      userLatitude: "40.7128°",
      userLongitude: "74.0060°",
      dateCreated: Date.now(),
    });
  };
  addPhoto8(db);

  const addPhoto9 = async (db) => {
    await addDoc(collection(db, "photos"), {
      photoId: 6,
      userId: "2",
      imageSrc: `/images/users/jordan/1.jpg`,
      caption: "These are 12 rules that you'll need in your suffering life!",
      likes: [],
      comments: [
        {
          displayName: "orwell",
          comment: "Sure, dude",
        },
        {
          displayName: "vincent",
          comment:
            "My life would have been much less miserable if I had known it sooner?",
        },
      ],
      userLatitude: "40.7128°",
      userLongitude: "74.0060°",
      dateCreated: Date.now(),
    });
  };
  addPhoto9(db);
}
