import "antd/dist/antd.css";
import "./App.css";

import Form from "./components/Form/index";
import { Grid } from "@material-ui/core";
import Notes from "./components/NotesList";
import React from "react";
import Toast from "./components/Toast";
import { useNotes } from "./hooks/useNotes";
import { useToast } from "./hooks/useToast";

function App() {
  const {
    notes,
    isSubmitting,
    setIsSubmitting,
    fetchNotes,
    createNote,
    isFetching,
    deleteNote,
    isDeleting,
    setIsDeleting,
  } = useNotes();

  const {
    open,
    setOpen,
    isError,
    setIsError,
    message,
    setMessage,
  } = useToast();

  const handleToast = (error, message) => {
    if (error) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setMessage(message);
    setOpen(true);
  };

  const getForm = (
    <Form
      setIsSubmitting={setIsSubmitting}
      isSubmitting={isSubmitting}
      createNote={createNote}
      handleToast={handleToast}
    />
  );

  const getNotes = (
    <Notes
      notes={notes}
      isFetching={isFetching}
      fetchNotes={fetchNotes}
      deleteNote={deleteNote}
      setIsDeleting={setIsDeleting}
      handleToast={handleToast}
    />
  );
  const getToast = (
    <Toast open={open} setOpen={setOpen} isError={isError} message={message} />
  );

  return (
    <Grid className="app-container">
      {getForm}
      {getNotes}
      {open && getToast}
    </Grid>
  );
}

export default App;
