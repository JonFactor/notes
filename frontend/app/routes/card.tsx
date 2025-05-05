import { deleteCard, getCards, updateProgressBox } from "functions/BackendMsg";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import FlashCard from "~/components/FlashCard";
import TitleMod from "~/components/modules/TitleMod";
import useWindowDimensions from "~/hooks/WindowDimensions";
import { getSetUser } from "functions/GetSetUser";

function card() {
  const { height, width } = useWindowDimensions();
  const [cardInfo, setCardInfo] = useState([{}]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isQuestionSide, setIsQuestionSide] = useState(true);
  const [rememberList, setRememberList] = useState<Array<number>>([]);
  const [forgetList, setForgetList] = useState<Array<number>>([]);
  const [justSaved, setJustSaved] = useState([]);

  const [searchParms] = useSearchParams();

  const getBoxId = () => {
    const id = searchParms.get("id");
    return id;
  };

  useEffect(() => {
    setIsQuestionSide(true);
  }, [currentCardIndex]);

  useEffect(() => {
    const boxId = getBoxId();

    getCards(boxId, getSetUser()).then(async (res) => {
      const data = await res.json();
      setCardInfo(data.cards);
    });
  }, []);

  const handleRemember = () => {
    setForgetList([...forgetList, currentCardIndex]);
    setCurrentCardIndex(currentCardIndex + 1);
  };

  const handleForget = () => {
    setRememberList([...rememberList, currentCardIndex]);
    setCurrentCardIndex(currentCardIndex + 1);
  };

  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/");
    setCurrentCardIndex(0);
  };

  const handleSave = () => {
    console.log("here");
    const newCompleted = cardInfo.length - 1 >= currentCardIndex;

    const respones = [];

    const ids = [];

    for (let i = 0; i < forgetList.length; i++) {
      respones.push(false);
      ids.push(cardInfo[forgetList[i]].id);
    }

    for (let i = 0; i < rememberList.length; i++) {
      respones.push(true);
      ids.push(cardInfo[rememberList[i]].id);
    }

    const filteredArray = ids.filter((item) => !justSaved.includes(item));
    if (filteredArray.length < 1) {
      alert("everything is already saved");
      return;
    }

    const body = {
      id: getBoxId(),
      userId: getSetUser(),
      isNewCompleted: newCompleted,
      responses: { responses: respones, ids: filteredArray },
    };

    updateProgressBox(body)
      .then((res) => {
        alert("Saved!");
        setJustSaved(ids);
      })
      .catch((res) => {
        alert("ERROR");
      });
  };

  const handleReset = () => {
    setForgetList([]);
    setRememberList([]);
    setJustSaved([]);
    setCurrentCardIndex(0);
  };

  const handleDeleteCard = () => {
    deleteCard(cardInfo[currentCardIndex].id, getSetUser())
      .then(() => {
        alert("Completed!");
        getCards(getBoxId(), getSetUser()).then(async (res) => {
          const data = await res.json();
          setCardInfo(data.cards);
        });
      })
      .catch(() => alert("Error Occured"));
  };

  return (
    <div>
      {width > 1350 && <TitleMod vertical={true} absolute={true} />}

      <div className={`w-full justify-center flex flex-col  `}>
        {/* Main Content */}
        <div className={`mt-60 `}>
          {cardInfo.length - 1 >= currentCardIndex ? (
            <FlashCard
              width={width}
              question={cardInfo[currentCardIndex].question}
              answer={cardInfo[currentCardIndex].answer}
              handleRemeber={handleRemember}
              handleForget={handleForget}
              isQuestionSide={isQuestionSide}
              currentCardIndex={currentCardIndex + 1}
              totalCardsLength={cardInfo.length}
            />
          ) : (
            <div
              className={`  mx-auto px-8 py-8  bg-linear-to-br from-[#FFE7B7] to-[#F4C76C] rounded-4xl  ${
                width > 1150 ? "w-5/10" : "w-8/10"
              }`}
            >
              <h1 className="  w-full text-center text-4xl">
                Congrats! You Made It through {currentCardIndex} Pages!
              </h1>
              <div className=" w-full flex justify-center mt-10">
                <img src="/congrats.svg" className=" w-3/4 aspect-auto " />
              </div>

              <div className="  mt-6">
                <div className="  float-left">
                  <button
                    className=" cursor-pointer text-4xl bg-[#FFF2AA] px-8 py-2 rounded-md"
                    onClick={handleExit}
                  >
                    Exit
                  </button>
                  <button
                    className=" cursor-pointer text-4xl bg-[#FFF2AA] px-8 py-2 rounded-md  ml-8"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>

                <button
                  className=" cursor-pointer float-right text-4xl bg-[#FFF2AA] px-8 py-2 rounded-md"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ToolBar */}
        {cardInfo.length - 1 >= currentCardIndex && (
          <div
            className={
              width > 1150
                ? `mx-auto mt-12 px-8 py-3  bg-linear-to-br from-[#F4C76C] to-[#F4C76C] rounded-full  w-5/12`
                : `mx-auto mt-2 bg-black px-1 py-1 rounded-xl ${
                    width < 430 && "space-y-2"
                  }`
            }
          >
            {/* Left */}
            <div className=" float-left space-x-4">
              <button
                className="  bg-white px-8 rounded-xl text-2xl font-bold py-2 cursor-pointer"
                onClick={handleDeleteCard}
              >
                <h2>Delete Card</h2>
              </button>
              {width > 1360 && (
                <button
                  className=" bg-white px-5 rounded-xl text-2xl  py-2  cursor-pointer"
                  onClick={handleExit}
                >
                  <h2>Exit</h2>
                </button>
              )}

              <button
                className=" bg-white px-5 rounded-xl text-2xl  py-2 cursor-pointer"
                onClick={() => {
                  if (currentCardIndex > 0) {
                    handleSave();
                  }
                }}
              >
                <h2>Save</h2>
              </button>
            </div>
            {/* Right */}
            <div className=" float-right">
              <button
                className=" bg-white ml-6 px-5 rounded-xl text-2xl  py-2  cursor-pointer"
                onClick={() => {
                  setIsQuestionSide(!isQuestionSide);
                }}
              >
                <h2>Flip</h2>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default card;
