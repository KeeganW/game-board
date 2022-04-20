import { createContext } from 'react'

export const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: (auth: boolean) => {},
  playerPk: -1,
  setPlayerPk: (playerPk: number) => {},
  groupPk: -1,
  setGroupPk: (groupPk: number) => {},
  groupName: '',
  setGroupName: (groupName: string) => {},
  groupImageUrl: '',
  setGroupImageUrl: (groupImageUrl: string) => {},
})
