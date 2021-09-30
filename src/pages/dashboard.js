import React from "react";
import Header from "../components/Header";
import Timeline from "../components/Timeline";
import Sidebar from "../components/sidebar/Sidebar";

export default function Dashboard() {
  return (
    <div>
      <Header></Header>
      <div className="max-w-screen-lg grid grid-cols-3 items-center justify-between mx-auto mt-10 gap-10">
        <div className="col-span-2 border">
          <Timeline></Timeline>
        </div>
        <div className="col-span-1">
          <Sidebar></Sidebar>
        </div>
      </div>
    </div>
  );
}
