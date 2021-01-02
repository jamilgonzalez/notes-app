import { API } from "aws-amplify";
import { createNotes as CreateNotes } from "../graphql/mutations";
import { listNotess } from "../graphql/queries";
import { useState } from "react";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

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
    } catch (err) {
      console.log(err);
    }
    setIsSubmitting(false);
  }

  return {
    fetchNotes,
    createNote,
    notes,
    setNotes,
    isSubmitting,
    setIsSubmitting,
    isFetching,
  };
};
