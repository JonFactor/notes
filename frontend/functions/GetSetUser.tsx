import { v4 as uuidv4 } from "uuid";
export const getSetUser = () => {
  const ummmkey = "flashcardappkeythingy";
  let id = localStorage.getItem(ummmkey);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(ummmkey, id);
  }
  return id;
};
