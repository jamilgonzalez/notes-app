import "./index.css";

import React, { useEffect } from "react";
import {
  isFailedResponse,
  isSuccessfulResponse,
} from "../../utils/staticUtils";

import { API } from "aws-amplify";
import { Grid } from "@material-ui/core";
import { List } from "antd";
import { onCreateNotes } from "../../graphql/subscriptions";
import produce from "immer";

const styles = {
  input: { margin: 10 },
  item: { textAlign: "left" },
  itemCompleted: {
    textAlign: "left",
    textDecoration: "line-through",
    color: "red",
  },
  p: { color: "#1890ff" },
};

const Notes = (props) => {
  const {
    notes,
    isFetching,
    fetchNotes,
    deleteNote,
    setIsDeleting,
    updateNote,
    handleToast,
    setNotes,
    iCreated,
    setICreated,
  } = props;

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const subscription = API.graphql({
      query: onCreateNotes,
    }).subscribe({
      next: (noteData) => {
        const newNote = noteData.value.data.onCreateNotes;
        const nextState = produce((draftNotes) => {
          draftNotes.push(newNote);
        });

        // TODO: find a better to use this functionality
        if (iCreated) {
          setICreated(false);
          return;
        } else {
          setNotes(nextState(notes));
        }
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  async function submitDeleteNote(item) {
    setIsDeleting(true);

    const response = await deleteNote(item);

    handleToast(isFailedResponse(response), {
      success: "Note successfully deleted.",
      error: "Error deleting note.",
    });

    if (isSuccessfulResponse(response)) {
      setIsDeleting(false);
    }
  }

  async function submitUpdateNote(item) {
    await updateNote(item);
  }

  const getActions = (item) => {
    return [
      // TODO: change onclick to submit changeNote request
      <p className="update-button" onClick={() => submitUpdateNote(item)}>
        {item.completed ? "Completed" : "Mark Completed"}
      </p>,
      <p className="delete-button" onClick={() => submitDeleteNote(item)}>
        Delete
      </p>,
    ];
  };

  const renderItem = (item) => {
    return (
      <List.Item
        style={item.completed === false ? styles.item : styles.itemCompleted}
        actions={getActions(item)}
      >
        <List.Item.Meta title={item.name} description={item.description} />
      </List.Item>
    );
  };

  const getNotes = (
    <Grid item xs={12} className="notes-list-item">
      <List loading={isFetching} dataSource={notes} renderItem={renderItem} />
    </Grid>
  );

  return (
    <Grid
      container
      direction="row"
      style={styles.container}
      className="notes-list-container"
    >
      {getNotes}
    </Grid>
  );
};

export default Notes;
