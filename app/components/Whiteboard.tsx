/* eslint-disable jsx-a11y/no-static-element-interactions */
import { WhiteboardControls } from './WhiteboardControls';
import { WhiteboardBox } from './WhiteboardBox';
import { CONTROL_HEIGHT } from '../typesAndConstants';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppState,
  onMouseDownOnBackground,
  onMouseMove,
  onMouseUp,
  getSafeMouseEvent,
  setWhiteboardArea,
  onDeleteBoxes,
} from '../store';
import { useEffect, useRef } from 'react';

export const Whiteboard = () => {
  const dispatch = useDispatch();
  const boxes = useSelector((state: AppState) => state.box.boxes);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      dispatch(onMouseMove(getSafeMouseEvent(e)));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent | TouchEvent) => {
      dispatch(onMouseUp(getSafeMouseEvent(event)));
    };
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [dispatch]);

  // key check
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(onMouseDownOnBackground());
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        dispatch(onDeleteBoxes());
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  // resize whiteboard area
  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return;
      dispatch(
        setWhiteboardArea({
          width: ref.current.clientWidth,
          height: ref.current.clientHeight,
        }),
      );
    };
    // establish initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <WhiteboardControls />
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '100vw',
          height: `calc(100vh - ${CONTROL_HEIGHT}px)`,
          borderTop: '1px solid grey',
        }}
        onMouseDown={() => dispatch(onMouseDownOnBackground())}
      >
        {boxes.map((box) => (
          <WhiteboardBox key={box.id} boxId={box.id} />
        ))}
      </div>
    </div>
  );
};
