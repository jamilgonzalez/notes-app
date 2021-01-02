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
  const { notes, isFetching, fetchNotes } = props;

  const renderItem = (item) => {
    return (
      <List.Item style={styles.item}>
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
