
export type DetailResponse = {
  detail: string
}

export type PlayerObjectLite = {
  pk: number
  username: string
}

export type PlayerObjectFull = {
  pk: number
  username: string
  firstName: string
  lastName: string
  dateOfBirth: string
  profileImage: string
  favoriteGame: GameObject
  primaryGroup: GroupObject
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

export type PlayerRankObject = {
  pk: number
  player: PlayerObjectLite
  score: number
  rank: number
  handicap: number
}

export type RoundObject = {
  pk: number
  game: GameObject
  date: string
  players: PlayerRankObject[]
  group: GroupObject
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

export enum BracketTypes {
  ROUND_ROBIN = 'Round Robin',
}

export type BracketObject = {
  pk: number
  type: BracketTypes
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
  playerPk: number
  numberGamesPlayed: number
  favoriteGame: GameObject
  lastGamesPlayed: RoundObject[]
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
