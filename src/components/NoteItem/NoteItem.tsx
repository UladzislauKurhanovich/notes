  import { FC, useState } from "react";
  import { NoteItemType } from "../types"
  import { Button, Container, ListItem, ListItemSecondaryAction, ListItemText, TextField } from "@mui/material";
  import { collectTags, formatNoteTags } from "../../helpers/tags";
  import { executeDbSyncedAction } from "../../helpers/db";
  import styles from './styles.module.css';

  type Props = {
    noteItem: NoteItemType,
    editItem: (note: NoteItemType) => void,
    deleteNote: (id: number) => void,
  };

  export const NoteItem: FC<Props> = ({ noteItem, editItem, deleteNote }) => {
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState(noteItem.text);

    const updateNote = () => {
      executeDbSyncedAction((objectStore: any) => {
        const tags = collectTags(inputValue);

        editItem({
          ...noteItem,
          text: inputValue,
          tags
        });

        const editRequest = objectStore.get(noteItem.id);

        editRequest.onsuccess = () => {
          const note = editRequest.result;
          note.text = inputValue;
          note.tags = tags;
          objectStore.put(note);
        }

        setEditMode(false);
      }, 'readwrite');
    };

    return (
      <>
        {!editMode
          ? (
            <ListItem className={styles.notesList} key={noteItem.id}>
              <ListItemText primary={formatNoteTags(noteItem.text)} />
              <ListItemSecondaryAction>
                <Button onClick={() => setEditMode(true)}>Edit</Button>
                <Button onClick={() => deleteNote(noteItem.id)}>Delete</Button>
              </ListItemSecondaryAction>
            </ListItem>
          ) : (
            <form onSubmit={updateNote} className={styles.formClass}>
              <Container className={styles.inputContainer}>
                <TextField className={styles.inputClass}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  variant="outlined"
                />
                <Container className={styles.inputRenderer}>
                  {formatNoteTags(inputValue)}
                </Container>
              </Container>
              <Container className={styles.updButtonWraper}>
                <Button variant="contained" onClick={updateNote}>
                  Update
                </Button>
                <Button variant="contained" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </Container>
            </form>
          )}

      </>
    )
  }