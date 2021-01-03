export const isFormValid = (name, description) => {
  if (name === "" && description === "") {
    return false;
  } else {
    return true;
  }
};
