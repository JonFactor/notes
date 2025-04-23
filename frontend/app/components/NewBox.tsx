import React, { useEffect, useRef, useState } from "react";

interface params {
  parrentSetter: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshPlease: React.Dispatch<React.SetStateAction<boolean>>;
  refreshPlease: boolean;
  setProgId: React.Dispatch<React.SetStateAction<string>>;
}

export const NewBox = ({
  parrentSetter,
  setRefreshPlease,
  refreshPlease,
  setProgId,
}: params) => {
  const [data, setData] = useState({
    name: "",
    useNames: false,
    useTerminology: false,
    otherInfo: "",
    useAnki: false,
  });

  const uploadThingy = useRef<HTMLInputElement>(null);

  const handelLeave = () => {
    setData({
      name: "",
      useNames: false,
      useTerminology: false,
      otherInfo: "",
      useAnki: false,
    });
    parrentSetter(false);
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

  const handelBoxCreate = () => {
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

    fetch("http://127.0.0.1:8000/api/generate/", {
      method: "POST",
      body: JSON.stringify(data2),
      headers: { "content-type": "application/json" },
    })
      .then(async (res) => {
        setRefreshPlease(!refreshPlease);

        const prog = (await res.json()).id;
        console.log(prog);
        setProgId(prog);
        // }
      })
      .catch(() => {
        alert("A Problem Occured Please Try Again Later.");
      });
    alert("submited, give us 3 - 10 minutes.");
    setData({
      name: "",
      useNames: false,
      useTerminology: false,
      otherInfo: "",
      useAnki: false,
    });
    parrentSetter(false);
  };

  const handelFile = () => {
    if (uploadThingy === null) {
      return;
    }
    uploadThingy.current?.click();
  };

  return (
    <>
      <input
        type="file"
        className=" invisible"
        ref={uploadThingy}
        onChange={handelFileUpload}
        accept=".pdf"
      ></input>

      {file64 === null && uploadThingy !== null ? (
        <button
          className="bg-gray-700 py-2 rounded-md text-lg"
          onClick={handelFile}
        >
          Upload Document
        </button>
      ) : (
        <div>
          <p className=" text-xl">{uploadThingy.current.files[0].name}</p>
          <p>{uploadThingy.current.files[0].type}</p>
          <button
            className="bg-gray-400 py-2 rounded-md text-lg w-full mt-6"
            onClick={handelFile}
          >
            Replace Document
          </button>
        </div>
      )}

      <div className="flex space-x-2 mt-4">
        <p>Name</p>
        <input
          type="text"
          value={data.name}
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
          className=" bg-white rounded-md text-black px-1  w-full "
        />
      </div>
      <div className=" grid  grid-cols-2">
        <div className="flex space-x-2 mt-4">
          <p>Use Terms</p>
          <input
            type="checkbox"
            checked={data.useTerminology}
            onChange={(e) => {
              setData({ ...data, useTerminology: e.target.checked });
            }}
            className=" bg-white rounded-md text-black px-1 "
          />
        </div>
        <div className="flex space-x-2 mt-4">
          <p>Use Peoples Names</p>
          <input
            type="checkbox"
            checked={data.useNames}
            onChange={(e) => {
              setData({ ...data, useNames: e.target.checked });
            }}
            className=" bg-white rounded-md text-black px-1 "
          />
        </div>
        <div className="flex space-x-2 mt-4">
          <p>Install Anki File</p>
          <input
            type="checkbox"
            checked={data.useAnki}
            onChange={(e) => {
              setData({ ...data, useAnki: e.target.checked });
            }}
            className=" bg-white rounded-md text-black px-1 "
          />
        </div>
      </div>

      <div className="flex flex-col space-x-2 mt-4">
        <p>Other Instructions:</p>
        <input
          type="text"
          value={data.otherInfo}
          onChange={(e) => {
            setData({ ...data, otherInfo: e.target.value });
          }}
          className=" bg-white rounded-md text-black px-1 mt-1"
        />
      </div>

      <div className=" flex space-x-2 mt-4">
        <button className="px-2 bg-red-800" onClick={handelLeave}>
          <p>cancel</p>
        </button>
        <button className="w-full bg-green-800" onClick={handelBoxCreate}>
          <p>submit</p>
        </button>
      </div>
    </>
  );
};
