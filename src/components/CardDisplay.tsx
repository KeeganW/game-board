import React from 'react'
import { Card, Flex, Group, Overlay, Title } from '@mantine/core'

export const CardDisplay: React.FC<{
  children?: any
  title: any
  subtitle: any
  action?: any
  disabled?: boolean
  content: any
}> = ({ children, title, subtitle, action, disabled, content }) => {
  return (
    <Card withBorder shadow="sm" radius="md" pb="xl" style={{ width: '320px' }}>
      <Group justify="space-between">
        <Title order={3}>{title}</Title>
        {action}
      </Group>
      <Title order={6}>{subtitle}</Title>

      <Card.Section>
        <Flex
          direction={{ base: 'column', sm: 'column' }}
          // gap={{ base: 'sm', sm: 'lg' }}
          justify={{ base: 'center', sm: 'center' }}
        >
          {content}
        </Flex>
      </Card.Section>

      {children}

      {disabled && <Overlay color="#000" backgroundOpacity={0.35} />}
    </Card>
  )
}
