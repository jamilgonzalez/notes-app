import { useState } from "react";

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState({
    success: "",
    error: "",
  });

  return {
    open,
    setOpen,
    isError,
    setIsError,
    message,
    setMessage,
  };
};
