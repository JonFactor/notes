import { getProgress } from "functions/BackendMsg";
import React, { useEffect, useRef, useState } from "react";

interface params {
  setProgId: React.Dispatch<React.SetStateAction<string>>;
  progId: string;
}

export default function LoadingInicator({ progId, setProgId }: params) {
  const [percent, setPercent] = useState("0");

  useEffect(() => {
    const doIt = () => {
      getProgress(progId).then(async (res) => {
        const data = await res.json();
        console.log(data);
        setPercent((data.status * 100).toString());

        if (data.status === "1" || data.status === 1) {
          setProgId("");
        }
      });
    };

    console.log(progId);

    setInterval(() => {
      if (progId === "" || progId === undefined) {
        return;
      }
      doIt();
    }, 5000);
  }, []);

  return (
    <div className=" flex space-x-2">
      <h1 className=" text-2xl my-auto">{percent}%</h1>
      <div className={` w-full bg-[#FFED82] rounded-xl h-10 `}>
        <div
          className={` h-full bg-black rounded-xl`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
