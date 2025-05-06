export const getSetUser = () => {
  const ummmkey = "flashcardappkeythingy";
  let id = localStorage.getItem(ummmkey);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ummmkey, id);
  }
  return id;
};
