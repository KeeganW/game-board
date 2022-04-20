import React, { useContext, useEffect, useState } from 'react'
import axios from 'src/axiosAuth'
import { useParams } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import {
  BracketMatchesObject,
  PlayerRankObject,
  TournamentObject,
} from 'src/types'
import {
  BasicList, BasicResponse, Loading, useUpdatePlayerInfo,
} from 'src/helpers'
import { Col, Container, Row } from 'react-bootstrap'
import { calculateBracket } from 'src/bracketLayout'

export const convertBracketToView = (bracket: number[][][], tournament: TournamentObject) => {
  const tournamentTeams = tournament.bracket.teams
  // TODO sort teams by pk

  const results = bracket.map((week: number[][], weekIndex: number) => {
    const roundsForWeek = week.map((round: number[], roundIndex: number, fullArray: any) => {
      const rounds = round.map((team: number, teamIndex: number) => (
        <div key={weekIndex + roundIndex + teamIndex}>
          {tournamentTeams[team].name}
        </div>
      ))
      const gameNumber = (weekIndex * fullArray.length) + roundIndex + 1
      const tournamentGame = tournament.bracket.rounds.find((value: BracketMatchesObject) => value.match === gameNumber)
      if (tournamentGame) {
        const { round } = tournamentGame
        const playerRanks = round.players.map((player: PlayerRankObject) =>
          // TODO sort players by score/rank
          (
            <div key={tournamentGame.match + player.player.username}>
              {player.rank}
              :
              {player.player.username}
              {player.score && ` - ${player.score}`}
            </div>
          ))
        return (
          <Col key={tournamentGame.match}>
            <h4>
              {round.game.name}
            </h4>
            {playerRanks}
          </Col>
        )
      }
      return (
        <Col key={`game${gameNumber}`}>
          <h4>
            Game
            {' '}
            {gameNumber}
          </h4>
          {rounds}
        </Col>
      )
    })
    return (
      <Row className="pb-2" key={weekIndex}>
        <h3>
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
    if (!tournament) {
      return <Loading />
    }
    const thisBracket = calculateBracket(10, 6, 4)

    const convertedBracket = convertBracketToView(thisBracket, tournament)

    return (
      <Container>
        <Row>
          <Col>
            <h1>
              {tournament.name}
            </h1>
          </Col>
        </Row>
        <Row>
          <Row>
            <h2>
              Current Standings
            </h2>
            TODO
          </Row>
          <Row>
            <h2>
              Full Bracket
            </h2>
            <Row>
              {convertedBracket}
            </Row>
          </Row>
          <Row>
            <h2>
              Tournament Stats
            </h2>
            TODO
          </Row>
        </Row>
      </Container>
    )
  }
  return (
    <BasicList
      listObject={tournamentArray}
    />
  )
}
