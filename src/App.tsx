import React, { createRef } from "react";
import Control, { ControlRef } from "./Control";
import Teams, { TeamsRef } from "./Teams";

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
