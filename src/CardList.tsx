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
import { connect } from 'react-redux'
import { addCard } from './createStore'

const Title = styled.div``

type Props = {
  title?: string
  listId: string
  listType: string
  style: any
  cardIds: string[]
  internalScroll: boolean
  isCombineEnabled: boolean
  ignoreContainerClipping?: boolean
  scrollContainerStyle?: any
  isDropDisabled?: boolean
}

const grid = 8

const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean
): string => {
  if (isDraggingOver) {
    return 'rgb(62,62,62)'
  }
  if (isDraggingFrom) {
    return 'rgb(102, 102, 102)'
  }
  return 'rgb(82, 82, 82)'
}

const PropStrippedDiv: React.FC<{
  isDraggingOver: boolean
  isDraggingFrom: boolean
  isDropDisabled?: boolean
  style: any
}> = ({ isDraggingOver, isDraggingFrom, isDropDisabled, style, ...props }) => (
  <div {...props} style={style} />
)

const Wrapper = styled(PropStrippedDiv)`
  background-color: ${props =>
    getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: 0;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
`

const scrollContainerHeight: number = 100

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;

  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding: ${grid}px;
`

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`

/* stylelint-disable block-no-empty */
const Container = styled.div``
/* stylelint-enable */

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
            isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
            provided={dragProvided}
          />
        )}
      </Draggable>
    ))}
  </React.Fragment>
)
// )

const AddCardButton = styled.button`
  border: 0;
  width: 100%;
  border-radius: 0 0 2px 2px;
  background-color: transparent;
  padding: 5px;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

type InnerListProps = {
  dropProvided: DroppableProvided
  cardIds: string[]
  title?: string
  listId: string
  addCard: (listId: string) => void
}

const InnerList = connect(
  null,
  { addCard }
)((props: InnerListProps) => {
  const { cardIds, dropProvided, addCard, listId } = props
  const title = props.title ? <Title>{props.title}</Title> : null

  return (
    <Container>
      {title}
      <DropZone ref={dropProvided.innerRef}>
        <InnerCardList cardIds={cardIds} />
        {dropProvided.placeholder}
      </DropZone>
      <AddCardButton onClick={() => addCard(listId)}>+ Add card</AddCardButton>
    </Container>
  )
})

export default function CardList(props: Props) {
  const {
    ignoreContainerClipping,
    internalScroll,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = 'LIST',
    listType,
    style,
    cardIds,
    title,
  } = props

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
    >
      {(
        dropProvided: DroppableProvided,
        dropSnapshot: DroppableStateSnapshot
      ) => (
        <Wrapper
          style={style}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          {internalScroll ? (
            <ScrollContainer style={scrollContainerStyle}>
              <InnerList
                cardIds={cardIds}
                title={title}
                dropProvided={dropProvided}
                listId={listId}
              />
            </ScrollContainer>
          ) : (
            <InnerList
              cardIds={cardIds}
              title={title}
              dropProvided={dropProvided}
              listId={listId}
            />
          )}
        </Wrapper>
      )}
    </Droppable>
  )
}
