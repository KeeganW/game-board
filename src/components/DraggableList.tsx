import React from 'react'
import { ActionIcon, Flex, Group, List, Text } from '@mantine/core'
import { UseListStateHandlers } from '@mantine/hooks'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { IconGripVertical, IconInfoCircle } from '@tabler/icons-react'
import classes from 'src/components/DraggableList.module.css'

export const DraggableList: React.FC<{
  children?: any
  state: any[]
  handlers: UseListStateHandlers<any>
  startIndex: number
  endIndex: number
}> = ({ children, state, handlers, startIndex, endIndex }) => {
  const draggableItems = state
    .slice(startIndex, endIndex)
    .map((item, index) => (
      <Draggable key={item.key} index={index} draggableId={item.key.toString()}>
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Group
              justify="space-between"
              className={classes.group}
              style={{
                borderStyle: 'solid',
                borderColor: 'lightgrey',
                borderWidth: '1px',
                borderRadius: '6px',
                margin: '4px',
                padding: '6px',
                fontSize: '14px',
                height: '36px',
              }}
            >
              <List.Item>
                <Text size="sm">{item.value}</Text>
              </List.Item>

              <Flex gap="5px" align="center">
                <ActionIcon
                  component="a"
                  href={`https://boardgamegeek.com/boardgame/${item?.round?.game?.bggId}`}
                  size="xs"
                  aria-label="Open in a new tab"
                  target="_blank"
                  variant="transparent"
                >
                  <IconInfoCircle
                    className={`${classes.icon} ${classes.iconLarger} ${classes.iconHover}`}
                  />
                </ActionIcon>

                <IconGripVertical className={classes.icon} />
              </Flex>
            </Group>
          </div>
        )}
      </Draggable>
    ))

  return (
    <div
      style={{
        marginBottom: '8px',
      }}
    >
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({
            from: source.index + startIndex,
            to: (destination?.index || 0) + startIndex,
          })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <List type="ordered">{draggableItems}</List>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {children}
      </DragDropContext>
    </div>
  )
}
