import React from 'react'
import styled from 'styled-components/macro'
import shortid from 'shortid'
import { connect } from 'react-redux'
import EditingContext, { EditingStatus, Callback } from './EditingContext'
import { addCard } from './createStore'

const Button = styled.button`
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

type Props = {
  listId: string
  addCard: (listId: string, cardId: string) => void
}

type AllProps = Props & {
  selectCard: Callback | null
}

const AddButton: React.FC<AllProps> = ({ addCard, selectCard, listId }) => {
  const addCardCallback = () => {
    const cardId = shortid.generate()
    addCard(listId, cardId)
    if (selectCard) {
      selectCard(cardId)
    }
  }
  return <Button onClick={addCardCallback}>+ Add card</Button>
}

const AddCardButtonWithSelect: React.FC<Props> = ({ addCard, listId }) => (
  <EditingContext.Consumer>
    {({ callback: selectCard }) => (
      <AddButton selectCard={selectCard} addCard={addCard} listId={listId} />
    )}
  </EditingContext.Consumer>
)

export const AddCardButton = connect(
  null,
  { addCard }
)(AddCardButtonWithSelect)
