import { createContext } from 'react'

export const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: (auth: boolean) => {},
  player: -1,
  setPlayer: (player: number) => {}
});
