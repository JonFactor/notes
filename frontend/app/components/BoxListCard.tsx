import { deleteBox, getBoxSpecifics } from "functions/BackendMsg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface params {
  isDark: Boolean;
  id: string;
  userId: string;
  isQuizMode: Boolean;
}

function BoxListCard({ isDark = true, id, userId, isQuizMode }: params) {
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
    setVisible(true);
  }, []);

  const handleDelete = () => {
    deleteBox(id, userId)
      .then(() => {
        setVisible(false);
      })
      .catch(() => {
        alert("ERROR please try again later");
      });
  };

  const navigator = useNavigate();

  const handleGoInto = () => {
    navigator(`/${isQuizMode ? "quiz" : "card"}?id=${id}`);
  };

  const [visible, setVisible] = useState(true);
  return (
    <div
      className={
        isDark
          ? ` ${
              !visible && " invisible"
            } w-96 h-96 bg-[url(/boxcarddark.svg)] relative flex align-middle  flex-col px-2`
          : ` ${
              !visible && " invisible"
            } w-96 h-96 bg-[url(/boxcardlight.svg)] relative flex align-middle  flex-col px-2`
      }
      style={{ backgroundRepeat: "no-repeat" }}
    >
      <button
        className="mt-28 w-9/10  cursor-pointer   flex flex-col align-middle relative"
        onClick={handleGoInto}
      >
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
        <h2 className="ml-4  text-xl">
          Remeber/Forget: {Math.round(Number(boxListData.rtof) * 100) / 100}%
        </h2>
      </button>
      <div className=" w-full flex h-full justify-center align-bottom">
        <button
          className=" w-6 aspect-square flex cursor-pointer mr-8 mt-4"
          onClick={handleDelete}
        >
          <img src="x.svg" className=" w-full h-full" />
        </button>
      </div>
    </div>
  );
}

export default BoxListCard;
