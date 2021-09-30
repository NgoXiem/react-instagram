import React from "react";
import db from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function getUserbyId(id) {
  const getUser = async (db) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };
  id &&
    getUser(db).then((data) => {
      if (data) {
        return data;
      } else {
        console.log("No such document!");
      }
    });
  getUser(db);
}
