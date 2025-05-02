import { generateBox } from "functions/BackendMsg";
import React, { useEffect, useRef, useState } from "react";
import { Router, useNavigate } from "react-router";

export const NewBoxForm = () => {
  const [data, setData] = useState({
    name: "",
    useNames: false,
    useTerminology: false,
    otherInfo: "",
    useAnki: false,
  });

  const [progId, setProgId] = useState(null);

  const uploadThingy = useRef<HTMLInputElement>(null);

  const handelLeave = () => {
    setData({
      name: "",
      useNames: false,
      useTerminology: false,
      otherInfo: "",
      useAnki: false,
    });
  };

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const [file64, setFile64] = useState<any>(null);

  const handelFileUpload = async (e: any) => {
    const file = e.target.files[0];

    const based = await convertBase64(file);

    setFile64(based);
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

  function base64ToFile(base64String: string, fileName: string) {
    // Remove data URL scheme if present
    const base64Data = base64String.replace(/^data:.+;base64,/, "");
    const byteCharacters = atob(base64Data); // Decode Base64 string
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray]);
    const url = URL.createObjectURL(blob);

    // Create a link element to download the file
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  }

  const navigate = useNavigate();

  const handelBoxCreate = async () => {
    const data2 = {
      file: file64,
      name: data.name,
      user: getSetUser(),
      rewriteIgnore: true,
      isPeopleNames: data.useNames,
      isThingNames: data.useTerminology,
      otherInfo: data.otherInfo,
      isAnki: data.useAnki,
    };
    if (file64 === undefined || file64 === null || file64.toString() === "") {
      alert("no file selected");
      return;
    }

    await generateBox(data2)
      .then(async (res) => {
        const prog = (await res.json()).id;
        alert("submited, give us 3 - 10 minutes.");
        setData({
          name: "",
          useNames: false,
          useTerminology: false,
          otherInfo: "",
          useAnki: false,
        });
        navigate("/loading?id=" + prog);
        // }
      })
      .catch(() => {});
  };

  const handelFile = () => {
    if (uploadThingy === null) {
      return;
    }
    uploadThingy.current?.click();
  };

  return (
    <div className="px-6 ">
      <input
        type="file"
        className=" invisible"
        ref={uploadThingy}
        onChange={handelFileUpload}
        accept=".pdf"
      ></input>

      <div className="flex flex-col space-x-2 mt-4 text-3xl">
        <p className=" font-semibold">Name</p>
        <input
          type="text"
          value={data.name}
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
          className=" bg-white  text-black px-2  py-2 mt-1  w-full "
        />
      </div>
      <h1 className=" mt-6 text-3xl  font-semibold">Options</h1>
      <div className=" flex">
        <div className=" flex flex-col space-y-14 w-5/12  mt-6">
          <div className="flexalign-middle">
            <p className=" text-3xl  my-auto">use terminology</p>
          </div>
          <div className="flex  align-middle">
            <p className=" text-3xl  my-auto">use peoples names</p>
          </div>
          <div className="flex  align-middle">
            <p className=" text-3xl  my-auto">install anki file</p>
          </div>
        </div>
        <div className=" flex flex-col space-y-9 mt-4">
          <input
            type="checkbox"
            checked={data.useTerminology}
            onChange={(e) => {
              setData({ ...data, useTerminology: e.target.checked });
            }}
            className=" bg-white rounded-md text-black px-1 w-14 h-14  "
          />
          <input
            type="checkbox"
            checked={data.useNames}
            onChange={(e) => {
              setData({ ...data, useNames: e.target.checked });
            }}
            className=" bg-white rounded-md text-black px-1  w-14 h-14 "
          />
          <input
            type="checkbox"
            checked={data.useAnki}
            onChange={(e) => {
              setData({ ...data, useAnki: e.target.checked });
            }}
            className=" bg-white rounded-md text-black px-1 w-14 h-14 "
          />
        </div>
        <div className="w-5/10 px-12  py-2 mt-2 flex  ">
          {file64 === null && uploadThingy !== null ? (
            <button
              className="bg-[#FFF2AA] w-full h-full rounded-md text-4xl"
              onClick={handelFile}
            >
              Upload Document
            </button>
          ) : (
            <div>
              {uploadThingy.current !== null &&
                uploadThingy.current.files !== null && (
                  <div className=" px-6 py-4 bg-[#FFF2AA] rounded-xl">
                    <p className=" text-xl">
                      {uploadThingy.current.files[0].name}
                    </p>
                  </div>
                )}

              <button
                className="bg-[#FFF2AA] py-2 rounded-md text-xl w-full mt-6 "
                onClick={handelFile}
              >
                Replace Document
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col space-x-2 mt-8 text-3xl">
        <p className=" font-semibold">Other Instructions</p>
        <input
          type="text"
          value={data.otherInfo}
          onChange={(e) => {
            setData({ ...data, otherInfo: e.target.value });
          }}
          className=" bg-white  text-black px-2  py-2 mt-1  w-full"
        />
      </div>

      <div className=" flex justify-end mt-10 w-full">
        <button
          className="w-1/3 bg-[#FFF6D0] px-6 py-3 rounded-xl"
          onClick={handelBoxCreate}
        >
          <p className="w-full text-left text-2xl">Submit</p>
        </button>
      </div>
    </div>
  );
};
