import React from "react";
import Header from "../components/Header";
import Timeline from "../components/Timeline";
import Sidebar from "../components/sidebar/Sidebar";

export default function Dashboard() {
  return (
    <div className="bg-gray-background w-full h-full pt-16">
      <Header></Header>
      <div className="max-w-screen-lg grid grid-cols-3 mx-auto my-10 gap-10">
        <div className="col-span-2">
          <Timeline></Timeline>
        </div>
        <div className="col-span-1 fixed right-0 top-28">
          <Sidebar></Sidebar>
        </div>
      </div>
    </div>
  );
}
