import React from "react";
import User from "./User";
import Suggestion from "./Suggestion";

export default function Sidebar() {
  return (
    <div className="grid grid-cols-1 gap-6 fixed">
      <User>User Info</User>
      <Suggestion>Suggestion for you</Suggestion>
    </div>
  );
}
