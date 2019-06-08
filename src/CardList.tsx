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
import { DefaultTheme } from 'styled-components'
import { darken } from 'polished'
import shortid from 'shortid'
import EditingContext, { EditingStatus, Callback } from './EditingContext'

const Title = styled.div``

type Props = {
  title?: string
  listId: string
  listType: string
  cardIds: string[]
  internalScroll: boolean
  isCombineEnabled: boolean
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
  outline: none;
  width: 100%;
  border-radius: 0 0 2px 2px;
  background-color: transparent;
  padding: 5px;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: background-color 0.1 ease;
  &:hover {
    background-color: ${props => props.theme.overlay.light};
  }
`

type InnerListProps = {
  dropProvided: DroppableProvided
  cardIds: string[]
  title?: string
  listId: string
  addCard: (listId: string, cardId: string) => void
  selectCard: Callback | null
}

const InnerList = connect(
  null,
  { addCard }
)((props: InnerListProps) => {
  const { cardIds, dropProvided, addCard, listId, selectCard } = props
  const title = props.title ? <Title>{props.title}</Title> : null

  const addCardCallback = () => {
    const cardId = shortid.generate()
    addCard(listId, cardId)
    if (selectCard) {
      selectCard(cardId)
    }
  }

  return (
    <Container>
      {title}
      <DropZone ref={dropProvided.innerRef}>
        <InnerCardList cardIds={cardIds} />
        {dropProvided.placeholder}
      </DropZone>
      <AddCardButton onClick={addCardCallback}>+ Add card</AddCardButton>
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
    cardIds,
    title,
    isDragging,
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
        <EditingContext.Consumer>
          {({ callback: selectCard }) => (
            <Wrapper
              isDragging={isDragging}
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
                    selectCard={selectCard}
                  />
                </ScrollContainer>
              ) : (
                <InnerList
                  cardIds={cardIds}
                  title={title}
                  dropProvided={dropProvided}
                  listId={listId}
                  selectCard={selectCard}
                />
              )}
            </Wrapper>
          )}
        </EditingContext.Consumer>
      )}
    </Droppable>
  )
}
