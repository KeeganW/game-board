import React from 'react'
import { Link } from 'react-router-dom'
import {
  BracketMatchesObject, PlayerRankObject, TeamObject, TournamentObject,
} from 'src/types'
import { Loading, useParamsPk } from 'src/utils/helpers'
import { useGetTournamentInfo, useGetTournamentStats } from 'src/utils/hooks'
import { Col, Container, Row } from 'react-bootstrap'
import { calculateBracket } from 'src/bracketLayout'

export const convertStatsToView = (tournamentStats: Object) => {
  const results = Object.entries(tournamentStats).map((value: any, index: number) => {
    if (value[0] === 'rawScoresByTeam') {
      const scoring = Object.entries(value[1]).map((scoringValue: any, scoringIndex: number) => (
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
    }
    if (value[0] === 'scoresByTeam') {
      const scoring = Object.entries(value[1]).map((scoringValue: any, scoringIndex: number) => (
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
  })
  return <Container>{results}</Container>
}
export const convertBracketToView = (bracket: number[][][], tournament: TournamentObject) => {
  const tournamentTeams = tournament.bracket.teams.sort(
    (a: TeamObject, b: TeamObject) => a.pk - b.pk,
  )
  const results = bracket.map((week: number[][], weekIndex: number) => {
    const roundsForWeek = week.map((round: number[], roundIndex: number, fullArray: any) => {
      const rounds = round.map((team: number, teamIndex: number) => {
        const realTeam = tournamentTeams[team]
        return realTeam ? (
          <div key={weekIndex + roundIndex + teamIndex}>{realTeam.name}</div>
        ) : (
          <div key={weekIndex + roundIndex + teamIndex} />
        )
      })
      const gameNumber = weekIndex * fullArray.length + roundIndex + 1
      const tournamentGame = tournament.bracket.matches.find(
        (value: BracketMatchesObject) => value.match === gameNumber,
      )
      if (tournamentGame) {
        const { round } = tournamentGame
        const playerRanks = round.playerRanks
          ?.sort((a: PlayerRankObject, b: PlayerRankObject) => a.rank - b.rank)
          .map((player: PlayerRankObject) => (
            <div key={tournamentGame.match + player.player.username}>
              {player.rank}
              {': '}
              {player.player.username}
              {` - ${player.score}`}
            </div>
          ))
        return (
          <Col key={tournamentGame.match}>
            <h5>{round.game.name}</h5>
            {playerRanks}
          </Col>
        )
      }
      return (
        <Col key={`game${gameNumber}`}>
          <h5>
            <Link to={`/add_match/${tournament.pk}/${gameNumber}`}>
              Game
              {gameNumber}
            </Link>
          </h5>
          {rounds}
        </Col>
      )
    })
    return (
      <Row className="mb-3" key={weekIndex}>
        <h3 className="text-center">
          Week
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
  const tournamentStats = tournamentStatsResponse.response.data

  const thisBracket = calculateBracket(
    10,
    tournamentInfo ? tournamentInfo.bracket.teams.length : 6,
    4,
    10,
  )
  const convertedBracket = !tournamentInfo ? (
    <Loading />
  ) : (
    convertBracketToView(thisBracket, tournamentInfo)
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
