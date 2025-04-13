import React, { useState } from "react";

interface params {
  question: string;
  answer: string;
  setParent: React.Dispatch<React.SetStateAction<boolean[]>>;
  parent: Array<boolean>;
}

export default function FlashCard({
  question,
  answer,
  setParent,
  parent,
}: params) {
  const [isQuestionSide, setIsQuestionSide] = useState(true);
  return (
    <div>
      <div>{isQuestionSide ? <h1>{question}</h1> : <h1>{answer}</h1>}</div>
      <div className=" w-full mt-3">
        {!isQuestionSide && (
          <div className=" float-start space-x-4">
            <button
              className="px-4 bg-green-300"
              onClick={() => {
                setParent([...parent, true]);
                setIsQuestionSide(true);
              }}
            >
              <h2 className=" text-green-900 font-bold">Got It</h2>
            </button>
            <button
              className="px-4 bg-red-300"
              onClick={() => {
                setParent([...parent, false]);
                setIsQuestionSide(true);
              }}
            >
              <h2 className="text-red-900 font-bold">Forgot It</h2>
            </button>
          </div>
        )}
        <button
          className=" float-end px-5 bg-purple-900"
          onClick={() => {
            setIsQuestionSide(!isQuestionSide);
          }}
        >
          <p>Flip</p>
        </button>
      </div>
    </div>
  );
}
