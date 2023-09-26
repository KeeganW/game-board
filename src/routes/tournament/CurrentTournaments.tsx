import React from 'react'
import {
  useGetTournament,
  useGetTournamentStats,
  useGetTournamentTeamColors,
} from 'src/utils/hooks'
import { Col, Container, Row } from 'react-bootstrap'
import { Loading } from 'src/components/Loading'
import {
  getTeamColorsMap,
  StringToStringMap,
  useParamsPk,
} from 'src/utils/helpers'
import { isArray } from 'lodash'

const ScoreboardForTournament: React.FC<{
  tournamentName: string
  tournamentStats: Object
  tournamentTeamColors: StringToStringMap
}> = ({ tournamentName, tournamentStats, tournamentTeamColors }) => {
  const results = Object.entries(tournamentStats).map(
    (value: [string, { string: number }]) => {
      // Function to get a scoring list from some data
      function getScoresFromStats(title: string) {
        const sortedScores = Object.entries(value[1]).sort(
          (a, b) => b[1] - a[1]
        )
        const scoring = sortedScores.map((scoringValue: any) => (
          <Row
            id={`rawScoresByTeam${scoringValue[0].replaceAll(' ', '_')}`}
            key={`rawScoresByTeam${scoringValue[0].replaceAll(' ', '_')}`}
            className="mb-1 justify-content-center"
          >
            <div
              className="col-md-auto rounded"
              style={{
                backgroundColor: tournamentTeamColors.get(scoringValue[0]),
              }}
            >
              <div>{`${scoringValue[0]}: ${scoringValue[1]}`}</div>
            </div>
          </Row>
        ))
        return (
          <Row
            id={`rawScoresByTeamAll${title}`}
            key={`rawScoresByTeamAll${title}`}
            className="text-center"
          >
            <Col>
              <Row>
                <h3
                  id={`rawScoresByTeamAll${title}Title`}
                  key={`rawScoresByTeamAll${title}Title`}
                >
                  {title}
                </h3>
              </Row>
              {scoring}
            </Col>
          </Row>
        )
      }

      // if (value[0] === 'rawScoresByTeam') {
      //   return getScoresFromStats('Raw Scoring')
      // }
      if (value[0] === 'scoresByTeam') {
        return getScoresFromStats('Scoring')
      }
      return <div key={value[0]} />
    }
  )
  return (
    <Container className="mb-4">
      <h2 className="text-center">{tournamentName}</h2>
      {results}
    </Container>
  )
}

export const CurrentTournaments: React.FC = () => {
  const tournamentPk = useParamsPk()

  const tournamentStatsResponse = useGetTournamentStats(tournamentPk)
  const tournamentTeamColorsResponse = useGetTournamentTeamColors(tournamentPk)
  const allTournamentsResponse = useGetTournament(tournamentPk)

  if (
    !tournamentStatsResponse.response ||
    !tournamentStatsResponse.response.data ||
    tournamentStatsResponse.loading ||
    !tournamentTeamColorsResponse.response ||
    !tournamentTeamColorsResponse.response.data ||
    tournamentTeamColorsResponse.loading ||
    !allTournamentsResponse.response ||
    !allTournamentsResponse.response.data ||
    allTournamentsResponse.loading
  ) {
    return <Loading />
  }

  const tournamentStats = tournamentStatsResponse.response.data // Get actual stats
  const tournamentTeamColors = tournamentTeamColorsResponse.response.data // Get colors
  const allTournaments = allTournamentsResponse.response.data // Get tournament name

  if (isArray(allTournaments)) {
    const allTournamentStats = []
    for (let i = allTournaments.length - 1; i >= 0; i -= 1) {
      const tournamentInfo = allTournaments[i]
      const allTournamentPk = tournamentInfo.pk
      const teamToColorMapping = getTeamColorsMap(
        tournamentTeamColors[allTournamentPk]
      )
      allTournamentStats.push(
        <ScoreboardForTournament
          key={allTournamentPk}
          tournamentName={tournamentInfo.name}
          tournamentStats={tournamentStats[allTournamentPk]}
          tournamentTeamColors={teamToColorMapping}
        />
      )
    }
    return <div>{allTournamentStats}</div>
  }
  // Get colors
  const teamToColorMapping = getTeamColorsMap(tournamentTeamColors)

  return (
    <ScoreboardForTournament
      tournamentName={allTournaments.name}
      tournamentStats={tournamentStats}
      tournamentTeamColors={teamToColorMapping}
    />
  )
}
