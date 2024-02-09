/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useSelector } from 'react-redux';
import { findBoxById } from '../store';

type WhiteboardBoxProps = {
  boxId: string;
};

export const WhiteboardBox = ({ boxId }: WhiteboardBoxProps) => {
  const box = useSelector(findBoxById(boxId));

  const { coords: boxCoords } = box;
  const { top, left, bottom, right } = boxCoords;

  return (
    <div
      style={{
        position: 'absolute',
        border: '1px solid black',
        backgroundColor: 'lightgrey',
        top,
        left,
        height: bottom - top,
        width: right - left,
      }}
    >
      Box{box.id.charAt(0)}
    </div>
  );
};
