// app/store.js
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Box, DEFAULT_COORDS } from './typesAndConstants';

const initialState = {
  boxes: [] as Box[],
};

/**
 * Move the box with the given id to the top of the array.
 */
const moveBoxToTop = (boxes: Box[], id: string) => {
  const box = boxes.find((b) => b.id === id);
  if (box) {
    return boxes.filter((b) => b.id !== id).concat(box);
  }
  return boxes;
};

const boxesSlice = createSlice({
  name: 'boxes',
  initialState,
  reducers: {
    addBox: (state) => {
      state.boxes.push({
        id: crypto.randomUUID(),
        coords: DEFAULT_COORDS,
        isSelected: false,
      });
    },
    removeBox: (state, action: PayloadAction<string>) => {
      const index = state.boxes.findIndex((box) => box.id === action.payload);
      if (index !== -1) {
        state.boxes.splice(index, 1);
      }
    },
    selectBox: (state, action: PayloadAction<string>) => {
      const box = state.boxes.find((b) => b.id === action.payload);
      if (box) {
        box.isSelected = true;
        state.boxes = moveBoxToTop(state.boxes, action.payload);
      }
    },
    deselectBox: (state, action: PayloadAction<string>) => {
      const box = state.boxes.find((b) => b.id === action.payload);
      if (box) {
        box.isSelected = false;
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

export const { addBox, removeBox, selectBox, deselectBox } = boxesSlice.actions;
