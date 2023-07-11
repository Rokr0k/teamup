import React, { lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'

const App = lazy(async () => await import('./components/App'))

const container = document.getElementById('root')
if (container != null) {
  const root = createRoot(container)
  root?.render(
    <>
      <App />
      <a href="https://github.com/Rokr0k/teamup" className="watermark">
        Rokr0k &copy; {new Date().getFullYear()}
      </a>
    </>
  )
}
