import React from 'react'
import { Link } from 'react-router-dom'
import {
  BracketMatchesObject, PlayerRankObject, TeamObject, TournamentObject,
} from 'src/types'
import { Loading, useParamsPk } from 'src/utils/helpers'
import { useGetTournamentInfo, useGetTournamentStats } from 'src/utils/hooks'
import { Col, Container, Row } from 'react-bootstrap'

export const convertStatsToView = (tournamentStats: Object) => {
  const results = Object.entries(tournamentStats).map((value: any) => {
    if (value[0] === 'rawScoresByTeam') {
      const scoring = Object.entries(value[1]).map((scoringValue: any) => (
        <div key={`rawScoresByTeam${scoringValue[0]}`}>
          {scoringValue[0]}
          {': '}
          {scoringValue[1]}
        </div>
      ))
      return (
        <Row key="rawScoresByTeam" className="text-center">
          <h3>Raw Scoring</h3>
          {scoring}
        </Row>
      )
    } else if (value[0] === 'scoresByTeam') {
      const scoring = Object.entries(value[1]).map((scoringValue: any) => (
        <div key={`scoresByTeam${scoringValue[0]}`}>
          {scoringValue[0]}
          {': '}
          {scoringValue[1]}
        </div>
      ))
      return (
        <Row key="scoresByTeam" className="text-center">
          <h3>Scoring</h3>
          {scoring}
        </Row>
      )
    }
    return undefined
  })
  return <Container>{results}</Container>
}
export const convertBracketToView = (bracket: string[][][], tournament: TournamentObject) => {
  // Find all team related information for quick access later
  const tournamentTeams = tournament.bracket.teams.sort(
    (a: TeamObject, b: TeamObject) => a.name.localeCompare(b.name),
  )
  const teamNamesToIndex = tournamentTeams.map((teamObject) => teamObject.name)

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
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${weekIndex}${roundIndex}${teamIndex}`}>{realTeam.name}</div>
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
        (value: BracketMatchesObject) => value.match === roundNumber,
      )

      if (tournamentGame) {
        // This game exists, so lets put it all together
        const { round: tournamentRound } = tournamentGame
        const playerRanks = tournamentRound.playerRanks
          ?.sort((a: PlayerRankObject, b: PlayerRankObject) => a.rank - b.rank)
          .map((player: PlayerRankObject) => (
            <div key={tournamentGame.match + player.player.username}>
              {player.rank}
              {': '}
              <Link to={`/player/${player.player.pk}`}>
                {player.player.username}
              </Link>
              {` - ${player.score}`}
            </div>
          ))
        return (
          <Col key={tournamentGame.match}>
            <h5>{tournamentRound.game.name}</h5>
            {playerRanks}
          </Col>
        )
      }
      // TODO: There will be an issue here. How do we add team games, if we have added other rounds
      //  first? This code assumes the games are listed in order, but we also don't know how many
      //  team games there are in the first vs second weeks... Need to add either add a fixed amount
      //  or do something clever
      return (
        <Col key={`game${roundNumber}`}>
          <h5>
            <Link to={`/add_match/${tournament.pk}/${roundNumber}`}>
              Game
              {' '}
              {roundNumber}
            </Link>
          </h5>
          {rounds}
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
      <Row className="mb-3" key={weekIndex}>
        <h3 className="text-center">
          Week
          {' '}
          {weekIndex + 1}
        </h3>
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
    !tournamentInfoResponse.response
    || !tournamentInfoResponse.response.data
    || tournamentInfoResponse.loading
    || !tournamentStatsResponse.response
    || !tournamentStatsResponse.response.data
    || tournamentStatsResponse.loading
  ) {
    return <Loading />
  }

  const tournamentInfo = tournamentInfoResponse.response.data?.tournament
  const tournamentInfoBracket = tournamentInfoResponse.response.data?.bracket
  const tournamentStats = tournamentStatsResponse.response.data

  const convertedBracket = !tournamentInfo ? (
    <Loading />
  ) : (
    convertBracketToView(tournamentInfoBracket, tournamentInfo)
  )
  const convertedStats = !tournamentStats ? <Loading /> : convertStatsToView(tournamentStats)

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          {!tournamentInfo && <Loading />}
          <h1 className="text-center">{tournamentInfo && tournamentInfo.name}</h1>
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
