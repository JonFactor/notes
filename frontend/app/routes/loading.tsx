import { getProgress } from "functions/BackendMsg";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import LoadingInicator from "~/components/LoadingInicator";
import TitleMod from "~/components/modules/TitleMod";
import useWindowDimensions from "~/hooks/WindowDimensions";

function loading() {
  const [progId, setProgId] = useState<string>();
  const { height, width } = useWindowDimensions();
  const [searchParms] = useSearchParams();

  useEffect(() => {
    const id = searchParms.get("id");
    setProgId(id);
  }, []);

  return (
    <div className=" h-full">
      <div className=" flex">
        {width > 1500 && <TitleMod vertical={true} absolute={true}></TitleMod>}
        <div className=" flex flex-col  mx-auto mt-20">
          <h1 className={` text-${width > 850 ? "8" : "4"}xl font-semibold`}>
            Loading Mini Game
          </h1>
          <h2 className=" text-5xl">Flappy Bee</h2>
          <div className=" mt-24">
            {progId !== undefined && (
              <LoadingInicator
                progId={progId}
                widthSmol={width <= 850}
              ></LoadingInicator>
            )}
          </div>
        </div>
      </div>
      <div
        className={` ${
          width <= 850 && "flex-col"
        }   w-full flex justify-center h-full mt-12 space-x-5`}
      >
        <iframe
          src="https://flappycreator.com/flappy.php?id=680be029bab6c"
          className={` h-[425px] ${width <= 850 && "mx-auto"}`}
        ></iframe>
        <iframe
          className={` w-[600px] h-[425px] ${width <= 850 && "mx-auto"} ${
            width <= 850 && "mt-8"
          }`}
          src="https://www.youtube.com/embed/O96fE1E-rf8?si=3xnwsfJuLFshVlyH&amp;start=20"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    </div>
  );
}

export default loading;
