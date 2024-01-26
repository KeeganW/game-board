import React from 'react'
import { useParams } from 'react-router-dom'
import { CenteredPage } from 'src/components/CenteredPage'
import { AdminEditRound } from './AdminEditRound'

export const EditRound: React.FC = () => {
  // Get current tournaments list, and ask the user to pick one
  // Get current games list for tournament, and ask the user to pick one
  //  Games are limited by the current date.
  // Show list of games to user, ask them to pick one
  // Ask the user whether they are the host or not

  const params = useParams()
  const { tournamentPk, matchPk } = params
  const tournamentPkSafe = tournamentPk || ''
  const matchPkSafe = matchPk || ''

  return (
    <CenteredPage>
      <AdminEditRound tournamentPk={tournamentPkSafe} matchPk={matchPkSafe} />
    </CenteredPage>
  )
}
