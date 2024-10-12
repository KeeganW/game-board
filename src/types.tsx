import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export type FetchResponse = {
  response: AxiosResponse
  error: AxiosError
  loading: boolean
  request: AxiosRequestConfig
  sendData: () => undefined
}

export type DetailResponse = {
  detail: string
}

export type PlayerObjectLite = {
  pk: number
  username: string
}

export type GameObject = {
  pk: number
  name: string
  description: string
  gamePicture: string
}

export type GameObjectExposed = {
  pk: number
  name: string
  description: string
  gamePicture: string
}

export type GroupObject = {
  pk: number
  name: string
  players: PlayerObjectLite[]
  admins: PlayerObjectLite[]
  groupPicture: string
}

export type GroupObjectLite = {
  pk: number
  name: string
  players: number[]
  admins: number[]
  groupPicture: string
}

export type PlayerObjectFull = {
  pk: number
  username: string
  firstName: string
  lastName: string
  dateOfBirth: string
  profileImage: string
  favoriteGames: GameObject[]
  primaryGroup: GroupObject
}

export type PlayerObjectExposed = {
  username: string
  firstName: string
  lastName: string
}

export type TeamObject = {
  pk: number
  name: string
  color: string
  players: PlayerObjectLite[]
}

export type TeamObjectExposed = {
  pk: number
  name: string
  color: string
}

export type PlayerRankObject = {
  pk: number
  player: PlayerObjectFull
  representing: TeamObject
  score: number
  rank: number
  honor: number
  validated: boolean
  handicap: number
  tournamentHandicap: number
}

export type PlayerRankObjectExposed = {
  player: string
  score: number
  rank: number
}

export type PlayerRankObjectLite = {
  pk: number
  player: number
  score: number
  rank: number
  handicap: number
  tournamentHandicap: number
}

export type RoundObject = {
  pk: number
  game: GameObject
  date: string
  playerRanks: PlayerRankObject[]
  hostTeam: TeamObject
  scheduledTeams: TeamObject[]
  group: GroupObject
}

export type RoundObjectExposed = {
  pk: number
  game: GameObjectExposed
  date: string
  playerRanks: PlayerRankObjectExposed[]
  hostTeam: TeamObjectExposed
  scheduledTeams: TeamObjectExposed[]
  group: string
}

export type RoundObjectLite = {
  pk: number
  game: number
  date: string
  playerRanks: number[]
  group: number
}

export type BracketMatchesObject = {
  pk: number
  match: number
  round: RoundObject
  teamGame: boolean
  modifiedScoring: boolean
}

export type BracketMatchesObjectExposed = {
  match: number
  round: RoundObjectExposed
  teamGame: boolean
  modifiedScoring: boolean
}

// export enum BracketTypes {
//   ROUND_ROBIN = 'Round Robin',
// }

export type BracketObject = {
  pk: number
  // type: BracketTypes
  matches: BracketMatchesObject[]
  teams: TeamObject[]
}

export type TournamentObject = {
  pk: number
  name: string
  bracket: BracketObject
  group: number
}

export type PlayerStats = {
  numberGamesPlayed: number
  favoriteGames: GameObject[]
  lastGamesPlayed: RoundObject[]
} & DetailResponse

type TeamScores = {
  [team: string]: number
}

export type TournamentDifferentScores = {
  rawScoresByTeam: TeamScores
  scoresByTeam: TeamScores
}

export type TournamentStats = TournamentDifferentScores & DetailResponse

export type TournamentTeamColors = Map<[team: string], [color: string]> &
  DetailResponse

export type TournamentNames = {
  names: {
    pk: number
    name: string
  }
} & DetailResponse

export type TournamentScores = Map<
  [tournamentPk: string],
  TournamentDifferentScores
> &
  DetailResponse

export type TournamentSchedule = Map<
  [tournamentPk: string],
  [
    tournament: Array<
      [week: Array<[match: Array<BracketMatchesObjectExposed>]>]
    >
  ]
> &
  DetailResponse

export type WeekValidMatchPicks = Map<[week: number], number[]>

export type ValidMatchPicks = Map<[team: string], WeekValidMatchPicks>

export type TournamentDraft = {
  draft: {
    tournament: TournamentObject
    drafting: TeamObject
    order: TeamObject[]
    matches: BracketMatchesObject[]
    type: string
  }
  validMatchPicks: ValidMatchPicks
} & DetailResponse

export type TournamentDraftPreferences = {
  team: TeamObjectExposed
  preferences: BracketMatchesObjectExposed[]
} & DetailResponse

export type TournamentPlayers = Map<
  [tournamentPk: string],
  Map<[playerPk: string], PlayerObjectExposed>
> &
  DetailResponse

export type TournamentTeamPlayers = Map<
  [tournamentPk: string],
  Map<[playerPk: string], [teamName: string]>
> &
  DetailResponse

export type TournamentMatch = Map<
  [tournamentPk: string],
  BracketMatchesObject
> &
  DetailResponse

export type RecentRounds = {
  recentRounds: RoundObject[]
} & DetailResponse

export type TournamentMatches = {
  tournamentMatches: BracketMatchesObject[]
} & DetailResponse

export type PlayerInfo = {
  playerPk: number
  groupPk: number
  groupName: string
  groupImageUrl: string
} & DetailResponse

export type AddRoundInfo = {
  player: PlayerObjectLite
  group: GroupObject
  games: GameObject[]
} & DetailResponse

export type AddTournamentInfo = {
  teams: TeamObject[]
} & DetailResponse
