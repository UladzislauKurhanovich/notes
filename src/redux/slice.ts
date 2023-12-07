import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { NoteItemType } from '../components/types';

interface NotesListState {
  notes: NoteItemType[];
}

const initialState: NotesListState = {
  notes: [],
};

export const notesListSlice = createSlice({
  name: 'notesList',
  initialState,
  reducers: {
    addNote: (state: NotesListState, action: PayloadAction<NoteItemType>) => {
      state.notes.push(action.payload);
    },
    removeNote: (state, action: PayloadAction<number>) => {
      const index = state.notes.findIndex(({ id }) => id === action.payload);
      state.notes.splice(index, 1);
    },
    editNote: (state, action: PayloadAction<NoteItemType>) => {
      const index = state.notes.findIndex(({ id }) => id === action.payload.id);
      state.notes[index] = {
        ...state.notes[index],
        ...action.payload,
      };
    },
  },
});

export const { addNote, removeNote, editNote } = notesListSlice.actions;

export default notesListSlice.reducer;