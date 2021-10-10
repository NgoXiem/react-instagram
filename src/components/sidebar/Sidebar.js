import React from "react";
import User from "./User";
import Suggestion from "./Suggestion";

export default function Sidebar() {
  return (
    <div className="grid fixed grid-cols-1 gap-6 mobiles:hidden">
      <User>User Info</User>
      <Suggestion>Suggestion for you</Suggestion>
    </div>
  );
}
