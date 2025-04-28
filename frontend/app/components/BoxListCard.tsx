import { getBoxSpecifics } from "functions/BackendMsg";
import React, { useEffect, useState } from "react";

interface params {
  isDark: Boolean;
  id: string;
  userId: string;
}

function BoxListCard({ isDark = true, id, userId }: params) {
  const [boxListData, setBoxListData] = useState({
    name: "13434",
    comp: "321",
    rtof: "111",
  });
  useEffect(() => {
    const loadData = async () => {
      if (id == undefined) {
        return;
      }
      await getBoxSpecifics(id, userId).then(async (res) => {
        const data = await res.json();
        setBoxListData({
          name: data.name,
          comp: data.Completions,
          rtof: data.RtoF,
        });
      });
    };
    loadData();
  }, []);
  return (
    <div
      className={
        isDark
          ? `  w-96 h-96 bg-[url(/boxcarddark.svg)] relative flex align-middle  flex-col px-2`
          : `  w-96 h-96 bg-[url(/boxcardlight.svg)] relative flex align-middle  flex-col px-2`
      }
      style={{ backgroundRepeat: "no-repeat" }}
    >
      <div className="mt-28 w-9/10    flex flex-col align-middle relative">
        <div className="absolute flex justify-center w-full">
          <div className=" w-11/12  overflow-hidden ">
            <p
              className={`text-${
                boxListData.name.length < 6
                  ? "5"
                  : boxListData.name.length < 10
                  ? "4"
                  : boxListData.name.length < 15
                  ? "3"
                  : "2"
              }xl text-center font-semibold   text-wrap`}
            >
              {boxListData.name}
            </p>
          </div>
        </div>

        <h2 className=" ml-4 mt-28 text-xl">Completions: {boxListData.comp}</h2>
        <h2 className="ml-4  text-xl">Remeber/Forget: {boxListData.rtof}%</h2>
      </div>
      <div className=" w-full flex h-full justify-center align-bottom">
        <button className=" w-6 aspect-square flex cursor-pointer mr-8 mt-4">
          <img src="x.svg" className=" w-full h-full" />
        </button>
      </div>
    </div>
  );
}

export default BoxListCard;
