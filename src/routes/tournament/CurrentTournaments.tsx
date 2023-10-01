import React from 'react'
import {
  useGetTournamentNames,
  useGetTournamentSchedule,
  useGetTournamentScores,
  useGetTournamentTeamColors,
} from 'src/utils/hooks'
import { Col, Container, Row } from 'react-bootstrap'
import { Loading } from 'src/components/Loading'
import {
  getTeamColorsMap,
  isStillLoading,
  StringToStringMap,
  useParamsPk,
} from 'src/utils/helpers'
import { isArray } from 'lodash'
import moment from 'moment'
import { BracketMatchesObjectExposed } from 'src/types'
import { RoundDisplay } from 'src/components/RoundDisplay'

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

const ScheduleForTournament: React.FC<{
  schedule: string[][][]
  teamColorMapping: StringToStringMap
}> = ({ schedule, teamColorMapping }) => {
  // Loop through every part of the triple matrix in the bracket object
  const results = schedule.map((week: string[][], weekIndex: number) => {
    if (week && week.length > 0) {
      const firstRound = (week[0] as any).round
      if (
        firstRound &&
        moment(firstRound.date) < moment().add(5, 'days') &&
        moment(firstRound.date) > moment().subtract(1, 'days')
      ) {
        const roundsForWeek = week.map((match: string[]) => {
          const matchObject = match as unknown as BracketMatchesObjectExposed
          if (isArray(match)) {
            return <div />
          }
          return (
            <Col>
              <Row className="justify-content-center">
                <RoundDisplay
                  roundObject={matchObject.round as any}
                  playerColorMapping={teamColorMapping}
                  showTournamentScores={false}
                  modifiedScoring={matchObject.modifiedScoring}
                  teamGame={matchObject.teamGame}
                  usePlayer
                  isSchedule
                />
              </Row>
            </Col>
          )
        })
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Row className="mb-3 justify-content-center" key={weekIndex}>
            <h3 className="text-center">Week {weekIndex + 1}</h3>
            {roundsForWeek}
          </Row>
        )
      }
    }
    return undefined
  })
  return <Container>{results}</Container>
}

export const CurrentTournaments: React.FC = () => {
  const tournamentPk = useParamsPk()

  const tournamentTeamColorsResponse = useGetTournamentTeamColors(tournamentPk)
  const tournamentNamesResponse = useGetTournamentNames(tournamentPk)
  const tournamentScoresResponse = useGetTournamentScores(tournamentPk, {
    completed: false,
  })
  const tournamentScheduleResponse = useGetTournamentSchedule(tournamentPk, {
    completed: false,
  })

  if (
    isStillLoading([
      tournamentTeamColorsResponse,
      tournamentNamesResponse,
      tournamentScoresResponse,
      tournamentScheduleResponse,
    ])
  ) {
    return <Loading />
  }

  const tournamentTeamColors = tournamentTeamColorsResponse.response.data // Get colors
  const tournamentNames = tournamentNamesResponse.response.data.names // Get names
  const tournamentScores = tournamentScoresResponse.response.data // Get scores
  const tournamentSchedule = tournamentScheduleResponse.response.data // Get schedule

  // Loop over all the tournaments provided
  const allTournamentScores = Object.entries(tournamentScores).map(
    (thisTournamentScoresFullObject: any) => {
      const thisTournamentPk = thisTournamentScoresFullObject[0]
      const thisTournamentScores = thisTournamentScoresFullObject[1]
      if (thisTournamentPk !== 'detail') {
        // Get the scores, colors, and name for this tournament
        const teamToColorMapping = getTeamColorsMap(
          tournamentTeamColors[thisTournamentPk]
        )
        const thisTournamentName = tournamentNames.find(
          (tournamentName: any) =>
            tournamentName.pk.toString() === thisTournamentPk
        )
        const thisTournamentSchedule = tournamentSchedule[thisTournamentPk]

        // Append all of this to an object to return
        return (
          <div>
            <ScoreboardForTournament
              key={thisTournamentPk}
              tournamentName={
                thisTournamentName ? thisTournamentName.name : undefined
              }
              tournamentStats={thisTournamentScores}
              tournamentTeamColors={teamToColorMapping}
            />
            <ScheduleForTournament
              schedule={thisTournamentSchedule}
              teamColorMapping={teamToColorMapping}
            />
          </div>
        )
      }
      return undefined
    }
  )
  return <div>{allTournamentScores}</div>
}
