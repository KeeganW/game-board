import React, { useContext, useEffect, useState } from 'react'
import axios from 'src/axiosAuth'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import {
  BracketMatchesObject,
  PlayerRankObject, TeamObject,
  TournamentObject,
} from 'src/types'
import {
  BasicList,
  BasicResponse, CenteredPage,
  Loading,
  useParamsPk,
} from 'src/utils/helpers'
import {
  useGetTournament,
  useUpdatePlayerInfo,
} from 'src/utils/hooks'
import { Col, Container, Row } from 'react-bootstrap'
import { calculateBracket } from 'src/bracketLayout'
import { TournamentDetails } from './TournamentDetails'

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
  const tournamentPk = useParamsPk()

  const tournament = useGetTournament(tournamentPk)

  if (
    !tournament.response ||
    !tournament.response.data ||
    tournament.loading
  ) {
    return (
      <CenteredPage>
        <Loading/>
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (tournament.response.status === 401) {
    return <Navigate replace to="/logout/"/>
  }

  const tournamentInfo = tournament.response.data

  if (!tournamentPk) {
    return (
      <CenteredPage>
        <BasicList
          listObject={[
            ...(tournamentInfo || []),
            // Add this in, so that we can also add a new tournament if we want here.
            {pk: '/add_tournament', name: 'Add Tournament'},
          ]}
        />
      </CenteredPage>
    )
  } else {
    return (
      <CenteredPage>
        <TournamentDetails />
      </CenteredPage>
    )
  }
}
