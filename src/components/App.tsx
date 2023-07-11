import { type ReactElement, createRef, lazy, useEffect, useState } from 'react'
import './App.scss'
import { type ControlRef } from './Control'
import { type TeamsRef } from './Teams'

const Control = lazy(async () => await import('./Control'))
const Teams = lazy(async () => await import('./Teams'))

function App(): ReactElement {
  const teamsRef = createRef<TeamsRef>()
  const controlRef = createRef<ControlRef>()

  const [update, setUpdate] = useState<boolean>(false)

  useEffect(() => {
    type Manifest = {
      version: string
      homepage: string
    }
    fetch('/manifest.json')
      .then((res) => res.json())
      .then((current: Manifest) => {
        fetch(new URL('./manifest.json', current.homepage).href)
          .then((res) => {
            if (!res.ok) {
              throw new Error()
            } else {
              return res.json()
            }
          })
          .then((latest: Manifest) => {
            if (current.version !== latest.version) {
              setUpdate(true)
            }
          })
          .catch(() => {
            setUpdate(false)
          })
      })
  }, [])

  return (
    <div>
      <Control ref={controlRef} teams={teamsRef} />
      <Teams ref={teamsRef} control={controlRef} />
      {update && (
        <a className="update" href="https://github.com/Rokr0k/teamup/releases">
          업데이트 가능
        </a>
      )}
    </div>
  )
}

export default App
