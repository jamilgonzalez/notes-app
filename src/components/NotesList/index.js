import "./index.css";

import React, { useEffect } from "react";

import { Grid } from "@material-ui/core";
import { List } from "antd";

const styles = {
  input: { margin: 10 },
  item: { textAlign: "left" },
  p: { color: "#1890ff" },
};

const Notes = (props) => {
  const {
    notes,
    isFetching,
    fetchNotes,
    deleteNote,
    setIsDeleting,
    handleToast,
  } = props;

  async function handleDeleteNote(item) {
    setIsDeleting(true);
    const response = await deleteNote(item);

    handleToast(response === 500, {
      success: "Note successfully deleted.",
      error: "Error deleting note.",
    });

    if (response === 200) {
      setIsDeleting(false);
    }
  }

  const renderItem = (item) => {
    return (
      <List.Item
        style={styles.item}
        actions={[
          <p className="delete-button" onClick={() => handleDeleteNote(item)}>
            Delete
          </p>,
        ]}
      >
        <List.Item.Meta title={item.name} description={item.description} />
      </List.Item>
    );
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNotes = (
    <Grid
      container
      direction="row"
      style={styles.container}
      className="notes-list-container"
    >
      <Grid item xs={12} className="notes-list-item">
        <List loading={isFetching} dataSource={notes} renderItem={renderItem} />
      </Grid>
    </Grid>
  );

  return getNotes;
};

export default Notes;
