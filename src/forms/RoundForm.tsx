import React, { useState } from 'react'
import { GameObject, PlayerObjectFull, PlayerObjectLite } from 'src/types'
import {
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Title,
  Text,
  Switch,
  rem,
  Center,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { clone } from 'lodash'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'

export const RoundForm: React.FC<{
  form: any
  gameOptions: any
  playerOptions: any
  hideInstructions?: boolean
  disableGameSubmission?: boolean
  disableDateSubmission?: boolean
  disablePlayersSubmission?: boolean
  disableSubmitterSubmission?: boolean
  disableRanksSubmission?: boolean
  disableScoresSubmission?: boolean
  hideGameSubmission?: boolean
  hideDateSubmission?: boolean
  hidePlayersSubmission?: boolean
  hideRanksSubmission?: boolean
  hideScoresSubmission?: boolean
}> = ({
  form,
  gameOptions,
  playerOptions,
  hideInstructions,
  disableGameSubmission,
  disableDateSubmission,
  disablePlayersSubmission,
  disableSubmitterSubmission,
  disableRanksSubmission,
  disableScoresSubmission,
  hideGameSubmission,
  hideDateSubmission,
  hidePlayersSubmission,
  hideRanksSubmission,
  hideScoresSubmission,
}) => {
  // Search trackers
  const [searchGame, onSearchGameChange] = useState('')
  const [searchPlayers, onSearchPlayersChange] = useState('')

  // Handle searches, looking for enter to try to assign the first value.
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

  const selectedPlayerObjects = playerOptions?.filter(
    (value: PlayerObjectFull) => form.values.players.includes(value.username)
  )

  // Return the actual form itself
  return (
    <>
      {hideInstructions ? undefined : (
        <>
          <Title order={1}>Add a Round</Title>
          <Text mt="sm" mb="sm" fz="sm">
            Use this form to add the information for a game round that you
            played in. This information will be used for statistic tracking.
          </Text>
        </>
      )}
      {hideGameSubmission ? undefined : (
        <Select
          label="Game"
          placeholder="The game you played"
          onSearchChange={onSearchGameChange}
          searchValue={searchGame}
          searchable
          clearable
          allowDeselect
          disabled={disableGameSubmission}
          nothingFound="No games"
          data={gameOptions?.map((value: GameObject) => value.name) || []}
          onKeyDown={handleSearchGameKeyDown}
          {...form.getInputProps('game')}
        />
      )}
      {hideDateSubmission ? undefined : (
        <DateInput
          label="Date Played"
          placeholder="The date you played it"
          disabled={disableDateSubmission}
          maw={400}
          mx="auto"
          {...form.getInputProps('date')}
        />
      )}
      {hidePlayersSubmission ? undefined : (
        <MultiSelect
          label="Players"
          placeholder="The players who played"
          onSearchChange={onSearchPlayersChange}
          searchValue={searchPlayers}
          searchable
          clearable
          disabled={disablePlayersSubmission}
          mb="sm"
          nothingFound="No players"
          data={
            playerOptions?.map((value: PlayerObjectFull) => ({
              value: value.username,
              label: `${value.firstName} ${value.lastName}`,
            })) || []
          }
          onKeyDown={handleSearchPlayersKeyDown}
          {...form.getInputProps('players')}
        />
      )}

      {form.values.players.length > 0 && (
        <Select
          id="submitter"
          label="Sportsmanship Submitter (you)"
          disabled={disableSubmitterSubmission}
          data={
            selectedPlayerObjects?.map((value: PlayerObjectFull) => ({
              value: value.username,
              label: `${value.firstName} ${value.lastName}`,
            })) || []
          }
          {...form.getInputProps('submitter')}
        />
      )}

      {form.values.players &&
        form.values.players.map((playerUsername: string) => {
          // Use the amount of players for ranks
          const ranks: string[] = []
          for (let i = 0; i < form.values.players.length; i += 1) {
            ranks.push(`${i + 1}`)
          }

          // Get player information
          const playerObjects = playerOptions?.filter(
            (value: PlayerObjectFull) => value.username === playerUsername
          )
          const playerObject = playerObjects ? playerObjects[0] : undefined

          const heartIcon = (
            <IconHeartFilled
              style={{ width: rem(16), height: rem(16) }}
              stroke={2.5}
              color="white"
            />
          )

          const emptyHeartIcon = (
            <IconHeart
              style={{ width: rem(16), height: rem(16) }}
              stroke={2.5}
              color="gray"
            />
          )

          return (
            <Paper m="sm" p="md">
              <Title order={4}>
                {playerObject
                  ? `${playerObject.firstName} ${playerObject.lastName}`
                  : playerUsername}
              </Title>

              <Center m="md">
                <Switch
                  size="sm"
                  color="red"
                  labelPosition="left"
                  label="Sportsmanship"
                  onLabel={heartIcon}
                  offLabel={emptyHeartIcon}
                  {...form.getInputProps(`honor-input-${playerUsername}`)}
                />
              </Center>

              {hideScoresSubmission ? undefined : (
                <NumberInput
                  id={`score-input-${playerUsername}`}
                  label="Score"
                  disabled={disableScoresSubmission}
                  min={0}
                  {...form.getInputProps(`score-input-${playerUsername}`)}
                />
              )}

              {hideRanksSubmission ? undefined : (
                <Select
                  id={`rank-input-${playerUsername}`}
                  label="Rank"
                  disabled={disableRanksSubmission}
                  data={ranks}
                  {...form.getInputProps(`rank-input-${playerUsername}`)}
                />
              )}
            </Paper>
          )
        })}
    </>
  )
}
