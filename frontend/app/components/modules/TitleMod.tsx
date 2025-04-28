import React from "react";
import { NavLink, Router } from "react-router";

interface params {
  vertical: Boolean;
  absolute: Boolean;
}
function TitleMod({ vertical, absolute }: params) {
  return (
    <a
      className={
        vertical && absolute
          ? "cursor-pointer  absolute"
          : vertical && !absolute
          ? "cursor-pointer"
          : !vertical && absolute
          ? "flex cursor-pointer absolute"
          : "flex cursor-pointer"
      }
      href={"/"}
    >
      <div className=" text-8xl  font-light ml-12 mt-6 text-left  ">
        <h1>Study</h1>
        <h1>Bee</h1>
      </div>
      <img
        src={"/beebook.svg"}
        className={` w-96 h-42 ${!vertical && "mt-8"}`}
      ></img>
    </a>
  );
}

export default TitleMod;
