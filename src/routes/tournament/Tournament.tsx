import React, { useContext, useEffect, useState } from 'react'
import axios from 'src/axiosAuth'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import {
  BracketMatchesObject,
  PlayerRankObject, TeamObject,
  TournamentObject,
} from 'src/types'
import {
  BasicList, BasicResponse, Loading, useUpdatePlayerInfo,
} from 'src/helpers'
import { Col, Container, ListGroupItem, Row, Stack } from 'react-bootstrap'
import { calculateBracket } from 'src/bracketLayout'

export const convertStatsToView = (tournamentStats: Object) => {
  const results = Object.entries(tournamentStats).map((value: any, index: number) => {
    if (value[0] === 'raw_scores_by_team') {
      const scoring = Object.entries(value[1]).map((scoringValue: any, scoringIndex: number) => {
        return (
          <div key={'raw_scores_by_team' + scoringValue[0]}>
            {scoringValue[0]}{': '}{scoringValue[1]}
          </div>
        )
      })
      return (
        <Row key={'raw_scores_by_team'} className="text-center">
          <h3>
            Raw Scoring
          </h3>
          {scoring}
        </Row>
      )
    }
    if (value[0] === 'scores_by_team') {
      const scoring = Object.entries(value[1]).map((scoringValue: any, scoringIndex: number) => {
        return (
          <div key={'scores_by_team' + scoringValue[0]}>
            {scoringValue[0]}{': '}{scoringValue[1]}
          </div>
        )
      })
      return (
        <Row key={'scores_by_team'} className="text-center">
          <h3>
            Scoring
          </h3>
          {scoring}
        </Row>
      )
    }
  })
  return (
    <Container>
      {results}
    </Container>
  )
}
export const convertBracketToView = (bracket: number[][][], tournament: TournamentObject) => {
  const tournamentTeams = tournament.bracket.teams.sort((a: TeamObject, b: TeamObject) => a.pk - b.pk)
  const results = bracket.map((week: number[][], weekIndex: number) => {
    const roundsForWeek = week.map((round: number[], roundIndex: number, fullArray: any) => {
      const rounds = round.map((team: number, teamIndex: number) => {
        const real_team = tournamentTeams[team]
        return real_team ? (
          <div key={weekIndex + roundIndex + teamIndex}>
            {real_team.name}
          </div>
        ) : (<div key={weekIndex + roundIndex + teamIndex}></div>)
      })
      const gameNumber = (weekIndex * fullArray.length) + roundIndex + 1
      const tournamentGame = tournament.bracket.matches.find((value: BracketMatchesObject) => value.match === gameNumber)
      if (tournamentGame) {
        const { round } = tournamentGame
        const playerRanks = round.players.sort((a: PlayerRankObject, b: PlayerRankObject) => a.rank - b.rank).map((player: PlayerRankObject) => (
          <div key={tournamentGame.match + player.player.username}>
            {player.rank}
            {': '}
            {player.player.username}
            {player.score && ` - ${player.score}`}
          </div>
        ))
        return (
          <Col key={tournamentGame.match}>
            <h5>
              {round.game.name}
            </h5>
            {playerRanks}
          </Col>
        )
      }
      return (
        <Col key={`game${gameNumber}`}>
          <h5>
            <Link to={`/add_match/${tournament.pk}/${gameNumber}`} >
              Game
              {' '}
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
          {' '}
          {weekIndex + 1}
        </h3>
        {roundsForWeek}
      </Row>
    )
  })
  return (
    <Container>
      {results}
    </Container>
  )
}

export const Tournament: React.FC = () => {
  useUpdatePlayerInfo()
  const { playerPk } = useContext(AuthContext)
  const [tournamentArray, setTournamentArray] = useState<TournamentObject[] | undefined>(undefined)
  const [tournament, setTournament] = useState<TournamentObject | undefined>(undefined)
  const [tournamentStats, setTournamentStats] = useState<Object | undefined>(undefined)
  const [tournamentPlayerStats, setTournamentPlayerStats] = useState<Object | undefined>(undefined)
  const [tournamentPlayerInfo, setTournamentPlayerInfo] = useState<Object | undefined>(undefined)

  // Get tournament info if provided
  const params = useParams()
  const { pk } = params
  const tournamentPk = pk || ''

  // We need to get ALL the data at once, so get tournament > bracket > matches
  useEffect(() => {
    // TODO on 401, redirect
    if (tournamentPk) {
      axios.get(`http://localhost:8000/tournament_info/${tournamentPk}`).then((tournamentRes) => {
        const tournamentResObj = tournamentRes.data.tournament as TournamentObject | undefined
        setTournament(tournamentResObj)
      })
      axios.get(`http://localhost:8000/tournament_stats/${tournamentPk}`).then((tournamentStatsRes) => {
        setTournamentStats(tournamentStatsRes.data)
      })
      axios.get(`http://localhost:8000/tournament_player_stats/${tournamentPk}`).then((tournamentPlayerStatsRes) => {
        setTournamentPlayerStats(tournamentPlayerStatsRes.data)
      })
      axios.get(`http://localhost:8000/tournament_player_info/${tournamentPk}`).then((tournamentPlayerInfoRes) => {
        setTournamentPlayerInfo(tournamentPlayerInfoRes.data)
      })
    } else {
      axios.get(`http://localhost:8000/tournament/${tournamentPk}`).then((tournamentRes) => {
        const tournamentResObj = tournamentRes.data as TournamentObject[] | undefined
        setTournamentArray(tournamentResObj)
      })
    }
  }, [tournamentPk])

  // TODO write a single endpoint for this whole thing.
  if (!playerPk) {
    return (
      <BasicResponse>
        Tournament info is limited to logged in users.
      </BasicResponse>
    )
  } if (tournamentPk) {
    const thisBracket = calculateBracket(10, tournament ? tournament.bracket.teams.length : 6, 4)
    const convertedBracket = !tournament ? <Loading /> : convertBracketToView(thisBracket, tournament)
    const convertedStats = !tournamentStats ? <Loading /> : convertStatsToView(tournamentStats)

    return (
      <Container>
        <Row className="mb-4">
          <Col>
            {!tournament && <Loading />}
            <h1 className="text-center">
              {tournament && tournament.name}
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className="mb-4">
              <h2 className="text-center">
                Current Standings
              </h2>
              {convertedStats}
            </Row>
            <Row className="mb-4">
              <h2 className="text-center">
                Full Bracket
              </h2>
              {convertedBracket}
            </Row>
            {/* <Row> */}
            {/*   <h2 className="text-center"> */}
            {/*     Tournament Stats */}
            {/*   </h2> */}
            {/*   TODO */}
            {/* </Row> */}
          </Col>
        </Row>
      </Container>
    )
  }
  return (
    <>
      <BasicList
        listObject={[...(tournamentArray || []), {pk: '/add_tournament', name: 'Add Tournament'}]}
      />
    </>
  )
}
