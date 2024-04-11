import React from 'react'
import { CenteredPage } from 'src/components/CenteredPage'
import { Checkbox, NumberInput, Select, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'

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

export const AddTournament: React.FC = () => {
  const initialValues = {
    initialValues: {
      date: new Date(),
      type: 'Team',
      roundFrequency: 'None',
      length: 10,
      includePlayoffs: false,
      playoffRounds: 0,
      gameSize: 4,
    },
  }
  const form = useForm(initialValues)
  return <TournamentForm form={form} />
}
