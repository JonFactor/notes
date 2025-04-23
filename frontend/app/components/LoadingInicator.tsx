import React, { useEffect, useState } from "react";

interface params {
  setProgId: React.Dispatch<React.SetStateAction<string>>;
  progId: string;
}

export default function LoadingInicator({ progId, setProgId }: params) {
  const [percent, setPercent] = useState("0");

  useEffect(() => {
    setInterval(() => {
      if (progId === "" || progId === undefined) {
        return;
      }

      fetch("http://localhost:8000/api/progress/?id=" + progId, {
        method: "GET",
      }).then(async (res) => {
        const data = await res.json();
        console.log(data);
        setPercent((data.status * 100).toString());

        if (data.status === "1") {
          setProgId("");
        }
      });
    }, 5000);
  }, []);

  return <div>Here: {percent}</div>;
}
