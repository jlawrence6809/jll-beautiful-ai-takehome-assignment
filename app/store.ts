import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Box, DEFAULT_COORDS, Direction } from './typesAndConstants';

const initialState = {
  boxes: [] as Box[],
  whiteboardArea: { width: 0, height: 0 },
  isDragging: false,
  resizingDirection: 'idle' as Direction | 'idle',
  mouseDownCoords: { x: 0, y: 0 },

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
      state.mouseDownCoords = action.payload;
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
      state.mouseDownCoords = coords;
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
    onMouseDownOnResizeHandle: (
      state,
      action: PayloadAction<{
        id: string;
        direction: Direction;
        event: SafeMouseEvent;
      }>,
    ) => {
      state.mouseDownCoords = action.payload.event.coords;
      state.mouseDownOnBoxId = action.payload.id;
      state.resizingDirection = action.payload.direction;
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
      const { x, y } = action.payload;
      let dx = x - state.mouseDownCoords.x;
      let dy = y - state.mouseDownCoords.y;
      const { width, height } = state.whiteboardArea;

      state.mouseDownCoords = { x, y };

      if (state.isDragging) {
        state.mouseDraggedSinceMouseDown = true;
        const selectedBoxes = state.boxes.filter((b) => b.isSelected);

        // Prevent the box from being dragged outside the whiteboard area by adjusting dx and dy.
        const minTop = Math.min(...selectedBoxes.map((b) => b.coords.top));
        const minLeft = Math.min(...selectedBoxes.map((b) => b.coords.left));
        const maxBottom = Math.max(
          ...selectedBoxes.map((b) => b.coords.bottom),
        );
        const maxRight = Math.max(...selectedBoxes.map((b) => b.coords.right));
        dy = Math.max(-minTop, Math.min(height - maxBottom, dy));
        dx = Math.max(-minLeft, Math.min(width - maxRight, dx));

        selectedBoxes.forEach((box) => {
          if (box) {
            box.coords = {
              top: box.coords.top + dy,
              bottom: box.coords.bottom + dy,
              left: box.coords.left + dx,
              right: box.coords.right + dx,
            };
          }
        });
      } else if (state.resizingDirection !== 'idle') {
        const box = getBox(state.boxes, state.mouseDownOnBoxId);

        if (box) {
          if (state.resizingDirection === 'top') {
            box.coords.top = Math.max(
              0,
              Math.min(box.coords.top + dy, box.coords.bottom),
            );
          } else if (state.resizingDirection === 'bottom') {
            box.coords.bottom = Math.max(
              box.coords.top,
              Math.min(height, box.coords.bottom + dy),
            );
          } else if (state.resizingDirection === 'left') {
            box.coords.left = Math.max(
              0,
              Math.min(box.coords.left + dx, box.coords.right),
            );
          } else if (state.resizingDirection === 'right') {
            box.coords.right = Math.max(
              box.coords.left,
              Math.min(width, box.coords.right + dx),
            );
          }
        }
      }
    },
    setWhiteboardArea: (
      state,
      action: PayloadAction<{ width: number; height: number }>,
    ) => {
      state.whiteboardArea = action.payload;
    },
    onDeleteBoxes: (state) => {
      state.boxes = state.boxes.filter((box) => !box.isSelected);
      state.mouseDownOnBoxId = '';
      state.isDragging = false;
      state.mouseDraggedSinceMouseDown = false;
      state.resizingDirection = 'idle';
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
  onMouseDownOnResizeHandle,
  onMouseUp,
  onMouseMove,
  setWhiteboardArea,
  onDeleteBoxes,
} = boxesSlice.actions;
