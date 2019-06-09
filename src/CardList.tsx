import React from 'react'
import {
  Droppable,
  Draggable,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'
import styled from 'styled-components/macro'
import CardItem from './CardItem'
import { DefaultTheme } from 'styled-components'
import { darken } from 'polished'

type Props = {
  title?: string
  listId: string
  listType: string
  cardIds: string[]
  ignoreContainerClipping?: boolean
  scrollContainerStyle?: any
  isDropDisabled?: boolean
  isDragging: boolean
}

const grid = 8

const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean,
  isDragging: boolean,
  theme: DefaultTheme
): string => {
  if (isDragging || isDraggingOver) {
    return theme.primary.light
  }
  if (isDraggingFrom) {
    return darken(0.05, theme.primary.medium)
  }
  return theme.primary.medium
}

const PropStrippedDiv: React.FC<{
  isDraggingOver: boolean
  isDraggingFrom: boolean
  isDropDisabled?: boolean
  isDragging: boolean
}> = ({
  isDraggingOver,
  isDraggingFrom,
  isDropDisabled,
  isDragging,
  ...props
}) => <div {...props} />

const Wrapper = styled(PropStrippedDiv)`
  background-color: ${props =>
    getBackgroundColor(
      props.isDraggingOver,
      props.isDraggingFrom,
      props.isDragging,
      props.theme
    )};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: 0;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
  overflow-y: auto;
  flex: 1 1 auto;
`

const scrollContainerHeight: number = 20

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;

  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding: ${grid}px;
`

type CardListProps = {
  cardIds: string[]
}
// React.memo<CardListProps>(
const InnerCardList: React.FC<CardListProps> = (props: CardListProps) => (
  <React.Fragment>
    {props.cardIds.map((cardId: string, index: number) => (
      <Draggable key={cardId} draggableId={cardId} index={index}>
        {(
          dragProvided: DraggableProvided,
          dragSnapshot: DraggableStateSnapshot
        ) => (
          <CardItem
            key={cardId}
            cardId={cardId}
            isDragging={dragSnapshot.isDragging}
            provided={dragProvided}
          />
        )}
      </Draggable>
    ))}
  </React.Fragment>
)

export default function CardList(props: Props) {
  const {
    ignoreContainerClipping,
    isDropDisabled,
    listId = 'LIST',
    listType,
    cardIds,
    isDragging,
  } = props

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={false}
    >
      {(
        dropProvided: DroppableProvided,
        dropSnapshot: DroppableStateSnapshot
      ) => (
        <Wrapper
          isDragging={isDragging}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          <DropZone ref={dropProvided.innerRef}>
            <InnerCardList cardIds={cardIds} />
            {dropProvided.placeholder}
          </DropZone>
        </Wrapper>
      )}
    </Droppable>
  )
}
