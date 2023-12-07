import React, { useEffect, useState } from 'react';
import './App.css';
import NotesList from './components/NotesList/NotesList';
import { NoteItemType } from './components/types';
import { addNote } from './redux/slice';
import { useDispatch } from 'react-redux';
import { executeDbSyncedAction } from './helpers/db';

function App() {
  const dispatch = useDispatch();
  const addNoteItem = (noteItem: NoteItemType) => dispatch(addNote(noteItem));
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  useEffect(() => {
    executeDbSyncedAction((objectStore: any) => {
      if (!isDbLoaded) {
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
          getAllRequest.result.map((item: NoteItemType) => addNoteItem(item));
          setIsDbLoaded(true)
        };
      }
    });
  }, []);

  return (
    <NotesList />
  );
}

export default App;
