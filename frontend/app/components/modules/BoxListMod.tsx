import React, { useEffect, useState } from "react";
import BoxListCard from "../BoxListCard";
import useWindowDimensions from "~/hooks/WindowDimensions";
import { getUserBoxs } from "functions/BackendMsg";
import { useNavigate } from "react-router";

function BoxListMod({ boxIds = [], userId = "" }) {
  const [tripBoxs, setTripBoxs] = useState<any>([[]]);
  const { width, height } = useWindowDimensions();
  const [isPerfectWidth, setIsPerfectWidth] = useState(false);
  const [isBoxAvalible, setIsBoxAvalible] = useState(false);
  const [boxsData, setBoxsData] = useState();
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const getSetUser = () => {
    const ummmkey = "flashcardappkeythingy";
    let id = localStorage.getItem(ummmkey);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ummmkey, id);
    }
    return id;
  };

  useEffect(() => {
    setBoxStuff();
  }, []);

  useEffect(() => {
    setBoxStuff();
    console.log(shouldRefresh);
  }, [shouldRefresh]);

  const setBoxStuff = async () => {
    const user = getSetUser();

    await getUserBoxs(user)
      .then(async (data) => {
        const body = await data.json();
        setBoxsData(body);
      })
      .catch((eerr) => console.log(eerr));

    const array2D = [];
    for (let i = 0; i < boxIds.length; i += 3) {
      array2D.push(boxIds.slice(i, i + 3));
    }

    setTripBoxs([...array2D]);
  };

  useEffect(() => {
    if (boxsData !== undefined) {
      setIsBoxAvalible(boxsData.ids.length > 0);
    }
  }, [boxsData]);

  useEffect(() => {
    setIsPerfectWidth(width < 1659 && width > 1400);
  }, [width]);

  if (!isBoxAvalible) {
    return <></>;
  }
  return (
    <div className=" w-full h-full  flex justify-center align-middle flex-col overflow-hidden">
      <div className=" relative flex flex-col  overflow-auto scroll-auto h-[930px]">
        {tripBoxs.map((val, ind) => {
          const areBlack = [
            Math.random() > 0.5,
            Math.random() > 0.5,
            Math.random() > 0.5,
          ];
          return (
            <div key={ind.toString()}>
              <div className=" h-57 flex relative z-30 ">
                <div
                  className={` mt-6 `}
                  style={{
                    scale: `${isPerfectWidth ? 50 : 75}% `,
                  }}
                >
                  <BoxListCard
                    isDark={areBlack[0]}
                    userId={userId}
                    id={val[0]}
                  />
                </div>
                {val.length > 1 && (
                  <div
                    className="   ml-65 absolute"
                    style={{
                      scale: `${isPerfectWidth ? 50 : 75}% `,
                    }}
                  >
                    <BoxListCard
                      isDark={areBlack[1]}
                      userId={userId}
                      id={val[1]}
                    />
                  </div>
                )}
              </div>
              <div className=" h-72 ml-33 flex relative z-0">
                {val.length > 2 && (
                  <div
                    className="  "
                    style={{
                      scale: `${isPerfectWidth ? 50 : 75}% `,
                    }}
                  >
                    <BoxListCard
                      isDark={areBlack[2]}
                      userId={userId}
                      id={val[2]}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BoxListMod;
