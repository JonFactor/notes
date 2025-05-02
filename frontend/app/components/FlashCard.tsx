import React, { useState } from "react";
import useWindowDimensions from "~/hooks/WindowDimensions";

interface params {
  question: string;
  answer: string;
  setParent: React.Dispatch<React.SetStateAction<boolean[]>>;
  parent: Array<boolean>;
  width: number;
  handleRemeber: () => void;
  handleForget: () => void;
  isQuestionSide: boolean;
  currentCardIndex: number;
  totalCardsLength: number;
}

export default function FlashCard({
  question,
  answer,
  handleForget,
  handleRemeber,
  width,
  isQuestionSide,
  currentCardIndex,
  totalCardsLength,
}: params) {
  return (
    <div
      className={`  mx-auto px-8 py-4  bg-linear-to-br from-[#FFE7B7] to-[#F4C76C] rounded-4xl  ${
        width > 1150 ? "w-5/10" : "w-8/10"
      }`}
    >
      {/* Top */}
      <div className="flex">
        <div className=" py-1 px-3  bg-white rounded-xl text-4xl ">
          <h1>
            {currentCardIndex} / {totalCardsLength}
          </h1>
        </div>
        <h1 className=" my-auto  text-4xl font-semibold ml-5">Question</h1>
      </div>
      {/* Middle */}
      <div className=" ml-1 mt-4  ">
        <p className=" text-3xl  ">{isQuestionSide ? question : answer}</p>
      </div>
      {/* Bottom */}
      <div className=" w-full  flex justify-end mt-8">
        {!isQuestionSide && (
          <div className=" space-x-10 space-y-2">
            <button
              onClick={handleForget}
              className=" px-16 py-2 bg-black rounded-xl text-3xl text-white cursor-pointer"
            >
              <h2>Forgot It</h2>
            </button>
            <button
              onClick={handleRemeber}
              className=" px-20 py-2 bg-[#FFFD72] rounded-xl text-3xl text-black cursor-pointer"
            >
              <h2> Got It</h2>
            </button>
          </div>
        )}
      </div>
    </div>
    // <div>
    //   <p></p>
    //   <div className=" mt-2">{isQuestionSide ? <h1>{parent.length}. {question}</h1> : <h1>{parent.length}. {answer}</h1>}</div>
    //   <div className=" w-full mt-3">
    //     {!isQuestionSide && (
    //       <div className=" float-start space-x-4">
    //         <button
    //           className="px-4 bg-green-300"
    //           onClick={() => {
    //             setParent([...parent, true]);
    //             setIsQuestionSide(true);
    //           }}
    //         >
    //           <h2 className=" text-green-900 font-bold">Got It</h2>
    //         </button>
    //         <button
    //           className="px-4 bg-red-300"
    //           onClick={() => {
    //             setParent([...parent, false]);
    //             setIsQuestionSide(true);
    //           }}
    //         >
    //           <h2 className="text-red-900 font-bold">Forgot It</h2>
    //         </button>
    //       </div>
    //     )}
    //     <button
    //       className=" float-end px-5 bg-purple-900"
    //       onClick={() => {
    //         setIsQuestionSide(!isQuestionSide);
    //       }}
    //     >
    //       <p>Flip</p>
    //     </button>
    //   </div>
    // </div>
  );
}
