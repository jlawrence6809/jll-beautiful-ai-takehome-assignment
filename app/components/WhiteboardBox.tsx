/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useDispatch, useSelector } from 'react-redux';
import { findBoxById, onMouseDownOnBox } from '../store';
import { getSafeMouseEvent } from '~/store';

type WhiteboardBoxProps = {
  boxId: string;
};

export const WhiteboardBox = ({ boxId }: WhiteboardBoxProps) => {
  const dispatch = useDispatch();
  const box = useSelector(findBoxById(boxId));

  const { coords: boxCoords, isSelected } = box;
  const { top, left, bottom, right } = boxCoords;

  return (
    <div
      style={{
        position: 'absolute',
        border: '1px solid black',
        backgroundColor: isSelected ? 'blue' : 'lightgrey',
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
      Box{box.id.charAt(0)}
    </div>
  );
};
