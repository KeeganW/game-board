import React from 'react'
import { CenteredPage } from 'src/components/CenteredPage'
import { Button, Center, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import axios from 'src/axiosAuth'

const GameForm: React.FC<{
  form: any
}> = ({ form }) => {
  return (
    <CenteredPage>
      <h3>Add Game</h3>
      <TextInput label="Game Name" {...form.getInputProps('name')} />
      <TextInput label="BGG ID" {...form.getInputProps('bgg_id')} />
    </CenteredPage>
  )
}

export const AddGame: React.FC = () => {
  const initialValues = {
    initialValues: {},
  }
  const form = useForm(initialValues)

  const handleOnSubmit = (data: any) => {
    // Get our objects
    axios
      .post('/add_game/', data, {})
      .then(() => {
        // Player was logged in, we should have credentials, so redirect
        window.location.href = '#/'
      })
      .catch(res => {
        notifications.show({
          color: 'red',
          title: 'Submission Error',
          message:
            // eslint-disable-next-line no-underscore-dangle
            res.response.data?.errors?.__all__ || 'Error submitting this game.',
        })
      })
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
        <GameForm form={form} />
        <Center>
          <Button type="submit">Submit</Button>
        </Center>
      </form>
    </CenteredPage>
  )
}
