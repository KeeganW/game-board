import React from 'react'
import { render } from 'react-dom'
import {
  Routes,
  Route,
  HashRouter,
  Navigate,
} from 'react-router-dom'

import 'src/index.css'
import { App } from 'src/App'
import { NotFound } from 'src/routes/NotFound'
import { Login } from 'src/routes/Login'
import { Default } from 'src/routes/Default'
import { Player } from 'src/routes/Player'

// More route information can be found at https://reactrouter.com/docs/en/v6/getting-started/tutorial
const rootElement = document.getElementById('root')
render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/*" element={<NotFound />} />
        <Route path="/" element={<Default />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player" element={<Player />} />
      </Route>
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  </HashRouter>,
  rootElement,
)