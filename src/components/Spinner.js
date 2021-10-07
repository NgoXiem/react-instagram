import React from "react";
import Loader from "react-loader-spinner";
export default function Spinner() {
  return (
    <Loader
      type="TailSpin"
      color="#00000059"
      height={50}
      width={50}
      className="flex justify-center items-center mt-20"
    ></Loader>
  );
}
