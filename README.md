# Beautiful.ai takehome assignment

## Prompt

Build a web app that implements a whiteboard with the ability to add resizable and movable boxes to it using React and javascript. Optionally implement multi select and multi drag. Do not implement styling, focus on the moving/scaling functionality and overall architecture and flexibility of the app.

## Deliverables

- [x] Github public link preferred but any platform you choose to submit is fine.

## Deadline

We have no time constraints on this project with you but recommend a submission within the next week or so.

## Frameworks and Libraries

- Remix.run
- Redux toolkit

## How to run the app

1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`
4. Open your browser to `http://localhost:3000`

## Usage

- Click on the "add" button to add a new box to the whiteboard
- Click on the "delete" button to delete a selected box(es)
- Click on a box to select it
- Click and drag a box to move it
- Click on a resize handle to resize the box
- Hold down shift, meta, or ctrl to select multiple boxes
- Click and drag a selected box to move all selected boxes, you cannot resize a box if multiple boxes are selected
- Click the delete or backspace key to delete a selected box(es)
- If window is resized, boxes will be shrunk to fit within the window (logic is primitive)
- Boxes cannot be dragged/resized outside of the whiteboard
- The last clicked box will be the topmost box
- Note that no tabbing or keyboard navigation has been implemented

## Design Decisions

- I chose to use Remix.run as the framework because it is a modern and flexible framework that I used on recent projects and am comfortable with. It is also a good fit for this project because it is a full stack framework that is built on top of React and has a lot of built-in features that are useful for this project such as server side rendering, data fetching, and routing.
- I chose to use Redux toolkit for state management because it is a modern and flexible state management library that I used on recent projects and am comfortable with. It is also a good fit for this project because it is built on top of Redux and has a lot of built-in features that are useful for a project with a lot of front end state such as a whiteboard.

## Future Improvements

- Add tests
- Improve mobile experience
- Add more controls like undo, redo, copy, paste, help, and save (to backend).
- Add more shapes and/or components like text, lines, and images.

## Project Structure

Note: Only relevant files are listed

- `app/store.ts` - The redux store for the app, most of the logic for adding/deleting/moving/resizing boxes is here
- `app/components/Whiteboard.tsx` - The main component for the whiteboard, mostly handles event listeners. Renders controls and boxes.
- `app/components/WhiteboardControls.tsx` - The controls for the whiteboard, contains the "add" and "delete" buttons. Future controls can be added here.
- `app/components/WhiteboardBox.tsx` - The component for the boxes, mostly handles rendering of the box and resize handles. Has a mousedown event that calls into the store to select the box for dragging/resizing.
- `app/components/ResizeHandle.tsx` - The component for the resize handles, mostly handles rendering of the resize handle. Has a mousedown event that calls into the store to resize the box.
- `app/typesAndConstants.ts` - Contains types and constants for the app

# OLD README FROM REMIX STARTER

## Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

### Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

#### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
