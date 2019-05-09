import React, { Component } from 'react'
import styled from 'styled-components/macro'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'
import CardList from './CardList'

const grid: number = 8
const borderRadius: number = 2

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`

const IsDraggingDiv: React.FC<{ isDragging: boolean }> = ({
  isDragging,
  ...props
}) => <div {...props} />

const IsDraggingH4: React.FC<{ isDragging: boolean }> = ({
  isDragging,
  ...props
}) => <h4 {...props} />

const Header = styled(IsDraggingDiv)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging, theme }) =>
    isDragging ? theme.primary.light : theme.primary.medium};
  color: ${props => props.theme.text};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primary.light};
  }
`

const Title = styled(IsDraggingH4)`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
`

type Props = {
  index: number
  title: string
  cardIds: string[]
  isScrollable: boolean
  isCombineEnabled: boolean
  columnId: string
}

export default class Column extends Component<Props> {
  render() {
    const { title, index, cardIds, columnId } = this.props
    return (
      <Draggable draggableId={columnId} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <Header isDragging={snapshot.isDragging}>
              <Title
                isDragging={snapshot.isDragging}
                {...provided.dragHandleProps}
              >
                {title}
              </Title>
            </Header>
            <CardList
              listId={columnId}
              listType="CARD"
              isDragging={snapshot.isDragging}
              cardIds={cardIds}
              internalScroll={this.props.isScrollable}
              isCombineEnabled={Boolean(this.props.isCombineEnabled)}
            />
          </Container>
        )}
      </Draggable>
    )
  }
}
