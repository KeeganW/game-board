import React, { useContext, useState } from 'react'
import { CenteredPage } from 'src/components/CenteredPage'
import { ColorInput, MultiSelect, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { GameObject, PlayerObjectFull, PlayerObjectLite } from 'src/types'
import { clone } from 'lodash'
import { useGetGame, useGetGroupPlayers } from 'src/utils/hooks'
import { isStillLoading } from 'src/utils/helpers'
import { Loading } from 'src/components/Loading'
import { AuthContext } from 'src/Context'

const TeamForm: React.FC<{
  form: any
  playerOptions?: any
  gameOptions?: any
}> = ({ form, playerOptions, gameOptions }) => {
  const [searchGames, onSearchGamesChange] = useState('')
  const [searchPlayers, onSearchPlayersChange] = useState('')

  const handleSearchGamesKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      const filtered = gameOptions.filter((value: GameObject) =>
        value.name.toLowerCase().includes(searchGames)
      )
      if (filtered.length > 0) {
        onSearchGamesChange('')
        form.setFieldValue('game', filtered[0].name)
      }
    }
  }
  const handleSearchPlayersKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      const filtered = playerOptions.filter(
        (value: PlayerObjectLite) =>
          value.username.toLowerCase().includes(searchPlayers) &&
          !form.values.players.includes(value.username)
      )
      if (filtered.length > 0) {
        onSearchPlayersChange('')
        const newPlayers = clone(form.values.players || [])
        newPlayers.push(filtered[0].username)
        form.setFieldValue('players', newPlayers)
      }
    }
  }

  return (
    <CenteredPage>
      <h3>Add Team</h3>
      <TextInput label="Team Name" {...form.getInputProps('name')} />
      <ColorInput label="Team Color" {...form.getInputProps('color')} />
      <MultiSelect
        label="Players"
        placeholder="The players on this team"
        onSearchChange={onSearchPlayersChange}
        searchValue={searchPlayers}
        searchable
        clearable
        mb="sm"
        nothingFoundMessage="No players"
        data={
          playerOptions?.map((value: PlayerObjectFull) => ({
            value: value.username,
            label: `${value.firstName} ${value.lastName}`,
          })) || []
        }
        onKeyDown={handleSearchPlayersKeyDown}
        {...form.getInputProps('players')}
      />
      <MultiSelect
        label="Games"
        placeholder="The games this team wants to play"
        onSearchChange={onSearchGamesChange}
        searchValue={searchGames}
        searchable
        clearable
        mb="sm"
        nothingFoundMessage="No players"
        data={gameOptions?.map((value: GameObject) => value.name) || []}
        onKeyDown={handleSearchGamesKeyDown}
        {...form.getInputProps('games')}
      />
    </CenteredPage>
  )
}

export const AddTeam: React.FC = () => {
  const { groupPk } = useContext(AuthContext)

  const playersResponse = useGetGroupPlayers(groupPk)
  const gamesResponse = useGetGame()

  const initialValues = {
    initialValues: {
      color: '#ffffff',
    },
  }
  const form = useForm(initialValues)

  if (isStillLoading([playersResponse, gamesResponse])) {
    return <Loading />
  }

  const players = playersResponse.response.data[groupPk]
  const games = gamesResponse.response.data
  return <TeamForm form={form} playerOptions={players} gameOptions={games} />
}
