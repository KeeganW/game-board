import React, { useContext, useState } from 'react'
import { CenteredPage } from 'src/components/CenteredPage'
import {
  Button,
  Center,
  Checkbox,
  NumberInput,
  Select,
  TextInput,
  Title,
  Text,
  Group,
  ActionIcon,
  ColorInput,
  MultiSelect,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import axios from 'src/axiosAuth'
import { notifications } from '@mantine/notifications'
import { Navigate } from 'react-router-dom'
import { IconTrash } from '@tabler/icons-react'
import { randomId } from '@mantine/hooks'
import { clone } from 'lodash'
import { GameObject, PlayerObjectFull, PlayerObjectLite } from '../types'
import { AuthContext } from '../Context'
import { useGetGame, useGetGroupPlayers } from '../utils/hooks'
import { isStillLoading } from '../utils/helpers'
import { Loading } from '../components/Loading'

const TournamentForm: React.FC<{
  form: any
}> = ({ form }) => {
  return (
    <CenteredPage>
      <h3>Add Tournament</h3>
      <TextInput label="Tournament Name" {...form.getInputProps('name')} />
      <Select
        label="Tournament Type"
        data={['Team', 'Individual']}
        {...form.getInputProps('type')}
      />
      <DateInput label="Start Date" {...form.getInputProps('startDate')} />
      <Select
        label="Round Frequency"
        data={['Week', 'Day', 'None']}
        {...form.getInputProps('roundFrequency')}
      />
      Note: None means it is up to the tournament directors to provide dates.
      <NumberInput
        label="Tournament Length"
        {...form.getInputProps('length')}
      />
      <Checkbox
        label="Include Playoffs"
        {...form.getInputProps('includePlayoffs', { type: 'checkbox' })}
      />
      <NumberInput
        label="Number of Playoff Rounds"
        {...form.getInputProps('playoffRounds')}
      />
      <NumberInput label="Game Size" {...form.getInputProps('gameSize')} />
    </CenteredPage>
  )
}

type TeamFormObject = {
  key: string
  name: string
  players: string[]
  games: string[]
  color: string
}
const TeamsForm: React.FC<{
  form: any
  playerOptions?: any
  gameOptions?: any
}> = ({ form, playerOptions, gameOptions }) => {
  const [searchGames, onSearchGamesChange] = useState('')
  const [searchPlayers, onSearchPlayersChange] = useState('')
  const [indexBeingSearched, setIndexBeingSearched] = useState(-1)
  const teams = form
    .getValues()
    .teams.map((item: TeamFormObject, index: number) => {
      const handleSearchGamesKeyDown = (event: any) => {
        setIndexBeingSearched(index)
        if (event.key === 'Enter') {
          const filtered = gameOptions.filter(
            (value: GameObject) =>
              value.name.toLowerCase().includes(searchGames) &&
              !item.games.includes(value.name)
          )
          if (filtered.length > 0) {
            onSearchGamesChange('')
            const newGames = clone(item.games || [])
            newGames.push(filtered[0].name)
            form.setFieldValue(`teams.${index}.games`, newGames)
          }
        }
      }
      const handleSearchPlayersKeyDown = (event: any) => {
        setIndexBeingSearched(index)
        if (event.key === 'Enter') {
          const filtered = playerOptions.filter(
            (value: PlayerObjectLite) =>
              value.username.toLowerCase().includes(searchPlayers) &&
              !item.players.includes(value.username)
          )
          if (filtered.length > 0) {
            onSearchPlayersChange('')
            const newPlayers = clone(item.players || [])
            newPlayers.push(filtered[0].username)
            form.setFieldValue(`teams.${index}.players`, newPlayers)
          }
        }
      }

      return (
        <Group key={item.key} mt="xs">
          <TextInput
            label="Team Name"
            style={{ flex: 1 }}
            {...form.getInputProps(`teams.${index}.name`)}
          />
          <ColorInput
            label="Team Color"
            {...form.getInputProps(`teams.${index}.color`)}
          />
          <MultiSelect
            label="Players"
            placeholder="The players on this team"
            onSearchChange={onSearchPlayersChange}
            searchValue={indexBeingSearched === index ? searchPlayers : ''}
            searchable
            clearable
            nothingFoundMessage="No players"
            data={
              playerOptions?.map((value: PlayerObjectFull) => ({
                value: value.username,
                label: `${value.firstName} ${value.lastName}`,
              })) || []
            }
            onKeyDown={handleSearchPlayersKeyDown}
            {...form.getInputProps(`teams.${index}.players`)}
          />
          <MultiSelect
            label="Games"
            placeholder="The games this team wants to play"
            onSearchChange={onSearchGamesChange}
            searchValue={indexBeingSearched === index ? searchGames : ''}
            searchable
            clearable
            nothingFoundMessage="No games"
            data={gameOptions?.map((value: GameObject) => value.name) || []}
            onKeyDown={handleSearchGamesKeyDown}
            {...form.getInputProps(`teams.${index}.games`)}
          />
          <ActionIcon
            mt="lg"
            color="red"
            onClick={() => form.removeListItem('teams', index)}
          >
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      )
    })

  return (
    <CenteredPage>
      {teams}
      <Group justify="center" mt="md">
        <Button
          onClick={() =>
            form.insertListItem('teams', {
              name: '',
              color: '#ffffff',
              players: [],
              games: [],
              key: randomId(),
            })
          }
        >
          Add Team
        </Button>
      </Group>
    </CenteredPage>
  )
}

export const AddTournament: React.FC = () => {
  const { groupPk } = useContext(AuthContext)

  const playersResponse = useGetGroupPlayers(groupPk)
  const gamesResponse = useGetGame()

  const [tournamentAdded, setTournamentAdded] = useState<number>(-1)
  // States: 0 = Intro, 1 = Tournament Details, 2 = Team Entry, 3 = Review/Submit
  const [currentState, setCurrentState] = useState<number>(0)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      type: 'Team',
      startDate: new Date(),
      roundFrequency: 'None',
      length: 10,
      includePlayoffs: false,
      playoffRounds: 0,
      gameSize: 4,
      teams: [
        { name: '', color: '#ffffff', players: [], games: [], key: randomId() },
      ],
    },
  })

  if (isStillLoading([playersResponse, gamesResponse])) {
    return <Loading />
  }

  if (tournamentAdded >= 0) {
    return <Navigate replace to={`/tournament/${tournamentAdded}`} />
  }

  const players = playersResponse.response.data[groupPk]
  const games = gamesResponse.response.data

  const handleOnSubmit = (data: any) => {
    // Get our objects
    axios
      .post('/add_tournament/', data, {})
      .then(res => {
        // Player was logged in, we should have credentials, so redirect
        setTournamentAdded(res.data.pk)
      })
      .catch(res => {
        notifications.show({
          color: 'red',
          title: 'Submission Error',
          message:
            // eslint-disable-next-line no-underscore-dangle
            res.response.data?.errors?.__all__ ||
            'Error submitting this tournament.',
        })
      })
  }

  const nextButtonClicked = () => setCurrentState(currentState + 1)
  const prevButtonClicked = () => setCurrentState(currentState - 1)

  const tournamentConfigObject = () => {
    switch (currentState) {
      case 0: // Info on adding a tournament
        return (
          <CenteredPage>
            <Title>Welcome to the Tournament Creator!</Title>
            <Text>
              Create exhilarating board game tournaments and bring out the
              competitive spirit in your friends or community. Customize your
              tournament settings below and let the games begin!
            </Text>
            <Center>
              <Button onClick={nextButtonClicked}>Next</Button>
            </Center>
          </CenteredPage>
        )
      case 1: // Tournament Configuration
        return (
          <CenteredPage>
            <Title>Configure Tournament</Title>
            <TournamentForm form={form} />
            <Center>
              <Button variant="default" onClick={prevButtonClicked} mr="sm">
                Previous
              </Button>
              <Button onClick={nextButtonClicked}>Next</Button>
            </Center>
          </CenteredPage>
        )
      case 2: // Enter Team Information
        return (
          <CenteredPage>
            <Title>Add Teams and Games</Title>
            <TeamsForm
              form={form}
              playerOptions={players}
              gameOptions={games}
            />
            <Center>
              <Button variant="default" onClick={prevButtonClicked} mr="sm">
                Previous
              </Button>
              <Button onClick={nextButtonClicked}>Next</Button>
            </Center>
          </CenteredPage>
        )
      case 3: // Review
        return (
          <CenteredPage>
            <Title>Review</Title>
            TODO
            <Center>
              <Button variant="default" onClick={prevButtonClicked} mr="sm">
                Previous
              </Button>
              <Button type="submit">Submit</Button>
            </Center>
          </CenteredPage>
        )
      default:
        return null
    }
  }

  return (
    <CenteredPage>
      <form
        onSubmit={form.onSubmit(values => {
          handleOnSubmit({
            ...values,
          })
        })}
      >
        {tournamentConfigObject()}
      </form>
    </CenteredPage>
  )
}
