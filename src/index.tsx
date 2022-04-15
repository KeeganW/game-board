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
import { Whales } from 'src/routes/Whales'
import { Sharks } from 'src/routes/Sharks'
import { Default } from 'src/routes/Default'

// More route information can be found at https://reactrouter.com/docs/en/v6/getting-started/tutorial
const rootElement = document.getElementById('root')
render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/*" element={<NotFound />} />
        <Route path="/" element={<Default />} />
        <Route path="/whales" element={<Whales />} />
        <Route path="/sharks" element={<Sharks />}>
          <Route path=":sharkName" element={<Sharks />} />
        </Route>
      </Route>
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  </HashRouter>,
  rootElement,
)
