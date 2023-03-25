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
import { Logout } from 'src/routes/Logout'
import { Default } from 'src/routes/Default'
import { Player } from 'src/routes/Player'
import { Group } from 'src/routes/Group'
import { Tournament } from 'src/routes/Tournament'
import { AddRound } from 'src/routes/AddRound'
import { AddMatch } from 'src/routes/AddMatch'
import { AddTournament } from './routes/AddTournament'

// More route information can be found at https://reactrouter.com/docs/en/v6/getting-started/tutorial
const rootElement = document.getElementById('root')
render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/*" element={<NotFound />} />
        <Route path="/" element={<Default />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/player" element={<Player />}>
          <Route path=":pk" element={<Player />} />
        </Route>
        <Route path="/group" element={<Group />}>
          <Route path=":pk" element={<Group />} />
        </Route>
        <Route path="/tournament" element={<Tournament />}>
          <Route path=":pk" element={<Tournament />} />
        </Route>
        <Route path="/add_match" element={<AddMatch />}>
          <Route path=":tournamentPk/:match" element={<AddMatch />} />
        </Route>
        <Route path="/add_round" element={<AddRound />} />
        <Route path="/add_tournament" element={<AddTournament />} />
      </Route>
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  </HashRouter>,
  rootElement,
)
