import { Button, Grid, TextField } from "@material-ui/core";
import React, { useState } from "react";

const Form = (props) => {
  const { setIsSubmitting, isSubmitting, createNote, handleToast } = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const clearInputFields = () => {
    setName("");
    setDescription("");
  };

  async function submit() {
    setIsSubmitting(true);
    if (name !== "" && description !== "") {
      const newNote = {
        name: name,
        description: description,
        completed: false,
        id: name,
      };
      const response = await createNote(newNote);

      handleToast(response === 500, {
        success: "Note successfully added.",
        error: "Error adding note.",
      });
      console.log(response);
      if (response === 200) {
        clearInputFields();
        setIsSubmitting(false);
      }
    }
  }

  const getForm = (
    <Grid container className="input-container">
      <Grid item xs={12} className="input-name-item">
        <TextField
          error={name === "" && isSubmitting}
          helperText={name === "" && isSubmitting ? "Please enter name." : null}
          variant="outlined"
          placeholder="Note Name"
          onChange={handleNameChange}
          value={name}
        />
      </Grid>
      <Grid item xs={12} className="input-description-item">
        <TextField
          error={description === "" && isSubmitting}
          helperText={
            description === "" && isSubmitting
              ? "Please enter description."
              : null
          }
          variant="outlined"
          placeholder="Note Description"
          onChange={handleDescriptionChange}
          value={description}
        />
      </Grid>
    </Grid>
  );

  const getButton = (
    <Grid container className="button-container">
      <Button
        variant="outlined"
        className="create-note-button"
        onClick={() => submit()}
      >
        Create Note
      </Button>
    </Grid>
  );

  return (
    <>
      {getForm}
      {getButton}
    </>
  );
};

export default Form;
