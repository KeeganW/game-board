import React, { ReactNode, useEffect } from 'react'
import { useGetTournamentDraftPreferences } from 'src/utils/hooks'
import { Loading } from 'src/components/Loading'
import { isStillLoading } from 'src/utils/helpers'
import { BracketMatchesObjectExposed } from 'src/types'
import { Center, Text } from '@mantine/core'
import { CenteredPage } from 'src/components/CenteredPage'
import { useParams } from 'react-router-dom'
import { useListState } from '@mantine/hooks'
import { DraggableList } from 'src/components/DraggableList'
import axios from 'src/axiosAuth'
import { notifications } from '@mantine/notifications'
import { Button } from 'react-bootstrap'
import moment from 'moment'

export const DraftPreferences: React.FC = () => {
  const { token } = useParams()
  const [state, handlers] = useListState<BracketMatchesObjectExposed>([])

  const tournamentDraftPreferencesResponse =
    useGetTournamentDraftPreferences(token)
  const isLoading = isStillLoading([tournamentDraftPreferencesResponse])

  // When we get the data, set the draggable list state with it
  useEffect(() => {
    const preferences =
      tournamentDraftPreferencesResponse.response?.data?.preferences
    if (preferences) {
      const items =
        tournamentDraftPreferencesResponse.response.data.preferences.map(
          (item: BracketMatchesObjectExposed) => {
            return {
              ...item,
              key: item.match,
              value: item.round.game.name,
            }
          }
        )
      handlers.setState(items)
    }
  }, [isLoading])

  if (isLoading) {
    return <Loading />
  }

  const handleOnSubmit = () => {
    // Get our objects
    axios
      .post(`/draft_preferences/${token}/`, state, {})
      .then(() => {
        // Player was logged in, we should have credentials, so redirect
        notifications.show({
          color: 'green',
          title: 'Draft Preferences Saved!',
          message: 'You can safely close, or continue editing.',
        })
      })
      .catch(res => {
        notifications.show({
          color: 'red',
          title: 'Saving Error',
          message:
            // eslint-disable-next-line no-underscore-dangle
            res.response.data?.errors?.__all__ ||
            'Error updating draft preferences.',
        })
      })
  }

  const tournamentDraftPreferences =
    tournamentDraftPreferencesResponse.response?.data // Get draft

  const draftTeam = tournamentDraftPreferences?.team
  const draftSchedule = tournamentDraftPreferences?.schedule
  const draftPreferences = tournamentDraftPreferences?.preferences

  // Figure out what the min/max matches from the preferences are
  const minMatch = draftPreferences.reduce(
    (prev: BracketMatchesObjectExposed, curr: BracketMatchesObjectExposed) =>
      curr.match < prev.match ? curr : prev
  )
  const maxMatch = draftPreferences.reduce(
    (prev: BracketMatchesObjectExposed, curr: BracketMatchesObjectExposed) =>
      curr.match > prev.match ? curr : prev
  )

  const listsToShow: ReactNode[] = []
  let minMatchWeek = -1

  // Loop over the schedule to generate the draggable lists for all weeks in the preferences.
  draftSchedule.forEach(
    (schedule: BracketMatchesObjectExposed[], index: number) => {
      const numMatchesInWeek = schedule.length
      const numPreferencesInWeek = numMatchesInWeek - 1
      // If there are matches in the week
      if (numMatchesInWeek > 0) {
        const firstMatch = schedule[0]
        const weekNumber = index + 1
        const activeWeek =
          firstMatch.match >= minMatch.match &&
          firstMatch.match <= maxMatch.match

        // If we are setting preferences for the week
        if (activeWeek) {
          if (minMatchWeek < 0) {
            minMatchWeek = weekNumber
          }
          const dateString = moment(firstMatch.round.date).format('MMM Do')
          const hostGame: BracketMatchesObjectExposed[] = schedule.filter(
            (match: BracketMatchesObjectExposed) =>
              match.round.hostTeam.name === draftTeam.name
          )
          const hostGameName =
            hostGame.length > 0 ? hostGame[0].round.game.name : ''

          // Gather items needed for draggable list
          const title = `Week ${weekNumber} - ${dateString}`
          const startIndex = (weekNumber - minMatchWeek) * numPreferencesInWeek
          const endIndex = startIndex + numPreferencesInWeek

          // Add to the lists we want to show to the user
          listsToShow.push(
            <div>
              <h3 className="text-center">{title}</h3>
              {hostGameName ? (
                <h5 className="text-center">Hosting: {hostGameName}</h5>
              ) : null}
              <DraggableList
                state={state}
                handlers={handlers}
                startIndex={startIndex}
                endIndex={endIndex}
              />
              <Center>
                <Button variant="primary" onClick={handleOnSubmit}>
                  Save Preferences
                </Button>
              </Center>
            </div>
          )
        }
      }
    }
  )
  // TODO issue with later weeks dragging

  return (
    <CenteredPage>
      <h2 className="text-center">Draft Preferences for {draftTeam.name}</h2>
      <Text style={{ maxWidth: '600px' }}>
        Please rearrange the items in this list by dragging and dropping them,
        then saving your preferences. The order for your team should indicate
        your overall preference for games to be played in the designated week.
        Your picks will be factored into drafting, picking your highest
        available choice when it is your turn to draft.
      </Text>
      {listsToShow}
    </CenteredPage>
  )
}
