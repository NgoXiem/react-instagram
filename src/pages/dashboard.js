import React from "react";
import Header from "../components/Header";
import Timeline from "../components/Timeline";
import Sidebar from "../components/sidebar/Sidebar";

export default function Dashboard() {
  return (
    <div className="bg-gray-background w-full h-full min-h-screen pt-16 mobiles:pt-20">
      <Header></Header>
      <div className="max-w-screen-lg grid grid-cols-3 mx-auto mt-10 gap-10 px-10">
        <div className="mobiles:col-span-3 tablets:col-span-2">
          <Timeline></Timeline>
        </div>
        <div className="col-span-1">
          <Sidebar></Sidebar>
        </div>
      </div>
    </div>
  );
}
