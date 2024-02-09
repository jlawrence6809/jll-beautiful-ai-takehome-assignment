import { useDispatch, useSelector } from 'react-redux';
import { CONTROL_HEIGHT } from '../typesAndConstants';
import { AppState, addBox, onDeleteBoxes } from '~/store';

/**
 * WhiteboardControls:
 * Required:
 * - Add Box
 * - Delete
 *
 * Optional:
 * - Undo
 * - Redo
 * - Save (do we store this on the backend?)
 */
export const WhiteboardControls = () => {
  const dispatch = useDispatch();
  const areAnyBoxesSelected = useSelector((state: AppState) =>
    state.box.boxes.some((box) => box.isSelected),
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '1rem',
        padding: '1rem',
        height: `${CONTROL_HEIGHT}px`,
      }}
    >
      <button onClick={() => dispatch(addBox())}>Add Box</button>
      <button
        onClick={() => dispatch(onDeleteBoxes())}
        disabled={!areAnyBoxesSelected}
      >
        Delete Box(es)
      </button>
    </div>
  );
};
