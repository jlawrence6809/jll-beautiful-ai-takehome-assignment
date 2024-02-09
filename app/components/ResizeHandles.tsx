/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useDispatch } from 'react-redux';
import { onMouseDownOnResizeHandle, getSafeMouseEvent } from '~/store';
import { Direction } from '~/typesAndConstants';

const DRAG_HANDLE_SIZE = 20;

type DragHandleProps = {
  id: string;
};

export const ResizeHandles = ({ id }: DragHandleProps) => {
  const dispatch = useDispatch();
  const onMouseDown = (event: React.MouseEvent, direction: Direction) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(
      onMouseDownOnResizeHandle({
        id,
        direction,
        event: getSafeMouseEvent(event),
      }),
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <div
        onMouseDown={(event) => onMouseDown(event, 'top')}
        style={{
          position: 'absolute',
          top: `-${DRAG_HANDLE_SIZE / 2}px`,
          left: `calc(50% - ${DRAG_HANDLE_SIZE / 2}px)`,
          width: DRAG_HANDLE_SIZE,
          height: DRAG_HANDLE_SIZE,
          backgroundColor: 'red',
          cursor: 'n-resize',
        }}
      ></div>

      <div
        onMouseDown={(event) => onMouseDown(event, 'left')}
        style={{
          position: 'absolute',
          left: `-${DRAG_HANDLE_SIZE / 2}px`,
          top: `calc(50% - ${DRAG_HANDLE_SIZE / 2}px)`,
          width: DRAG_HANDLE_SIZE,
          height: DRAG_HANDLE_SIZE,
          backgroundColor: 'red',
          cursor: 'w-resize',
        }}
      ></div>

      <div
        onMouseDown={(event) => onMouseDown(event, 'right')}
        style={{
          position: 'absolute',
          right: `-${DRAG_HANDLE_SIZE / 2}px`,
          top: `calc(50% - ${DRAG_HANDLE_SIZE / 2}px)`,
          width: DRAG_HANDLE_SIZE,
          height: DRAG_HANDLE_SIZE,
          backgroundColor: 'red',
          cursor: 'e-resize',
        }}
      ></div>

      <div
        onMouseDown={(event) => onMouseDown(event, 'bottom')}
        style={{
          position: 'absolute',
          bottom: `-${DRAG_HANDLE_SIZE / 2}px`,
          left: `calc(50% - ${DRAG_HANDLE_SIZE / 2}px)`,
          width: DRAG_HANDLE_SIZE,
          height: DRAG_HANDLE_SIZE,
          backgroundColor: 'red',
          cursor: 's-resize',
        }}
      ></div>
    </div>
  );
};
