import React from 'react'
import { render } from 'react-dom'
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom'
// eslint-disable-next-line import/no-unresolved
import '@mantine/core/styles.css'
// eslint-disable-next-line import/no-unresolved
import '@mantine/dates/styles.css'
// eslint-disable-next-line import/no-unresolved
import '@mantine/notifications/styles.css'

import 'src/index.css'
import { App } from 'src/App'
import { NotFound } from 'src/routes/NotFound'
import { SignIn } from 'src/routes/SignIn'
import { SignUp } from 'src/routes/SignUp'
import { SignOut } from 'src/routes/SignOut'
import { Default } from 'src/routes/Default'
import { Player } from 'src/routes/player/Player'
import { Group } from 'src/routes/Group'
import { Tournament } from 'src/routes/tournament/Tournament'
import { AddRound } from 'src/routes/AddRound'
import { AddMatch } from 'src/routes/AddMatch'
import { AddTournament } from 'src/routes/AddTournament'
import { createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { CurrentTournaments } from 'src/routes/tournament/CurrentTournaments'
import { Round } from 'src/routes/Round'
import { ResetPassword } from 'src/routes/ResetPassword'
import { EditRound } from 'src/routes/roundSubmit/EditRound'
import { Draft } from 'src/routes/draft/Draft'
import { AddTeam } from 'src/routes/AddTeam'
import { EditTeamRound } from 'src/routes/EditTeamRound'
import { CurrentTournamentRound } from 'src/routes/roundSubmit/CurrentTournamentRound'
import { AddGame } from 'src/routes/AddGame'

// More route information can be found at https://reactrouter.com/docs/en/v6/getting-started/tutorial
const rootElement = document.getElementById('root')
const theme = createTheme({
  /** Put your mantine theme override here */
})
render(
  <MantineProvider theme={theme}>
    <Notifications />
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/*" element={<NotFound />} />
          <Route path="/" element={<Default />} />
          <Route path="/sign_in" element={<SignIn />} />
          <Route path="/reset_password" element={<ResetPassword />}>
            <Route path=":username/:token" element={<ResetPassword />} />
          </Route>
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/sign_out" element={<SignOut />} />
          <Route path="/player" element={<Player />}>
            <Route path=":pk" element={<Player />} />
          </Route>
          <Route path="/group" element={<Group />}>
            <Route path=":pk" element={<Group />} />
          </Route>
          <Route path="/round" element={<Round />}>
            <Route path=":pk" element={<Round />} />
          </Route>
          <Route path="/tournament" element={<Tournament />}>
            <Route path=":pk" element={<Tournament />} />
          </Route>
          <Route path="/add_match" element={<AddMatch />}>
            <Route path=":tournamentPk/:matchPk" element={<AddMatch />} />
          </Route>
          <Route path="/draft/:pk" element={<Draft />} />
          <Route
            path="/edit_round/:tournamentPk/:matchNumber"
            element={<EditRound />}
          />
          <Route path="/add_round" element={<AddRound />} />

          {/* Stands for add_current_round, shortened for qr codes */}
          <Route path="/acr" element={<CurrentTournamentRound />}>
            <Route path=":tournamentPk" element={<CurrentTournamentRound />} />
            <Route
              path=":tournamentPk/:matchPk"
              element={<CurrentTournamentRound />}
            />
            <Route
              path=":tournamentPk/:matchPk/:submitterType"
              element={<CurrentTournamentRound />}
            />
          </Route>

          <Route path="/add_tournament" element={<AddTournament />} />
          <Route path="/add_team" element={<AddTeam />} />
          <Route path="/add_game" element={<AddGame />} />
          <Route path="/edit_team_round" element={<EditTeamRound />} />
          <Route path="/current" element={<CurrentTournaments />}>
            <Route path=":pk" element={<CurrentTournaments />} />
          </Route>
        </Route>
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  </MantineProvider>,
  rootElement
)
