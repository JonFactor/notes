import { useEffect, useRef, useState } from "react";
import fs from "fs";
import {
  deleteBox,
  deleteCard,
  getCards,
  getUserBoxs,
  updateProgressBox,
} from "functions/BackendMsg";
import TitleMod from "~/components/modules/TitleMod";
import BoxListMod from "~/components/modules/BoxListMod";
import useWindowDimensions from "~/hooks/WindowDimensions";

export default function Home() {
  const [cardData, setCardData] = useState({
    id: "",
    name: "",
    cards: [],
    completions: 0,
  });

  const [boxsData, setBoxesData] = useState<any>({ ids: [] });
  const [isBoxAvalible, setIsBoxAvalible] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [refreshPlease, setRefreshPlease] = useState(false);
  const [progId, setProgId] = useState("");

  const [responses, setResponses] = useState<Array<boolean>>([]);

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    // set box data in list here and device id
    setBoxStuff();
  }, []);

  useEffect(() => {
    setBoxStuff();
  }, [refreshPlease]);

  const setBoxStuff = async () => {
    const user = getSetUser();

    getUserBoxs(user)
      .then(async (data) => {
        const body = await data.json();
        setBoxesData(body);
      })
      .catch((eerr) => console.log(eerr));
  };

  useEffect(() => {
    setIsBoxAvalible(boxsData.ids.length > 0);
  }, [boxsData]);

  const getSetUser = () => {
    const ummmkey = "flashcardappkeythingy";
    let id = localStorage.getItem(ummmkey);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ummmkey, id);
    }
    return id;
  };

  const handelProgSave = async () => {
    const save = async () => {
      // update info here by saving

      // boxId = request.data["id"]
      // userId = request.data["userId"]
      // name = request.data.get("name")
      // isNewCompleted = request.data["isNewCompleted"]
      // responses = request.data["responses", {"respones":[], "ids":[]}]

      const isFinalPage = cardData.cards.length === responses.length;
      const body = {
        id: cardData.id,
        userId: getSetUser(),
        name: cardData.name,
        isNewCompleted: isFinalPage,
        responses: {
          responses: responses,
          ids: cardData.cards.map((a) => a.id),
        },
      };

      const worked = await updateProgressBox(body);

      if (!worked) {
        alert("ts didnt work :( try again.");
        return;
      }

      setResponses([]);
      alert("saved");

      setIsBoxOpen(false);
    };

    save();
  };

  const handelOpenBox = async (id: any) => {
    const userId = localStorage.getItem("flashcardappkeythingy");

    await getCards(id, userId).then(async (res) => {
      setCardData(await res.json());
      setIsBoxOpen(true);
    });

    console.log(cardData);
  };

  const handelDelete = async (id: any) => {
    const userId = localStorage.getItem("flashcardappkeythingy");
    const boxIndex = boxsData.ids.indexOf(id);
    await deleteBox(boxIndex, userId).then((res) => {
      if (res.status === 200) {
        const data = boxsData;
        data.names.splice(boxIndex, 1);
        data.ids.splice(boxIndex, 1);
        setBoxesData({
          names: data.names,
          ids: data.ids,
        });
      }
    });
  };

  const handelCardDelete = async () => {
    const userId = localStorage.getItem("flashcardappkeythingy");
    const card = cardData.cards[responses.length];
    const id = card.id;

    deleteCard(id, userId).then((res) => {
      if (res.status === 200) {
        handelOpenBox(card.boxId);
      }
    });
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className={`w-full flex ${width < 1400 && "flex-col"}`}>
      {/* {"1"} */}
      <div className={width > 1400 ? ` w-1/3` : "w-full"}>
        <div>
          <TitleMod vertical={false} absolute={false} />
          <h1 className=" ml-14 text-2xl">flashcard generator</h1>
          <div className="bg-[#F2DC5D] w-1/2 text-2xl ml-14 mt-2 rounded-xl  text-white  py-3">
            <a href="/" className=" w-full flex">
              <h1 className="  mx-auto">supporting projects</h1>
            </a>
          </div>
        </div>
        {width > 1400 && (
          <div className=" w-11/12 rounded-4xl mx-auto flex flex-col pb-6 bg-white mt-6 border-[#F2DC5D] border-8 border-solid">
            <h1 className="  text-5xl font-semibold mx-auto mt-2">
              Advanced Stats
            </h1>
            <div className="w-8/9  flex justify-end">
              <img src="/science.svg" className=" h-14 " />
            </div>
            <p className="  w-9/12 mx-auto  mt-6  text-3xl">
              We Are Currently Developing this Module! Support us by visiting
              our supporting projects above! THX
            </p>
            <img src="/satalite.svg" className=" h-64 mt-5 " />
          </div>
        )}
      </div>
      {/* {"2"} */}
      <div className={width > 1400 ? ` w-1/3` : "w-full"}>
        <h1 className=" ml-10 mt-12 text-5xl">How It Works</h1>
        <div className=" w-7/12 flex justify-end">
          <img src="/work.svg" className="h-14 " />
        </div>
        {width < 1400 && (
          <div className={` mt-10 w-6/10 ml-6`}>
            <a href="/generate">
              <img src="/buildbtn.svg" />
            </a>
          </div>
        )}
        <div className=" px-8 mt-8 w-full">
          <div className=" flex space-x-5 w-full justify-center">
            <img src="/form.svg" className="w-1/3  " />
            <img src="/plus.svg" className="w-12 " />
            <img src="/pdf.svg" className="w-2/7 " />
          </div>
          <div className=" flex  mt-6 space-x-16 justify-center">
            <img src="/waiting.svg" className="w-1/3 " />
            <div className="w-1/3">
              <h1 className=" text-3xl font-semibold">AI Magic</h1>
              <img src="/server.svg" className="w-full mt-2" />
            </div>
          </div>
          <div className=" flex justify-center space-x-26 mt-4">
            <img src="/report.svg" className="w-1/5 " />
            <img src="/card.svg" className="w-1/4" />
          </div>
        </div>
        <div className=" flex justify-end w-full ">
          {width > 1400 && (
            <div className={` mt-4 w-6/10`}>
              <a href="/generate">
                <img src="/buildbtn.svg" />
              </a>
            </div>
          )}
        </div>
      </div>
      {/* {"3"} */}
      <div
        className={
          width > 1400
            ? ` w-1/3 flex  relative z-0`
            : "w-full flex  relative z-0 mt-10"
        }
      >
        {width > 1400 && (
          <div className=" mt-4  z-10  absolute ">
            <img src="/cards.svg" className=" " />
          </div>
        )}

        <div className=" w-full flex justify-end">
          <div
            className=" bg-[#FFF6D0] h-full  "
            style={{ width: width > 1400 ? "88%" : "100%" }}
          >
            {isBoxAvalible && (
              <BoxListMod boxIds={boxsData.ids} userId={getSetUser()} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
  {
    /* <div className="flex  w-full mt-6  align-center justify-center space-x-4  ">
        <h1 className=" text-4xl">Flash.Ai</h1>
        <a
          className=" h-full px-6 py-1 mt-1 bg-green-800 rounded-3xl"
          href="localhost:5173"
        >
          Supporting Projects
        </a>
      </div>
      {progId !== "" && progId !== undefined && (
        <LoadingInicator
          progId={progId}
          setProgId={setProgId}
        ></LoadingInicator>
      )}

      <div className=" flex justify-center mt-62 space-x-20">
        {!isBoxOpen && (
          <>
            <div className="flex flex-col p-6 bg-gray-900">
              <div className=" justify-center flex font-semibold text-2xl space-x-4">
                <img
                  width={30}
                  height={30}
                  className=" rotate-y-180"
                  src={"../../public/tape.jpg"}
                ></img>
                <h1>Create New Box</h1>
                <img width={30} height={30} src={"../../public/tape.jpg"}></img>
              </div>

              {isCreateOpen ? (
                <NewBox
                  parrentSetter={setIsCreateOpen}
                  setRefreshPlease={setRefreshPlease}
                  refreshPlease={refreshPlease}
                  setProgId={setProgId}
                  s
                />
              ) : (
                <div className="flex flex-col justify-center">
                  <div className=" mt-4">
                    <p className="text-center">Just Upload A Document</p>
                    <p className="text-center">And We'll Handel The Rest!</p>
                  </div>
                  <button
                    className="mt-6 bg-green-800"
                    onClick={() => setIsCreateOpen(true)}
                  >
                    <h1>Start Now</h1>
                  </button>
                </div>
              )}
            </div>
            {isBoxAvalible && (
              <div className="flex flex-col p-6 bg-gray-900">
                <div className="w-full justify-center flex font-semibold text-2xl">
                  <h1>Box List</h1>
                </div>
                <div className="  ">
                  <div className="grid grid-cols-2 space-x-4 space-y-3 mt-4">
                    {boxsData.names?.map((item: any, index: number) => (
                      <div
                        key={index.toString()}
                        className="   bg-slate-800 justify-center align-middle px-2 rounded-lg py-2"
                      >
                        <button
                          className=" float-left"
                          onClick={() => {
                            handelOpenBox(boxsData.ids[index]);
                          }}
                        >
                          <h2>{item}</h2>
                        </button>
                        <button
                          className=" px-2 ml-2 rounded-md bg-red-800 text-center font-extrabold  text-md  float-right"
                          onClick={() => {
                            handelDelete(boxsData.ids[index]);
                          }}
                        >
                          <h2>-</h2>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {isBoxOpen && (
          <div className="w-5/12">
            <div className="flex flex-col p-6 bg-gray-900">
              {cardData.cards.length > responses.length ? (
                <FlashCard
                  question={cardData.cards[responses.length].question}
                  answer={cardData.cards[responses.length].answer}
                  setParent={setResponses}
                  parent={responses}
                ></FlashCard>
              ) : (
                <div className=" flex w-full flex-col justify-center">
                  <h1 className=" text-2xl m-auto ">
                    Good Work! Your Done Now Save or Exit.
                  </h1>
                  <img
                    className=" aspect-auto w-1/3 mt-6 m-auto"
                    src={"../../public/celebrate.jpg"}
                  ></img>
                </div>
              )}

              <div className=" flex space-x-6">
                {cardData.cards.length > responses.length && (
                  <button
                    className=" w-1/6 mt-6 bg-red-900 "
                    onClick={handelCardDelete}
                  >
                    <h1>Delete</h1>
                  </button>
                )}
                <button
                  className="  z-0 w-1/4 mt-6 bg-orange-800"
                  onClick={() => {
                    setIsBoxOpen(false);
                    setResponses([]);
                  }}
                >
                  <h1>Leave</h1>
                </button>
                <button
                  className="  z-0 w-full mt-6 bg-green-800"
                  onClick={handelProgSave}
                >
                  <h1>Save Progress</h1>
                </button>
              </div>
            </div>
          </div>
        )}
      </div> */
  }
}
