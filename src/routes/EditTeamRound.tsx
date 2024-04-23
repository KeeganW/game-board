import React, { useState } from 'react'
import { CenteredPage } from 'src/components/CenteredPage'
import { Button, Center, NumberInput, Select, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { GameObject, PlayerObjectFull, PlayerObjectLite } from 'src/types'
import { clone } from 'lodash'
import { useGetGame, useGetGroupPlayers } from 'src/utils/hooks'
import { isStillLoading } from 'src/utils/helpers'
import { Loading } from 'src/components/Loading'
import { notifications } from '@mantine/notifications'
import axios from 'src/axiosAuth'

const TeamRoundForm: React.FC<{
  form: any
  playerOptions?: any
  gameOptions?: any
}> = ({ form, playerOptions, gameOptions }) => {
  const [searchGame, onSearchGameChange] = useState('')
  const [searchPlayerOne, onSearchPlayerOneChange] = useState('')
  const [searchPlayerTwo, onSearchPlayerTwoChange] = useState('')

  const handleSearchGameKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      const filtered = gameOptions.filter((value: GameObject) =>
        value.name.toLowerCase().includes(searchGame)
      )
      if (filtered.length > 0) {
        onSearchGameChange('')
        form.setFieldValue('game', filtered[0].name)
      }
    }
  }
  const handleSearchPlayerOneKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      const filtered = playerOptions.filter(
        (value: PlayerObjectLite) =>
          value.username.toLowerCase().includes(searchPlayerOne) &&
          !form.values.players.includes(value.username)
      )
      if (filtered.length > 0) {
        onSearchPlayerOneChange('')
        const newPlayers = clone(form.values.players || [])
        newPlayers.push(filtered[0].username)
        form.setFieldValue('players', newPlayers)
      }
    }
  }
  const handleSearchPlayerTwoKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      const filtered = playerOptions.filter(
        (value: PlayerObjectLite) =>
          value.username.toLowerCase().includes(searchPlayerTwo) &&
          !form.values.players.includes(value.username)
      )
      if (filtered.length > 0) {
        onSearchPlayerTwoChange('')
        const newPlayers = clone(form.values.players || [])
        newPlayers.push(filtered[0].username)
        form.setFieldValue('players', newPlayers)
      }
    }
  }

  return (
    <CenteredPage>
      <h3>Add Team Round</h3>
      <Select
        label="Game"
        placeholder="The game being played"
        onSearchChange={onSearchGameChange}
        searchValue={searchGame}
        searchable
        clearable
        mb="sm"
        nothingFoundMessage="No games"
        data={gameOptions?.map((value: GameObject) => value.name) || []}
        onKeyDown={handleSearchGameKeyDown}
        {...form.getInputProps('game')}
      />
      <Select
        label="Player 1 (You)"
        placeholder="Your name"
        onSearchChange={onSearchPlayerOneChange}
        searchValue={searchPlayerOne}
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
        onKeyDown={handleSearchPlayerOneKeyDown}
        {...form.getInputProps('name-input-player-one')}
      />
      <NumberInput
        id="score-input-player-one"
        label="Player 1 Score"
        min={0}
        {...form.getInputProps(`score-input-player-one`)}
      />
      <Select
        label="Player 2 (Another Player)"
        placeholder="Another player's name"
        onSearchChange={onSearchPlayerTwoChange}
        searchValue={searchPlayerTwo}
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
        onKeyDown={handleSearchPlayerTwoKeyDown}
        {...form.getInputProps('name-input-player-two')}
      />
      <NumberInput
        id="score-input-player-two"
        label="Player 2 Score"
        min={0}
        {...form.getInputProps(`score-input-player-two`)}
      />
    </CenteredPage>
  )
}

export const EditTeamRound: React.FC = () => {
  const [roundAdded, setRoundAdded] = useState<number>(-1)

  // const { groupPk } = useContext(AuthContext)
  const groupPk = 1
  const playersResponse = useGetGroupPlayers(groupPk)
  const gamesResponse = useGetGame()

  const initialValues = {
    initialValues: {
      game: 'Cartographers',
      'score-input-player-one': 0,
      'score-input-player-two': 0,
    },
  }
  const form = useForm(initialValues)

  if (isStillLoading([playersResponse, gamesResponse])) {
    return <Loading />
  }

  if (roundAdded >= 0) {
    return <Title>Thank you for submitting!</Title>
  }

  const handleOnSubmit = (data: any) => {
    // Get our objects
    axios
      .post('/add_team_round/', data, {})
      .then(res => {
        // Player was logged in, we should have credentials, so redirect
        setRoundAdded(res.data.pk)
      })
      .catch(res => {
        notifications.show({
          color: 'red',
          title: 'Submission Error',
          message:
            // eslint-disable-next-line no-underscore-dangle
            res.response.data?.errors?.__all__ ||
            'Error submitting this round.',
        })
      })
  }

  const players = playersResponse.response.data[groupPk]
  const games = gamesResponse.response.data
  return (
    <CenteredPage>
      <form
        onSubmit={form.onSubmit(values =>
          handleOnSubmit({
            ...values,
          })
        )}
      >
        <TeamRoundForm
          form={form}
          playerOptions={players}
          gameOptions={games}
        />
        <Center>
          <Button type="submit">Submit</Button>
        </Center>
      </form>
    </CenteredPage>
  )
}
