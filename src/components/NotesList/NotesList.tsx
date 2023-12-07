import React, { useState } from 'react';

import {
  Button,
  Container,
  List,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NoteItemType } from '../types';
import { addNote, editNote, removeNote } from '../../redux/slice';
import { AddNote } from '../AddNote/AddNote';
import { NoteItem } from '../NoteItem/NoteItem';
import { RootState } from '../../redux/store';
import { executeDbSyncedAction } from '../../helpers/db';

export default function NotesList() {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.notesList.notes)
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const addNoteItem = (noteItem: NoteItemType) => dispatch(addNote(noteItem));
  const editItem = (noteItem: NoteItemType) => dispatch(editNote(noteItem));
  const deleteNote = (id: number) => {
    executeDbSyncedAction((objectStore: any) => {
      dispatch(removeNote(id));

      objectStore.delete(id);
    }, 'readwrite');
  };

  const updateSelectedTags = (targetTag: string): void => {
    if (selectedTags.includes(targetTag)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== targetTag));
    } else {
      setSelectedTags([...selectedTags, targetTag])
    }
  }

  const filterNotesByTags = () => notes.filter(note => !selectedTags.length || selectedTags.every(tag => note.tags.includes(tag)));

  const allTags = notes.flatMap((note) => note.tags);
  const uniqueTags = allTags.filter((tag, index) => allTags.indexOf(tag) === index);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" align="center" marginTop={'20px'} gutterBottom>
        Notes
      </Typography>
      <AddNote addNoteItem={addNoteItem} />
      <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: '16px' }}>
        {uniqueTags.map(tag => {
          return <p
            style={{
              border: '1px solid gray',
              borderRadius: '5px',
              marginBottom: '0',
              marginRight: '3px',
              padding: '5px',
              backgroundColor: selectedTags.includes(tag) ? '#add8e6' : 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => updateSelectedTags(tag)}>
            {tag}
          </p>
        })}
      </Container>
      <Button variant="contained" onClick={() => setSelectedTags([])}>
        Remove all filters
      </Button>
      <List style={{ borderTop: '1px solid gray', marginTop: '20px' }}>
        {
          filterNotesByTags().map((note: NoteItemType) => (<NoteItem noteItem={note} deleteNote={deleteNote} editItem={editItem} />))}
      </List>
    </Container>
  );
}
