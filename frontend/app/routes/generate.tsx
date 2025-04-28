import React from "react";
import TitleMod from "~/components/modules/TitleMod";
import { NewBoxForm } from "~/components/NewBoxForm";
import useWindowDimensions from "~/hooks/WindowDimensions";

function generate() {
  const { height, width } = useWindowDimensions();
  return (
    <div className="flex w-full">
      {width > 1250 && (
        <div className=" w-1/5">
          <TitleMod vertical={true} absolute={false} />
          <div
            className={`mt-12 bg-white px-5 py-5  m-auto w-${
              width > 1800 ? 7 : 10
            }/10`}
          >
            <h1 className=" text-red-400  text-5xl font-extrabold">WARNING</h1>
            <p className="  text-3xl mt-4">
              Information is Stored on the browser and will not transfer across
              devices or browsers. If you clear your browser Cache you will
              delete all progress
            </p>
          </div>
        </div>
      )}

      <div
        className={`w-${
          width > 1550 ? 5 : 12
        }/12 mx-auto my-12 px-8 py-3  bg-linear-to-br from-[#FFE7B7] to-[#F4C76C]  rounded-4xl  `}
      >
        <div className=" flex  w-full">
          <div className=" bg-[#FFF7CC] px-6 py-3 rounded-full">
            <h1 className="  text-3xl font-light">Create Flashcards</h1>
          </div>
        </div>
        <div className={width > 900 ? " mt-12" : ""}>
          <NewBoxForm></NewBoxForm>
        </div>
      </div>
      {width > 1550 && (
        <div className="w-3/12 flex">
          <img src="/hex.svg" className="w-full h-[5vm]  mt-24" />
        </div>
      )}
    </div>
  );
}

export default generate;
