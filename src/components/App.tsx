import React, { type ReactElement, createRef, lazy } from 'react'
import { type ControlRef } from './Control'
import { type TeamsRef } from './Teams'

const Control = lazy(async () => await import('./Control'))
const Teams = lazy(async () => await import('./Teams'))

function App(): ReactElement {
  const teamsRef = createRef<TeamsRef>()
  const controlRef = createRef<ControlRef>()

  return (
    <div>
      <Control ref={controlRef} teams={teamsRef} />
      <Teams ref={teamsRef} control={controlRef} />
    </div>
  )
}

export default App
