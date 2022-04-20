

export type PlayerObjectLite = {
  pk: number
  username: string
}

export type GameObject = {
  pk: number
  name: string
}

export type PlayerRankObject = {
  pk: number
  score: string
  rank: string
  player: PlayerObjectLite
}

export type RoundObject = {
  pk: number
  date: string
  game: GameObject
  players: PlayerRankObject[]
  group: number
}

export type BracketMatchesObject = {
  pk: number
  match: number
  round: RoundObject
}

export type TeamObject = {
  pk: number
  color: string
  name: string
  players: PlayerObjectLite[]
}

export enum BracketTypes {
  ROUND_ROBIN = 'Round Robin',
}

export type BracketObject = {
  pk: number
  type: BracketTypes
  // TODO change this to matches
  rounds: BracketMatchesObject[]
  teams: TeamObject[]
}

export type TournamentObject = {
  pk: number
  name: string
  group: number
  bracket: BracketObject
}

export type PlayerInfo = {
  playerPk: number
  groupPk: number
  groupName: string
  groupImageUrl: string
  detail: string
}
