import {
  createNotes as CreateNotes,
  deleteNotes as DeleteNotes,
} from "../graphql/mutations";

import { API } from "aws-amplify";
import { listNotess } from "../graphql/queries";
import { useState } from "react";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchNotes() {
    setIsFetching(true);
    try {
      const notesData = await API.graphql({
        query: listNotess,
      });
      setNotes(notesData.data.listNotess.items);
    } catch (err) {
      console.log(err);
    }
    setIsFetching(false);
  }

  async function createNote(newNote) {
    setIsSubmitting(true);
    try {
      await API.graphql({
        query: CreateNotes,
        variables: { input: newNote },
      });
      setNotes([...notes, newNote]);
      setIsSubmitting(false);
      return 200;
    } catch (err) {
      console.log(err);
      return 500;
    }
  }

  async function deleteNote({ id }) {
    // delete from db
    setIsDeleting(true);
    try {
      await API.graphql({
        query: DeleteNotes,
        variables: { input: { id } },
      });
      // delete from state
      setNotes(notes.filter((note) => note.id !== id));
      setIsDeleting(false);
      return 200;
    } catch (err) {
      console.log(err);
      return 500;
    }
  }

  return {
    fetchNotes,
    createNote,
    notes,
    setNotes,
    isSubmitting,
    setIsSubmitting,
    isFetching,
    deleteNote,
    isDeleting,
    setIsDeleting,
  };
};
