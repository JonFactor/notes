import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/home";
import FlashCard from "~/components/FlashCard";
import fs from "fs";
import { NewBox } from "~/components/NewBox";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Flashcards" },
    { name: "description", content: "Lets view those Cards" },
  ];
}

export default function Home() {
  const [cardData, setCardData] = useState({
    id: "",
    name: "",
    cards: [],
    completions: 0,
  });

  const [boxsData, setBoxesData] = useState<any>({ names: [], ids: [] });
  const [isBoxAvalible, setIsBoxAvalible] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [refreshPlease, setRefreshPlease] = useState(false);

  const [responses, setResponses] = useState<Array<boolean>>([]);

  useEffect(() => {
    // set box data in list here and device id
    setBoxStuff();
  }, []);

  useEffect(() => {
    setBoxStuff();
  }, [refreshPlease]);

  const setBoxStuff = async () => {
    const user = getSetUser();

    await fetch(`http://localhost:8000/api/boxlist/?user=${user}`, {
      method: "GET",
    })
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

      const worked = await fetch("http://localhost:8000/api/box/", {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        return false;
      });

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

    await fetch(
      `http://localhost:8000/api/box/?id=${id}&userId=${userId}`
    ).then(async (res) => {
      setCardData(await res.json());
      setIsBoxOpen(true);
    });

    console.log(cardData);
  };

  const handelDelete = async (id: any) => {
    const userId = localStorage.getItem("flashcardappkeythingy");

    await fetch(`http://localhost:8000/api/box/?id=${id}&userId=${userId}`, {
      method: "DELETE",
      body: JSON.stringify({ id: id, userId: userId }),
    }).then((res) => {
      if (res.status === 200) {
        setIsBoxAvalible(boxsData.ids.length === 1);
        setBoxesData(null);
      }
    });
  };

  const handelCardDelete = async () => {
    const userId = localStorage.getItem("flashcardappkeythingy");
    const card = cardData.cards[responses.length];
    const id = card.id;

    await fetch(`http://localhost:8000/api/card/?id=${id}&userId=${userId}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        handelOpenBox(card.boxId);
      }
    });
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex  w-full mt-6  align-center justify-center space-x-4  ">
        <h1 className=" text-4xl">Flash.Ai</h1>
        <a
          className=" h-full px-6 py-1 mt-1 bg-green-800 rounded-3xl"
          href="localhost:5173"
        >
          Supporting Projects
        </a>
      </div>

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
                  <div className="float-left">
                    {boxsData.names?.map((item: any, index: number) => (
                      <div key={index.toString()} className=" mt-3">
                        <button
                          onClick={() => {
                            handelOpenBox(boxsData.ids[index]);
                          }}
                        >
                          <h2>{item}</h2>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className=" float-right">
                    {boxsData.names?.map((item: any, index: number) => (
                      <button
                        className=" px-2 ml-2 rounded-md bg-red-800 text-center font-extrabold  text-md mt-3"
                        onClick={() => {
                          handelDelete(boxsData.ids[index]);
                        }}
                      >
                        <h2>-</h2>
                      </button>
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
      </div>
    </div>
  );
}
