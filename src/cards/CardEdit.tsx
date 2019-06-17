import React from 'react'
import styled from 'styled-components/macro'
import { connect } from 'react-redux'
import { State, updateCard, deleteCard } from '../reducer'
import InlineTextEdit from '../atoms/InlineTextEdit'
import { CardUpdate } from '../types'
import InlineMarkdownEdit from '../atoms/InlineMarkdownEdit'
import { useMenuState } from 'reakit/Menu'
import { MenuButton } from '../atoms/MenuButton'
import { PopoverMenu } from '../atoms/PopoverMenu'
import { PopoverMenuItem } from '../atoms/PopoverMenuItem'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.primary.medium};
  min-height: 100%;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background-color: ${props => props.theme.primary.dark};
  min-height: 32px;
`

const Button = styled.button`
  border: none;
  color: ${props => props.theme.text};
  width: 30px;
  height: 30px;
  border-radius: 3px;
  cursor: pointer;
  background-color: ${props => props.theme.primary.dark};
  &:hover {
    background-color: ${props => props.theme.primary.light};
  }
`

type OwnProps = {
  setEditing: (cardId: string | null, callback?: () => void) => void
  editingCardId: string
}
type StateProps = {
  title: string
  description: string
  updateCard: (update: CardUpdate) => void
  deleteCard: (cardId: string) => void
}
type Props = OwnProps & StateProps

const CardEdit: React.FC<Props> = ({
  setEditing,
  title,
  updateCard,
  editingCardId,
  description,
  deleteCard,
}) => {
  const menu = useMenuState()
  return (
    <Container>
      <Header>
        <InlineTextEdit
          value={title}
          onChange={newValue =>
            updateCard({
              cardId: editingCardId,
              field: 'title',
              newValue: newValue,
            })
          }
        />
        <MenuButton {...menu} dark>
          ...
        </MenuButton>
        <PopoverMenu {...menu}>
          <PopoverMenuItem
            {...menu}
            onClick={() => {
              setEditing(null, () => {
                deleteCard(editingCardId)
              })
            }}
          >
            Delete card
          </PopoverMenuItem>
        </PopoverMenu>
        <Button onClick={() => setEditing(null)}>X</Button>
      </Header>
      <InlineMarkdownEdit
        value={description}
        onChange={newValue =>
          updateCard({
            cardId: editingCardId,
            field: 'description',
            newValue: newValue,
          })
        }
      />
    </Container>
  )
}

export default connect(
  (state: State, ownProps: OwnProps) => ({
    title: state.cards[ownProps.editingCardId].title,
    description: state.cards[ownProps.editingCardId].description,
  }),
  {
    updateCard,
    deleteCard,
  }
)(CardEdit)
