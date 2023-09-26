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

export type GroupObject = {
  pk: number
  name: string
  players: PlayerObjectLite[]
  admins: PlayerObjectLite[]
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
  mostPlayedGame: GameObject
  primaryGroup: GroupObject
}

export type GroupObjectLite = {
  pk: number
  name: string
  players: number[]
  admins: number[]
  groupPicture: string
}

export type PlayerRankObject = {
  pk: number
  player: PlayerObjectFull
  score: number
  rank: number
  handicap: number
  tournamentHandicap: number
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
  group: GroupObject
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

export type TeamObject = {
  pk: number
  name: string
  color: string
  players: PlayerObjectLite[]
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
  mostPlayedGame: GameObject
  lastGamesPlayed: RoundObject[]
} & DetailResponse

type TeamScores = {
  [team: string]: number
}

export type TournamentStats = {
  rawScoresByTeam: TeamScores
  scoresByTeam: TeamScores
} & DetailResponse

export type TournamentTeamColors = Map<string, string> & DetailResponse

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
