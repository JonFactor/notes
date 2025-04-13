import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import FlashCard from "~/components/FlashCard";
import fs from "fs";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Flashcards" },
    { name: "description", content: "Lets view those Cards" },
  ];
}

export default function Home() {
  const [cardData, setCardData] = useState([
    { question: "hello", answer: "test" },
  ]);

  const [responses, setResponses] = useState<Array<boolean>>([]);

  useEffect(() => {
    fetch("/formatted.json").then(async (response) => {
      setCardData(await response.json());
    });
    fetch("/userData.json").then(async (response) => {
      setResponses(await response.json());
    });
  }, []);

  const [saving, setSaving] = useState<boolean>(false);
  useEffect(() => {
    const save = async () => {
      fs.writeFile(
        "../../../public/userData.json",
        JSON.stringify(responses),
        (err) => {
          console.log(err);
        }
      );
      console.log(responses);
      alert("saved");
    };
    if (saving === true) {
      console.log("1");
      save();
      setSaving(false);
    }
  }, [saving]);

  const handelClick = () => {
    setSaving(true);
  };

  return (
    <div className=" flex justify-center mt-62">
      <div className="flex flex-col">
        {cardData.length > responses.length && (
          <FlashCard
            question={cardData[responses.length].question}
            answer={cardData[responses.length].answer}
            setParent={setResponses}
            parent={responses}
          ></FlashCard>
        )}
        <button
          className="  z-0 w-full mt-10 bg-green-800"
          onClick={handelClick}
        >
          <h1>Save</h1>
        </button>
      </div>
    </div>
  );
}
