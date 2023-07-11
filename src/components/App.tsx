import { type ReactElement, createRef, lazy, useEffect, useState } from 'react'
import './App.scss'
import { type ControlRef } from './Control'
import { type TeamsRef } from './Teams'

declare const VERSION: string
declare const HOMEPAGE: string

const Control = lazy(async () => await import('./Control'))
const Teams = lazy(async () => await import('./Teams'))

function App(): ReactElement {
  const teamsRef = createRef<TeamsRef>()
  const controlRef = createRef<ControlRef>()

  const [latest, setLatest] = useState<string>(VERSION)

  useEffect(() => {
    interface Manifest {
      version: string
    }
    fetch(new URL('./manifest.json', HOMEPAGE).href)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error()
        } else {
          return await res.json()
        }
      })
      .then((latest: Manifest) => {
        if (VERSION !== latest.version) {
          setLatest(latest.version)
        }
      })
      .catch(() => {
        setLatest(VERSION)
      })
  }, [])

  return (
    <div>
      <Control ref={controlRef} teams={teamsRef} />
      <Teams ref={teamsRef} control={controlRef} />
      {VERSION === latest || (
        <a className="update" href="https://github.com/Rokr0k/teamup/releases">
          업데이트 가능 ({VERSION}
          {'\u2192'}
          {latest})
        </a>
      )}
    </div>
  )
}

export default App
