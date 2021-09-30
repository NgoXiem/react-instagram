import React from "react";
import User from "./User";
import Suggestion from "./Suggestion";

export default function Sidebar() {
  return (
    <div>
      <User>User Info</User>
      <Suggestion>Suggestion for you</Suggestion>
    </div>
  );
}
