import { getProgress } from "functions/BackendMsg";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import LoadingInicator from "~/components/LoadingInicator";
import TitleMod from "~/components/modules/TitleMod";
import useWindowDimensions from "~/hooks/WindowDimensions";

function loading() {
  const [progId, setProgId] = useState("");
  const { height, width } = useWindowDimensions();
  const [searchParms] = useSearchParams();

  useEffect(() => {
    const id = searchParms.get("progId");
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
            <LoadingInicator
              progId={progId}
              setProgId={setProgId}
            ></LoadingInicator>
          </div>
        </div>
      </div>

      <div className=" w-full flex justify-center h-full mt-12">
        <iframe
          src="https://flappycreator.com/flappy.php?id=680be029bab6c"
          className={` w-${width > 530 ? 3 : 6}/6 h-[425px]`}
        ></iframe>
      </div>
    </div>
  );
}

export default loading;
