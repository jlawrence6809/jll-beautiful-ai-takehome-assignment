// app/store.js
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Box, DEFAULT_COORDS } from './typesAndConstants';

const initialState = {
  boxes: [] as Box[],
};

const boxesSlice = createSlice({
  name: 'boxes',
  initialState,
  reducers: {
    addBox: (state) => {
      state.boxes.push({
        id: crypto.randomUUID(),
        coords: DEFAULT_COORDS,
      });
    },
    removeBox: (state, action: PayloadAction<string>) => {
      const index = state.boxes.findIndex((box) => box.id === action.payload);
      if (index !== -1) {
        state.boxes.splice(index, 1);
      }
    },
  },
});

export const store = configureStore({
  reducer: {
    box: boxesSlice.reducer,
  },
});

export type AppState = {
  box: {
    boxes: Box[];
  };
};

export const findBoxById = (id: string) => (state: AppState) =>
  state.box.boxes.find((box) => box.id === id) as Box;

export const { addBox, removeBox } = boxesSlice.actions;
