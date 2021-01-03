import {
  createNotes as CreateNotes,
  deleteNotes as DeleteNotes,
  updateNotes as UpdateNotes,
} from "../graphql/mutations";

import { API } from "aws-amplify";
import { listNotess } from "../graphql/queries";
import produce from "immer";
import { useState } from "react";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [iCreated, setICreated] = useState(false);

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
    // add note to db
    setIsSubmitting(true);
    try {
      await API.graphql({
        query: CreateNotes,
        variables: { input: newNote },
      });
      // add to state
      setNotes([...notes, newNote]);
      setIsSubmitting(false);
      setICreated(true);
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

  async function updateNote(updatedNote) {
    setIsUpdating(true);

    // Optimistic update
    // O(n), use map for notes to get O(1)
    const index = notes.findIndex((note) => note.id === updatedNote.id);
    const nextState = produce((draftNotes) => {
      draftNotes[index] = {
        ...updatedNote,
        completed: !updatedNote.completed,
      };
    });
    setNotes(nextState(notes));

    try {
      // submits an update to the opposite of current completed state
      await API.graphql({
        query: UpdateNotes,
        variables: {
          input: { id: updatedNote.id, completed: !updatedNote.completed },
        },
      });
      setIsUpdating(false);
      return 200;
    } catch (err) {
      console.log(err);
      setIsUpdating(false);
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
    isUpdating,
    setIsUpdating,
    updateNote,
    iCreated,
    setICreated,
  };
};
