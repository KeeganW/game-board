import React from 'react'
import { Link } from 'react-router-dom'
import { BracketMatchesObject, TeamObject, TournamentObject } from 'src/types'
import { useParamsPk } from 'src/utils/helpers'
import { useGetTournamentInfo, useGetTournamentStats } from 'src/utils/hooks'
import { Col, Container, Row } from 'react-bootstrap'
import { RoundDisplay } from 'src/components/RoundDisplay'
import { CardDisplay } from 'src/components/CardDisplay'
import { Loading } from 'src/components/Loading'

// TODO(keegan): implement this function for white vs black text:
//  https://blog.cristiana.tech/calculating-color-contrast-in-typescript-using-web-content-accessibility-guidelines-wcag
type RGBValue = {
  r: number
  g: number
  b: number
}
const hexToRGB = (hexCode: string): RGBValue => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {
        r: 0,
        g: 0,
        b: 0,
      }
}

const rgbToStyle = (rgbValue: RGBValue): string =>
  `rgb(${rgbValue.r},${rgbValue.g},${rgbValue.b},0.5)`

type StringToStringMap = Map<string, string>
type NumberToStringMap = Map<number, string>

const getTeamColors = (tournamentInfo: TournamentObject): StringToStringMap => {
  const teamColorMap = new Map<string, string>()
  tournamentInfo.bracket.teams.forEach(team => {
    const teamColorRGB = hexToRGB(team.color)
    teamColorMap.set(team.name, rgbToStyle(teamColorRGB))
  })
  return teamColorMap
}

const getPlayerColors = (
  tournamentInfo: TournamentObject
): NumberToStringMap => {
  const playerColorMap = new Map<number, string>()
  tournamentInfo.bracket.teams.forEach(team => {
    const teamColorRGB = hexToRGB(team.color)
    team.players.forEach(player => {
      playerColorMap.set(player.pk, rgbToStyle(teamColorRGB))
    })
  })
  return playerColorMap
}

export const convertStatsToView = (
  tournamentStats: Object,
  teamColorMapping: StringToStringMap
) => {
  const results = Object.entries(tournamentStats).map(
    (value: [string, { string: number }]) => {
      function getScoresFromStats(title: string) {
        const sortedScores = Object.entries(value[1]).sort(
          (a, b) => b[1] - a[1]
        )
        const scoring = sortedScores.map((scoringValue: any) => (
          <Row className="mb-1 justify-content-center">
            <div
              className="col-md-auto rounded"
              style={{ backgroundColor: teamColorMapping.get(scoringValue[0]) }}
            >
              <div key={`rawScoresByTeam${scoringValue[0]}`}>
                {scoringValue[0]}
                {': '}
                {scoringValue[1]}
              </div>
            </div>
          </Row>
        ))
        return (
          <Row key="rawScoresByTeam" className="text-center">
            <h3>{title}</h3>
            {scoring}
          </Row>
        )
      }

      // if (value[0] === 'rawScoresByTeam') {
      //   return getScoresFromStats('Raw Scoring')
      // }
      if (value[0] === 'scoresByTeam') {
        return getScoresFromStats('Scoring')
      }
      return undefined
    }
  )
  return <Container>{results}</Container>
}
export const convertBracketToView = (
  bracket: string[][][],
  tournament: TournamentObject,
  teamColorMapping: StringToStringMap,
  playerColorMapping: NumberToStringMap
) => {
  // Find all team related information for quick access later
  const tournamentTeams = tournament.bracket.teams.sort(
    (a: TeamObject, b: TeamObject) => a.name.localeCompare(b.name)
  )
  const teamNamesToIndex = tournamentTeams.map(teamObject => teamObject.name)

  // After looping through every week, add the number of rounds in that week to a total, so we can
  //  keep track of the number of rounds, even when the number of rounds is inconsistent (like
  //  team game weeks).
  let totalRoundsSoFar: number = 0

  // Loop through every part of the triple matrix in the bracket object
  const results = bracket.map((week: string[][], weekIndex: number) => {
    const roundsForWeek = week.map((round: string[], roundIndex: number) => {
      const rounds = round.map((team: string, teamIndex: number) => {
        // Get the team object for this team in this round.
        const realTeam = tournamentTeams[teamNamesToIndex.indexOf(team)]
        // Create a placeholder for this score, with the team name.
        return realTeam ? (
          <Row className="mb-1 justify-content-left">
            <div
              className="col-md-auto rounded"
              style={{ backgroundColor: teamColorMapping.get(team) }}
            >
              {/* eslint-disable-next-line react/no-array-index-key */}
              <div key={`${weekIndex}${roundIndex}${teamIndex}`}>
                {realTeam.name}
              </div>
            </div>
          </Row>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${weekIndex}${roundIndex}${teamIndex}`} />
        )
      })

      // Get the individual round's number, aka the index if you were to loop through the bracket
      //  one round at a time, aka the match number
      const roundNumber = totalRoundsSoFar + roundIndex + 1

      // Get this specific round object from the tournament
      const tournamentGame = tournament.bracket.matches.find(
        (value: BracketMatchesObject) => value.match === roundNumber
      )

      if (tournamentGame) {
        // This game exists, so lets put it all together
        const { round: tournamentRound } = tournamentGame
        return (
          <Col>
            <Row className="justify-content-center">
              <RoundDisplay
                roundObject={tournamentRound}
                playerColorMapping={playerColorMapping}
                showTournamentScores
              />
            </Row>
          </Col>
        )
      }
      // TODO: There will be an issue here. How do we add team games, if we have added other rounds
      //  first? This code assumes the games are listed in order, but we also don't know how many
      //  team games there are in the first vs second weeks... Need to add either add a fixed amount
      //  or do something clever
      return (
        <Col key={`game${roundNumber}`}>
          <Row className="justify-content-center">
            <CardDisplay
              title={
                <Link to={`/add_match/${tournament.pk}/${roundNumber}`}>
                  Game {roundNumber}
                </Link>
              }
              subtitle=""
              content={rounds}
            />
          </Row>
        </Col>
      )
    })
    // If we are in a team game week, we block off the number of matches to be the number of teams,
    //  aka the maximum number of games in a week.
    if (weekIndex === 0 || weekIndex === 7) {
      totalRoundsSoFar += teamNamesToIndex.length
    } else {
      totalRoundsSoFar += week.length
    }
    return (
      // eslint-disable-next-line react/no-array-index-key
      <Row className="mb-3 justify-content-center" key={weekIndex}>
        <h3 className="text-center">Week {weekIndex + 1}</h3>
        {roundsForWeek}
      </Row>
    )
  })
  return <Container>{results}</Container>
}

export const TournamentDetails: React.FC = () => {
  const tournamentPk = useParamsPk()

  const tournamentInfoResponse = useGetTournamentInfo(tournamentPk)
  const tournamentStatsResponse = useGetTournamentStats(tournamentPk)

  if (
    !tournamentInfoResponse.response ||
    !tournamentInfoResponse.response.data ||
    tournamentInfoResponse.loading ||
    !tournamentStatsResponse.response ||
    !tournamentStatsResponse.response.data ||
    tournamentStatsResponse.loading
  ) {
    return <Loading />
  }

  const tournamentInfo = tournamentInfoResponse.response.data?.tournament
  const tournamentInfoBracket = tournamentInfoResponse.response.data?.bracket
  const tournamentStats = tournamentStatsResponse.response.data

  const teamToColorMapping = getTeamColors(tournamentInfo)
  const playerToColorMapping = getPlayerColors(tournamentInfo)

  const convertedBracket = !tournamentInfo ? (
    <Loading />
  ) : (
    convertBracketToView(
      tournamentInfoBracket,
      tournamentInfo,
      teamToColorMapping,
      playerToColorMapping
    )
  )
  const convertedStats = !tournamentStats ? (
    <Loading />
  ) : (
    convertStatsToView(tournamentStats, teamToColorMapping)
  )

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          {!tournamentInfo && <Loading />}
          <h1 className="text-center">
            {tournamentInfo && tournamentInfo.name}
          </h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="mb-4">
            <h2 className="text-center">Current Standings</h2>
            {convertedStats}
          </Row>
          <Row className="mb-4">
            <h2 className="text-center">Full Bracket</h2>
            {convertedBracket}
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
