import { configureStore } from '@reduxjs/toolkit';
import notesListReducer from './slice';

export const store = configureStore({
  reducer: {
    notesList: notesListReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
