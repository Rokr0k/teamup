import React, { createRef, lazy } from "react";
import { ControlRef } from "./Control";
import { TeamsRef } from "./Teams";

const Control = lazy(() => import("./Control"));
const Teams = lazy(() => import("./Teams"));

function App() {
  const teamsRef = createRef<TeamsRef>();
  const controlRef = createRef<ControlRef>();

  return (
    <div>
      <Control ref={controlRef} teams={teamsRef} />
      <Teams ref={teamsRef} control={controlRef} />
    </div>
  );
}

export default App;
