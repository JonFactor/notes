import axios from "axios";
const server = "192.168.1.141:8000";

export const deleteBox = async (id: string, userId: string) => {
  return await fetch(`http://${server}/api/card/?id=${id}&userId=${userId}`, {
    method: "DELETE",
  });
};
