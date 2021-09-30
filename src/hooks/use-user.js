import React, { useEffect, useState } from "react";
import { getUserbyId } from "../services/firebase";
export default function UseUser(id) {
  const [data, setData] = useState({});
  useEffect(() => {
    getUserbyId(id);
    setData(data);
  }, [id]);
}
