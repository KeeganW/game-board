import React from 'react'
import {
  useGetTournamentDraft,
  useGetTournamentTeamColors,
} from 'src/utils/hooks'
import { Loading } from 'src/components/Loading'
import {
  getTeamColorsMap,
  isStillLoading,
  useParamsPk,
} from 'src/utils/helpers'
import { BracketMatchesObject } from 'src/types'
import { RoundDisplay } from 'src/components/RoundDisplay'

export const Draft: React.FC = () => {
  const tournamentPk = useParamsPk()

  const tournamentTeamColorsResponse = useGetTournamentTeamColors(tournamentPk)
  const tournamentDraftResponse = useGetTournamentDraft(tournamentPk)

  if (isStillLoading([tournamentTeamColorsResponse, tournamentDraftResponse])) {
    return <Loading />
  }

  const tournamentTeamColors = tournamentTeamColorsResponse.response.data // Get colors
  const tournamentDraft = tournamentDraftResponse.response.data // Get draft

  const teamToColorMapping = getTeamColorsMap(
    tournamentTeamColors[tournamentPk]
  )

  // TODO: Make it so you can click on any one of these, and get taken to /edit_round/<tournamentpk>/match.match
  // TODO: Get it so they are all laid out next to one another
  const roundsToDisplay = tournamentDraft.draft.matches.map(
    (match: BracketMatchesObject) => {
      return (
        <RoundDisplay
          roundObject={match.round as any}
          teamColorMapping={teamToColorMapping}
          showTournamentScores={false}
          modifiedScoring={match.modifiedScoring}
          teamGame={match.teamGame}
          usePlayer
          isSchedule
        />
      )
    }
  )

  return <div>{roundsToDisplay}</div>
}
