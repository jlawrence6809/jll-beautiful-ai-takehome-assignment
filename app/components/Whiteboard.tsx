import { WhiteboardControls } from './WhiteboardControls';
import { WhiteboardBox } from './WhiteboardBox';
import { CONTROL_HEIGHT } from '../typesAndConstants';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, onMouseMove, onMouseUp } from '../store';
import { useEffect } from 'react';

/*
Hi Jeremy,

Thanks so much for meeting with Igor this week. He enjoyed the chat! The next step will be a take home project. Please find more details below: 

Prompt:
Build a web app that implements a whiteboard with the ability to add resizable and movable boxes to it using React and javascript. Optionally implement multi select and multi drag. Do not implement styling, focus on the moving/scaling functionality and overall architecture and flexibility of the app.

Delivery:
Github public link preferred but any platform you choose to submit is fine.

Deadline: 
We have no time constraints on this project with you but recommend a submission within the next week or so.

Next Steps:
After we receive your submission, we will take some time to review, and schedule an additional chat with Igor to walk through your decision process and overall review on this project.

Let me know if you have any questions or would like any clarification on this request.

Talk Soon,
Em
 */

/*
 TODO:

 - Drag
 - Resizing
 - Multi-select
 - Refine deselection behavior
 - Box collision resolution
 - Whiteboard edge collision

*/

export const Whiteboard = () => {
  const dispatch = useDispatch();
  const boxes = useSelector((state: AppState) => state.box.boxes);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      dispatch(onMouseMove({ x: e.clientX, y: e.clientY }));
    };
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleMouseUp = () => {
      dispatch(onMouseUp());
    };
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
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
        style={{
          position: 'relative',
          width: '100vw',
          height: `calc(100vh - ${CONTROL_HEIGHT}px)`,
          borderTop: '1px solid grey',
        }}
      >
        {boxes.map((box) => (
          <WhiteboardBox key={box.id} boxId={box.id} />
        ))}
      </div>
    </div>
  );
};
