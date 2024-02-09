import { useDispatch } from 'react-redux';
import { CONTROL_HEIGHT } from '../typesAndConstants';
import { addBox } from '~/store';

/**
 * WhiteboardControls:
 * Required:
 * - Add Box
 * - Information
 *
 * Optional:
 * - Delete (keyboard shortcut is the alternative)
 * - Undo
 * - Redo
 * - Save (do we store this on the backend?)
 */
export const WhiteboardControls = () => {
  const dispatch = useDispatch();
  const onAddBox = () => {
    dispatch(addBox());
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        height: `${CONTROL_HEIGHT}px`,
      }}
    >
      <button onClick={onAddBox}>Add Box</button>
    </div>
  );
};
