/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useDispatch, useSelector } from 'react-redux';
import { deselectBox, findBoxById, selectBox } from '../store';
import { useEffect, useState } from 'react';

type WhiteboardBoxProps = {
  boxId: string;
};

export const WhiteboardBox = ({ boxId }: WhiteboardBoxProps) => {
  const dispatch = useDispatch();
  const box = useSelector(findBoxById(boxId));

  const { coords: boxCoords, isSelected } = box;
  const { top, left, bottom, right } = boxCoords;

  const [wasSelectedBeforeMouseDown, setWasSelectedBeforeMouseDown] =
    useState(isSelected);

  useEffect(() => {
    const handleMouseUp = () => {
      if (!wasSelectedBeforeMouseDown) return;
      dispatch(deselectBox(box.id));
      setWasSelectedBeforeMouseDown(false);
    };
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [box.id, dispatch, wasSelectedBeforeMouseDown]);

  const onMouseDown = (_e: React.MouseEvent) => {
    dispatch(selectBox(box.id));
    // clickStateRef.current = 'mousedown';
    setWasSelectedBeforeMouseDown(isSelected);
  };

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
      onMouseDown={onMouseDown}
    >
      Box{box.id.charAt(0)}
    </div>
  );
};
