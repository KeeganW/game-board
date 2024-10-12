import React, { useEffect } from 'react'
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
  // const draftPreferences = tournamentDraftPreferences?.preferences

  return (
    <CenteredPage>
      <h2 className="text-center">Draft Preferences for {draftTeam.name}</h2>
      <Text style={{ maxWidth: '600px' }}>
        Please re-arrange the items in this list by dragging and dropping them,
        then saving your preferences. The order for your team should indicate
        your overall preference for games to be played in the designated week.
        Your picks will be factored into drafting, picking your highest
        available choice when it is your turn to draft.
      </Text>
      <h3 className="text-center">Week 6 - Oct 30th</h3>
      <DraggableList state={state} handlers={handlers} />
      <Center>
        <Button variant="primary" onClick={handleOnSubmit}>
          Save Preferences
        </Button>
      </Center>
    </CenteredPage>
  )
}
