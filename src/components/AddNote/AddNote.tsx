import { FC, useState } from "react";
import { NoteItemType } from "../types";
import { Button, Container, TextField } from "@mui/material";
import { executeDbSyncedAction } from "../../helpers/db";
import { collectTags, formatNoteTags } from "../../helpers/tags";
import styles from './styles.module.css';

type Props = {
  addNoteItem: (noteItem: NoteItemType) => void,
};

export const AddNote: FC<Props> = ({ addNoteItem }) => {
  const [note, setNote] = useState('');

  const addNote = () => {
    if (note.trim() !== '') {
      executeDbSyncedAction((objectStore: any) => {
        const newNote = { id: Date.now(), text: note, tags: collectTags(note) };
        addNoteItem(newNote)
        setNote('');

        objectStore.add(newNote);
      }, 'readwrite');
    }
  };

  return (
    <form onSubmit={addNote} className={styles.formClass}>
      <Container className={styles.inputContainer}>
        <TextField className={styles.inputClass}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          variant="outlined"
        />
        <Container className={styles.inputRenderer}>
          {formatNoteTags(note)}
        </Container>
      </Container>
      <Button className={styles.addButton} variant="contained" onClick={addNote}>
        Add
      </Button>
    </form>
  )
}