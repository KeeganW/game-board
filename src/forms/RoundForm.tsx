import React, { useState } from 'react'
import { GameObject, PlayerObjectFull, PlayerObjectLite } from 'src/types'
import {
  MultiSelect,
  NumberInput,
  Select,
  Title,
  Text,
  Switch,
  rem,
  Center,
  Card,
  Divider, MultiSelectProps,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { clone, includes } from 'lodash'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'

export const RoundForm: React.FC<{
  form: any
  gameOptions: any
  playerOptions: any
  targetPlayerOptions?: any
  teamOptions: any
  matchPk?: any
  playerValidations?: any
  tournamentTeamPlayers?: any
  tournamentSchedule?: any
  // Handle hides and disables
  hideInstructions?: boolean
  hideSubstituteWarning?: boolean
  disableGameSubmission?: boolean
  disableDateSubmission?: boolean
  disablePlayersSubmission?: boolean
  disableScheduledTeamsSubmission?: boolean
  disableSubmitterSubmission?: boolean
  disableRanksSubmission?: boolean
  disableScoresSubmission?: boolean
  disableRepresentingSubmission?: boolean
  hideGameSubmission?: boolean
  hideDateSubmission?: boolean
  hidePlayersSubmission?: boolean
  hideScheduledTeamsSubmission?: boolean
  hideRanksSubmission?: boolean
  hideScoresSubmission?: boolean
  hideRepresentingSubmission?: boolean
}> = ({
  form,
  gameOptions,
  playerOptions,
  targetPlayerOptions,
  teamOptions,
  matchPk,
  playerValidations,
  tournamentTeamPlayers,
  tournamentSchedule,
  hideInstructions,
  hideSubstituteWarning,
  disableGameSubmission,
  disableDateSubmission,
  disablePlayersSubmission,
  disableScheduledTeamsSubmission,
  disableSubmitterSubmission,
  disableRanksSubmission,
  disableScoresSubmission,
  disableRepresentingSubmission,
  hideGameSubmission,
  hideDateSubmission,
  hidePlayersSubmission,
  hideScheduledTeamsSubmission,
  hideRanksSubmission,
  hideScoresSubmission,
  hideRepresentingSubmission,
}) => {
  // Search trackers
  const [searchGame, onSearchGameChange] = useState('')
  const [searchPlayers, onSearchPlayersChange] = useState('')
  const [searchScheduledTeams, onSearchScheduledTeamsChange] = useState('')
  const [searchHostTeam, onSearchHostTeamChange] = useState('')
  const [showRanks, setShowRanks] = useState(false)

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
  const handleSearchScheduledTeamsKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      // TODO(keegan): get this working
      // const filtered = playerOptions.filter(
      //   (value: TeamObjectExposed) =>
      //     value.username.toLowerCase().includes(searchPlayers) &&
      //     !form.values.players.includes(value.username)
      // )
      // if (filtered.length > 0) {
      //   onSearchPlayersChange('')
      //   const newPlayers = clone(form.values.players || [])
      //   newPlayers.push(filtered[0].username)
      //   form.setFieldValue('players', newPlayers)
      // }
    }
  }
  const handleSearchHostTeamKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      // TODO(keegan): get this working
      // const filtered = playerOptions.filter(
      //   (value: TeamObjectExposed) =>
      //     value.username.toLowerCase().includes(searchPlayers) &&
      //     !form.values.players.includes(value.username)
      // )
      // if (filtered.length > 0) {
      //   onSearchPlayersChange('')
      //   const newPlayers = clone(form.values.players || [])
      //   newPlayers.push(filtered[0].username)
      //   form.setFieldValue('players', newPlayers)
      // }
    }
  }

  // Loop over the player possibilities to get the list of selected ones.
  const selectedPlayerObjects = playerOptions?.filter(
    (value: PlayerObjectFull) => form.values.players.includes(value.username)
  )

  // Get the teams playing for this scheduled game
  const scheduledTeams: string[] = []
  if (tournamentSchedule) {
    tournamentSchedule.forEach((week: any[]) => {
      week.forEach((match: any) => {
        if (match.pk && Number(match.pk) === Number(matchPk)) {
          const scheduledPlayerRanks = match.round.scheduledTeams || []
          scheduledPlayerRanks.forEach((scheduledTeam: any) => {
            if (
              scheduledTeam.name &&
              !includes(scheduledTeams, scheduledTeam.name)
            ) {
              scheduledTeams.push(scheduledTeam.name)
            }
          })
        }
      })
    })
  }

  // Use the amount of players for ranks
  const ranks: string[] = []
  for (let i = 0; i < form.values.players.length; i += 1) {
    ranks.push(`${i + 1}`)
  }

  // Maintain a list of players who still need to submit validation
  const playersWhoNeedToValidate: any[] = []
  const playerSubmitterOptionsAll: any[] = []
  // Get all the players possible for submitter options.
  selectedPlayerObjects?.forEach((selectedPlayer: PlayerObjectFull) => {
    const selectedPlayerUsername: string = selectedPlayer.username

    // Get the team that this selected player is on
    let selectedPlayerTeam: string | undefined
    if (
      tournamentTeamPlayers &&
      tournamentTeamPlayers[selectedPlayerUsername]
    ) {
      selectedPlayerTeam = tournamentTeamPlayers[selectedPlayerUsername]
    }

    // If the player doesn't have a team, then they are not part of this tournament, and are subbing
    const playerInTournament = !!selectedPlayerTeam
    // If the player has a team, but it isn't scheduled, then they are subbing
    const playerTeamScheduled = !!(
      selectedPlayerTeam && scheduledTeams.includes(selectedPlayerTeam)
    )

    // Create a more in depth object about this player
    const playerOption = {
      value: selectedPlayerUsername,
      label: `${selectedPlayer.firstName} ${selectedPlayer.lastName}`,
      ...selectedPlayer,
      team: selectedPlayerTeam,
      inTournament: playerInTournament,
      teamScheduled: playerTeamScheduled,
    }

    // If the player is part of the validation list, make it an option to validate with
    if (playerValidations && !playerValidations[selectedPlayerUsername]) {
      playersWhoNeedToValidate.push(playerOption)
    }
    playerSubmitterOptionsAll.push(playerOption)
  })

  const renderPlayersMultiSelectOption: MultiSelectProps['renderOption'] = ({ option }) => {
    const optionInTargetPlayerOptions = targetPlayerOptions.some((targetOption: PlayerObjectLite) => targetOption.username === option.value)
    return (
      <div>
        <Text size="sm" style={optionInTargetPlayerOptions ? { fontWeight: 'bold' } : {}}>{option.label}</Text>
      </div>
    )
  };

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

      {hideScheduledTeamsSubmission ? undefined : (
        <MultiSelect
          label="Scheduled Teams"
          placeholder="The teams that are supposed to play"
          onSearchChange={onSearchScheduledTeamsChange}
          searchValue={searchScheduledTeams}
          searchable
          clearable
          disabled={disableScheduledTeamsSubmission}
          mb="sm"
          nothingFound="No teams"
          data={teamOptions || []}
          onKeyDown={handleSearchScheduledTeamsKeyDown}
          {...form.getInputProps('scheduledTeams')}
        />
      )}
      {hideScheduledTeamsSubmission ? undefined : (
        <Select
          label="Host Team"
          placeholder="The host of the game"
          onSearchChange={onSearchHostTeamChange}
          searchValue={searchHostTeam}
          searchable
          clearable
          allowDeselect
          disabled={disableScheduledTeamsSubmission}
          nothingFound="No team"
          data={teamOptions || []}
          onKeyDown={handleSearchHostTeamKeyDown}
          {...form.getInputProps('hostTeam')}
        />
      )}

      {!hideRanksSubmission ? undefined : (
        <Switch
          mt="xs"
          label="Manually set place (for tiebreakers)"
          checked={showRanks}
          onChange={event => setShowRanks(event.currentTarget.checked)}
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
          renderOption={renderPlayersMultiSelectOption}
          onKeyDown={handleSearchPlayersKeyDown}
          {...form.getInputProps('players')}
        />
      )}

      {form.values.players.length > 0 && (
        <Select
          id="submitter"
          label="Who are you?"
          disabled={disableSubmitterSubmission}
          data={
            playersWhoNeedToValidate.length > 0
              ? playersWhoNeedToValidate
              : playerSubmitterOptionsAll || []
          }
          {...form.getInputProps('submitter')}
        />
      )}

      {form.values.players.length > 0 && <Divider my="sm" />}

      {/* We use the form value for players here, in case we have a case where the player object
           doesn't exist, we still want to be able to edit them. */}
      {form.values.players &&
        form.values.players.map((playerUsername: string) => {
          // Get player information
          const playerObjects = playerSubmitterOptionsAll?.filter(
            (value: PlayerObjectFull) => value.username === playerUsername
          )
          const playerObject = playerObjects ? playerObjects[0] : undefined
          const playerIsSubmitter = playerUsername === form.values.submitter

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

          const defaultTeam =
            playerObject?.inTournament && playerObject?.teamScheduled
              ? playerObject.team
              : undefined

          // Compare the default team to the initial value for the form
          const { value: initialTeamValue } = form.getInputProps(
            `representing-input-${playerUsername}`
          )

          // If the initial value is undefined, and we have a default team, set the initial value
          const newInitialValue = initialTeamValue || defaultTeam
          if (initialTeamValue !== newInitialValue) {
            form.setFieldValue(
              `representing-input-${playerUsername}`,
              newInitialValue
            )
          }

          // Show sub warning if user tries to enter a sub
          const showSubstituteWarning = playerObject?.firstName === 'Substitute'

          if (
            playerIsSubmitter &&
            hideRepresentingSubmission &&
            hideScoresSubmission &&
            hideRanksSubmission
          ) {
            return undefined
          }

          return (
            <Card withBorder shadow="sm" radius="md" m="" my="sm" p="sm" pt="">
              <Center m="sm">
                <Title order={4}>
                  {playerObject
                    ? `${playerObject.firstName} ${playerObject.lastName}`
                    : playerUsername}
                </Title>
              </Center>

              {showSubstituteWarning && !hideSubstituteWarning ? (
                <Title order={5} style={{ color: 'orangered' }}>
                  Please use the actual player&apos;s name, not the substitute
                  for this team! Only use substitutes if the player&apos;s name
                  doesn&apos;t exist.
                </Title>
              ) : undefined}

              {playerIsSubmitter ? undefined : (
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
              )}

              {hideRepresentingSubmission ? undefined : (
                <Select
                  id={`representing-input-${playerUsername}`}
                  label="Subbing for"
                  disabled={disableRepresentingSubmission}
                  data={scheduledTeams}
                  // Hiding this breaks mantine form things, so don't actually hide it, use this hack
                  style={
                    defaultTeam
                      ? { visibility: 'hidden', position: 'absolute' }
                      : {}
                  }
                  {...form.getInputProps(
                    `representing-input-${playerUsername}`
                  )}
                />
              )}

              {hideScoresSubmission ? undefined : (
                <NumberInput
                  id={`score-input-${playerUsername}`}
                  label="Score"
                  disabled={disableScoresSubmission}
                  min={0}
                  {...form.getInputProps(`score-input-${playerUsername}`)}
                />
              )}

              {hideRanksSubmission && !showRanks ? undefined : (
                <Select
                  id={`rank-input-${playerUsername}`}
                  label="Place"
                  disabled={disableRanksSubmission}
                  data={ranks}
                  {...form.getInputProps(`rank-input-${playerUsername}`)}
                />
              )}
            </Card>
          )
        })}
    </>
  )
}
