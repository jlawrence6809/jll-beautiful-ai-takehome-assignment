// app/store.js
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Box, DEFAULT_COORDS } from './typesAndConstants';

const initialState = {
  boxes: [] as Box[],
  isDragging: false,
  initialDragCoords: { x: 0, y: 0 },

  mouseDownOnBoxId: '',
  mouseDownBoxWasPreviouslySelected: false,
  mouseDraggedSinceMouseDown: false,
};

/**
 * Move the box with the given id to the top of the array.
 */
const moveBoxToTop = (boxes: Box[], id: string) => {
  const index = boxes.findIndex((box) => box.id === id);
  const box = boxes[index];
  if (index !== -1) {
    boxes.splice(index, 1);
    boxes.push(box);
  }
};

const getBox = (boxes: Box[], id: string) => {
  return boxes.find((box) => box.id === id) as Box;
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
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    setInitialDragCoords: (
      state,
      action: PayloadAction<{ x: number; y: number }>,
    ) => {
      state.initialDragCoords = action.payload;
    },
    onMouseDownOnBackground: (state) => {
      state.boxes.forEach((box) => {
        box.isSelected = false;
      });
    },
    onMouseDownOnBox: (
      state,
      action: PayloadAction<{ id: string; event: SafeMouseEvent }>,
    ) => {
      const { id, event } = action.payload;
      const { multiSelectKey, coords } = event;
      const box = getBox(state.boxes, id);
      const maintainSelectionOfOtherBoxes =
        // If the user is holding the multi-select key, we don't want to clear
        multiSelectKey ||
        (box.isSelected && state.boxes.filter((b) => b.isSelected).length > 1);

      state.isDragging = true;
      state.initialDragCoords = coords;
      state.mouseDownOnBoxId = id;
      state.mouseDownBoxWasPreviouslySelected = box.isSelected;
      box.isSelected = true;

      moveBoxToTop(state.boxes, id);

      if (!maintainSelectionOfOtherBoxes) {
        state.boxes
          .filter((b) => b.id !== id)
          .forEach((b) => {
            b.isSelected = false;
          });
      }
    },
    onMouseUp: (state, action: PayloadAction<SafeMouseEvent>) => {
      if (!state.mouseDownOnBoxId) return;
      const box = getBox(state.boxes, state.mouseDownOnBoxId);
      if (
        state.mouseDownBoxWasPreviouslySelected &&
        !state.mouseDraggedSinceMouseDown
      ) {
        box.isSelected = false;

        if (!action.payload.multiSelectKey) {
          state.boxes.forEach((b) => {
            b.isSelected = false;
          });
        }
      }
      state.mouseDownOnBoxId = '';
      state.isDragging = false;
      state.mouseDraggedSinceMouseDown = false;
    },
    onMouseMove: (state, action: PayloadAction<{ x: number; y: number }>) => {
      if (state.isDragging) {
        const { x, y } = action.payload;
        const dx = x - state.initialDragCoords.x;
        const dy = y - state.initialDragCoords.y;

        state.initialDragCoords = { x, y };
        state.mouseDraggedSinceMouseDown = true;

        state.boxes
          .filter((b) => b.isSelected)
          .forEach((box) => {
            if (box) {
              box.coords = {
                top: box.coords.top + dy,
                bottom: box.coords.bottom + dy,
                left: box.coords.left + dx,
                right: box.coords.right + dx,
              };
            }
          });
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
  box: typeof initialState;
};

export const findBoxById = (id: string) => (state: AppState) =>
  state.box.boxes.find((box) => box.id === id) as Box;

/**
 * Get properties from mouse event that are safe to use in a Redux action.
 */
export const getSafeMouseEvent = (e: MouseEvent | React.MouseEvent) => {
  return {
    multiSelectKey: e.metaKey || e.ctrlKey || e.shiftKey,
    coords: { x: e.clientX, y: e.clientY },
  };
};

type SafeMouseEvent = ReturnType<typeof getSafeMouseEvent>;

export const {
  addBox,
  removeBox,
  setIsDragging,
  setInitialDragCoords,
  onMouseDownOnBackground,
  onMouseDownOnBox,
  onMouseUp,
  onMouseMove,
} = boxesSlice.actions;
