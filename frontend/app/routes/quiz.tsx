import { deleteCard, getCards, updateProgressBox } from "functions/BackendMsg";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import FlashCard from "~/components/FlashCard";
import TitleMod from "~/components/modules/TitleMod";
import useWindowDimensions from "~/hooks/WindowDimensions";

function quiz() {
  const { height, width } = useWindowDimensions();
  const [cardInfo, setCardInfo] = useState([{}]);
  const [responses, setResponses] = useState([]);

  const [searchParms] = useSearchParams();

  const getBoxId = () => {
    const id = searchParms.get("id");
    return id;
  };

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
    const boxId = getBoxId();

    getCards(boxId, getSetUser()).then(async (res) => {
      const data = await res.json();
      setCardInfo(data.cards);
    });
  }, []);

  const handleSave = () => {};

  // const handleSave = () => {
  //   console.log("here");
  //   const newCompleted = cardInfo.length - 1 <= currentCardIndex;

  //   const respones = [];

  //   const ids = [];

  //   for (let i = 0; i < forgetList.length; i++) {
  //     respones.push(false);
  //     ids.push(cardInfo[forgetList[i]].id);
  //   }

  //   for (let i = 0; i < rememberList.length; i++) {
  //     respones.push(true);
  //     ids.push(cardInfo[rememberList[i]].id);
  //   }

  //   const filteredArray = ids.filter((item) => !justSaved.includes(item));
  //   if (filteredArray.length < 1) {
  //     alert("everything is already saved");
  //     return;
  //   }

  //   const body = {
  //     id: getBoxId(),
  //     userId: getSetUser(),
  //     isNewCompleted: newCompleted,
  //     responses: { responses: respones, ids: filteredArray },
  //   };

  //   updateProgressBox(body)
  //     .then((res) => {
  //       alert("Saved!");
  //       setJustSaved(ids);
  //     })
  //     .catch((res) => {
  //       alert("ERROR");
  //     });
  // };

  return (
    <div>
      {width > 1350 && <TitleMod vertical={true} absolute={true} />}

      <div className=" flex justify-center w-full">
        <div className={`  flex flex-col w-2/4 `}>
          {/* Main Content */}
          <div className={`mt-32 bg-[#FFF2AA] px-12 py-12 `}>
            <div className=" flex space-x-4">
              <p className=" text-5xl">Quiz</p>
              <p className=" mt-6">
                Wisdom is knowing what you dont know -socrates
              </p>
            </div>
            <div className=" w-full mt-2 h-1 bg-black"></div>
            <div className="mt-12">
              {cardInfo.map((value, index) => (
                <div key={index} className="mt-3">
                  <div className=" flex space-x-3 text-xl">
                    <p>{index + 1}.</p>
                    <p>{value.question}</p>
                  </div>
                  <textarea
                    className=" w-full bg-white px-3 py-1 text-xl mt-3"
                    onChange={(e) => {
                      let newResponses = responses;
                      newResponses[index] = e.target.value;
                      setResponses(newResponses);
                      console.log(responses);
                    }}
                    value={responses[index]}
                  ></textarea>
                </div>
              ))}
            </div>
            <div className=" w-full flex justify-end mt-8">
              <button className=" bg-white px-8 rounded-xl py-3 cursor-pointer">
                <p className=" text-2xl">Submit For Grading</p>
              </button>
            </div>
          </div>
          <div className=" w-1 h-12"></div>
        </div>
      </div>
    </div>
  );
}

export default quiz;
