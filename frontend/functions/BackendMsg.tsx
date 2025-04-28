import axios from "axios";
const server = `localhost`;

export const deleteCard = async (id: string, userId: string) => {
  return await fetch(
    `http://${server}:8000/api/card/?id=${id}&userId=${userId}`,
    {
      method: "DELETE",
    }
  );
};

export const generateBox = (data: any) => {
  return fetch(`http://${server}:8000/api/generate/`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  });
};

export const getProgress = (id: any) => {
  return fetch(`http://${server}:8000/api/progress/?id=` + id, {
    method: "GET",
  });
};

export const getUserBoxs = async (user: any) => {
  return await fetch(`http://${server}:8000/api/boxlist/?user=${user}`, {
    method: "GET",
  });
};

export const updateProgressBox = async (body: any) => {
  return await fetch(`http://${server}:8000/api/box/`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    return false;
  });
};

export const getCards = async (id: any, userId: any) => {
  return await fetch(
    `http://${server}:8000/api/box/?id=${id}&userId=${userId}`
  );
};

export const deleteBox = async (id: any, userId: any) => {
  return await fetch(
    `http://${server}:8000/api/box/?id=${id}&userId=${userId}`,
    {
      method: "DELETE",
      body: JSON.stringify({ id: id, userId: userId }),
    }
  );
};

export const getBoxSpecifics = async (id: any, userId: any) => {
  return await fetch(
    `http://${server}:8000/api/boxSpecifics/?id=${id}&userId=${userId}`,
    {
      method: "GET",
    }
  );
};
