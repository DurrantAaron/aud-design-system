import React from 'react'
import { createRoot } from 'react-dom/client'
import '@aud/brand/fonts.css'
import '@aud/brand/tokens.css'
import './showcase.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
