import { getProgress } from "functions/BackendMsg";
import React, { useEffect, useRef, useState } from "react";

interface params {
  progId: string;
  widthSmol: boolean;
}

export default function LoadingInicator({ progId, widthSmol }: params) {
  const [percent, setPercent] = useState("0");
  const [queue, setQueue] = useState(0);

  useEffect(() => {
    const doIt = () => {
      getProgress(progId).then(async (res) => {
        const data = await res.json();
        if (data.status !== null) {
          setPercent((data.status * 100).toString());
        }

        console.log(data.queuePlacement);

        if (data.queuePlacement === null) {
          return;
        }

        setQueue(data.queuePlacement);
      });
    };
    doIt();

    setInterval(
      () => {
        if (percent === "100") {
          return;
        }
        doIt();
      },
      queue <= 1 || queue === null || queue === undefined ? 15000 : 35000
    );
  }, []);

  if (percent === "100") {
    return (
      <div>
        <h1 className=" text-7xl">All Finished!</h1>
      </div>
    );
  }

  return (
    <div className={` ${widthSmol && "flex-col"} flex space-x-2`}>
      {queue <= 1 || queue === null || queue === undefined ? (
        <h1 className=" text-2xl my-auto">
          {Math.floor(Number(percent) * 100) / 100}%
        </h1>
      ) : (
        <h1 className=" text-2xl my-auto">{queue} Is Your Spot In Queue</h1>
      )}
      <div className={` w-full bg-[#FFED82] rounded-xl h-10 `}>
        <div
          className={` h-full bg-black rounded-xl`}
          style={{
            width:
              queue <= 1 || queue === null || queue === undefined
                ? `${Math.floor(Number(percent) * 100) / 100}%`
                : `${(1 / queue) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
