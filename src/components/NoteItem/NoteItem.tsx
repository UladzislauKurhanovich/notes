  import { FC, useState } from "react";
  import { NoteItemType } from "../types"
  import { Button, Container, ListItem, ListItemSecondaryAction, ListItemText, TextField } from "@mui/material";
  import { collectTags, formatNoteTags } from "../../helpers/tags";
  import { executeDbSyncedAction } from "../../helpers/db";

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
            <ListItem style={{display: 'flex', width: '400px', overflow:'auto'}} key={noteItem.id}>
              <ListItemText primary={formatNoteTags(noteItem.text)} />
              <ListItemSecondaryAction>
                <Button onClick={() => setEditMode(true)}>Edit</Button>
                <Button onClick={() => deleteNote(noteItem.id)}>Delete</Button>
              </ListItemSecondaryAction>
            </ListItem>
          ) : (
            <form onSubmit={updateNote} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '550px',
                height: '3rem',
                fontSize: '16px',
                position: 'relative',
                marginBottom: '20px',
                marginRight: '10px',
              }}
              >
                <TextField style={{
                  width: '100%',
                  position: 'absolute',
                  inset: '0',
                  zIndex: '1',
                  outline: 'none',
                  fontSize: '16px',
                  background: 'transparent',
                  WebkitTextFillColor: 'transparent',
                }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  variant="outlined"
                />
                <div style={{
                  paddingTop: '10px',
                  paddingLeft: '2px',
                  position: 'absolute',
                  margin: '10px 10px',
                }}
                >
                  {formatNoteTags(inputValue)}
                </div>
              </div>
              <Container style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '220px', paddingRight: '0px' }}>
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