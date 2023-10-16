import React from 'react'
import { Grid } from '@mantine/core'

export const RowDisplay: React.FC<{
  rank: any
  player: any
  score: any
}> = ({ rank, player, score }) => {
  return (
    <Grid px="sm">
      {rank ? <Grid.Col span={1}>{rank}</Grid.Col> : undefined}

      {player ? (
        <Grid.Col
          span="auto"
          style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {player}
        </Grid.Col>
      ) : undefined}

      {score ? <Grid.Col span="content">{score}</Grid.Col> : undefined}
    </Grid>
  )
}
