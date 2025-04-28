import React, { useEffect, useState } from "react";
import BoxListCard from "../BoxListCard";
import useWindowDimensions from "~/hooks/WindowDimensions";

function BoxListMod({ boxIds = [], userId = "" }) {
  const [tripBoxs, setTripBoxs] = useState<any>([[]]);
  const { width, height } = useWindowDimensions();
  const [isPerfectWidth, setIsPerfectWidth] = useState(false);
  useEffect(() => {
    const array2D = [];
    for (let i = 0; i < boxIds.length; i += 3) {
      array2D.push(boxIds.slice(i, i + 3));
    }

    setTripBoxs(array2D);
  }, []);
  useEffect(() => {
    setIsPerfectWidth(width < 1659 && width > 1400);
  }, [width]);
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
              <div className=" h-57 flex relative ">
                <a
                  className={` mt-6 `}
                  style={{
                    scale: `${isPerfectWidth ? 50 : 75}% `,
                  }}
                  href={`/card?id=${val[0]}`}
                >
                  <BoxListCard
                    isDark={areBlack[0]}
                    userId={userId}
                    id={val[0]}
                  />
                </a>
                {val.length > 1 && (
                  <a
                    className="   ml-65 absolute"
                    style={{
                      scale: `${isPerfectWidth ? 50 : 75}% `,
                    }}
                    href={`/card?id=${val[1]}`}
                  >
                    <BoxListCard
                      isDark={areBlack[1]}
                      userId={userId}
                      id={val[1]}
                    />
                  </a>
                )}
              </div>
              <div className=" h-72 ml-33 flex relative">
                {val.length > 2 && (
                  <a
                    className="  "
                    style={{
                      scale: `${isPerfectWidth ? 50 : 75}% `,
                    }}
                    href={`/card?id=${val[2]}`}
                  >
                    <BoxListCard
                      isDark={areBlack[2]}
                      userId={userId}
                      id={val[2]}
                    />
                  </a>
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
