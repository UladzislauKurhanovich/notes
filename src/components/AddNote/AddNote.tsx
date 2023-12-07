import { FC, useState } from "react";
import { NoteItemType } from "../types";
import { Button, TextField } from "@mui/material";
import { executeDbSyncedAction } from "../../helpers/db";
import { collectTags, formatNoteTags } from "../../helpers/tags";

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
    <form onSubmit={addNote} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <div style={{
        width: '550px',
        height: '3rem',
        fontSize: '16px',
        position: 'relative',
        marginBottom: '20px',
        marginRight: '10px'
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
          value={note}
          onChange={(e) => setNote(e.target.value)}
          variant="outlined"
        />
        <div style={{
          paddingTop: '10px',
          paddingLeft: '2px',
          position: 'absolute',
          margin: '10px 10px',
        }}
        >
          {formatNoteTags(note)}
        </div>
      </div>
      <Button variant="contained" onClick={addNote} style={{ height: '50px', marginBottom: '10px' }}>
        Add
      </Button>
    </form>
  )
}