/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useDispatch, useSelector } from 'react-redux';
import { AppState, findBoxById, onMouseDownOnBox } from '../store';
import { getSafeMouseEvent } from '~/store';
import { ResizeHandles } from '~/components/ResizeHandles';

type WhiteboardBoxProps = {
  boxId: string;
};

export const WhiteboardBox = ({ boxId }: WhiteboardBoxProps) => {
  const dispatch = useDispatch();
  const box = useSelector(findBoxById(boxId));
  const isOnlyBoxSelected = useSelector((state: AppState) => {
    const selectedBoxes = state.box.boxes.filter((b) => b.isSelected);
    return selectedBoxes.length === 1 && selectedBoxes[0].id === box.id;
  });

  const { coords: boxCoords, isSelected } = box;
  const { top, left, bottom, right } = boxCoords;

  return (
    <div
      style={{
        position: 'absolute',
        border: '1px solid black',
        backgroundColor: isSelected ? 'blue' : 'lightgrey',
        opacity: 0.7,
        top,
        left,
        height: bottom - top,
        width: right - left,
      }}
      onMouseDown={(event) => {
        // Prevent the background from being clicked when a box is clicked.
        event.stopPropagation();
        dispatch(
          onMouseDownOnBox({ id: box.id, event: getSafeMouseEvent(event) }),
        );
      }}
    >
      {isOnlyBoxSelected && <ResizeHandles id={boxId} />}
    </div>
  );
};
