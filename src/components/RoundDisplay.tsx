import React, { useContext } from 'react'
import moment from 'moment'
import { PlayerRankObject, RoundObject, TeamObject } from 'src/types'
import { HoverTooltip } from 'src/components/HoverTooltip'
import { CardDisplay } from 'src/components/CardDisplay'
import { PlayerRankDisplay } from 'src/components/PlayerRankDisplay'
import { RowDisplay } from 'src/components/RowDisplay'
import { AuthContext } from '../Context'

export const RoundDisplay: React.FC<{
  children?: any
  action?: any
  disabled?: boolean
  roundObject: RoundObject
  teamColorMapping?: Map<number | string, string>
  showTournamentScores?: boolean
  modifiedScoring?: boolean
  teamGame?: boolean
  useUsernames?: boolean
  usePlayer?: boolean
  isSchedule?: boolean
  highlightPlayerPk?: number
}> = ({
  children,
  action,
  disabled,
  roundObject,
  teamColorMapping,
  showTournamentScores,
  modifiedScoring,
  teamGame,
  useUsernames,
  usePlayer,
  isSchedule,
  highlightPlayerPk,
}) => {
  const { playerPk } = useContext(AuthContext)
  const { hostTeam } = roundObject
  // Get the players and their scores/ranks listed out
  const roundScores = roundObject.playerRanks
    ?.sort((a: PlayerRankObject, b: PlayerRankObject) => {
      if (a.rank && b.rank) {
        return a.rank - b.rank
      }
      // Move representing to the top.
      if (a.representing?.name === hostTeam?.name) {
        return -1
      }
      if (b.representing?.name === hostTeam?.name) {
        return 1
      }
      return a.rank - b.rank
    })
    .map((playerRankObject: PlayerRankObject) => {
      return (
        <PlayerRankDisplay
          playerRankObject={playerRankObject}
          teamColorMapping={teamColorMapping}
          showTournamentScores={showTournamentScores}
          modifiedScoring={modifiedScoring}
          hostTeam={hostTeam}
          teamGame={teamGame}
          useUsernames={useUsernames}
          usePlayer={usePlayer}
          isSchedule={isSchedule}
          activePlayerPk={playerPk}
          highlightPlayerPk={highlightPlayerPk}
        />
      )
    })
  const scheduleScores = roundObject.scheduledTeams?.map(
    (teamObject: TeamObject) => {
      return (
        <PlayerRankDisplay
          playerRankObject={
            {
              player: teamObject.name,
              representing: teamObject,
            } as any
          }
          teamColorMapping={teamColorMapping}
          showTournamentScores={showTournamentScores}
          modifiedScoring={modifiedScoring}
          hostTeam={hostTeam}
          teamGame={teamGame}
          useUsernames={useUsernames}
          usePlayer={usePlayer}
          isSchedule={isSchedule}
          activePlayerPk={playerPk}
          highlightPlayerPk={highlightPlayerPk}
        />
      )
    }
  )

  const playerRanksHeader = (
    <RowDisplay
      rank={<HoverTooltip tooltip="Rank" text="R" />}
      player="Player"
      score={<HoverTooltip tooltip="Score" text="S" />}
    />
  )

  const roundMoment = moment(roundObject.date).set('hours', 19)
  const dateFromNow = roundMoment.fromNow()
  const datePretty = roundMoment.format('LL')
  const dateWithTooltip = (
    <HoverTooltip tooltip={datePretty} text={dateFromNow} />
  )

  const roundOrScheduleScores =
    roundScores.length > 0 ? roundScores : scheduleScores
  const roundScoresWithHeader = [playerRanksHeader, ...roundOrScheduleScores]
  // roundScores.length > 4
  //   ? [...roundScores.slice(0, 3), `and ${roundScores.length - 3} more...`]
  //   : roundScores

  return (
    <CardDisplay
      title={roundObject.game.name}
      subtitle={dateWithTooltip}
      action={action}
      disabled={disabled}
      content={isSchedule ? roundOrScheduleScores : roundScoresWithHeader}
    >
      {children}
    </CardDisplay>
  )
}
