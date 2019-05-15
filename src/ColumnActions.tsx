import React, { useState } from 'react'
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuDisclosure,
  MenuSeparator,
} from 'reakit/Menu'
import styled from 'styled-components/macro'
import { connect } from 'react-redux'
import { deleteColumn } from './createStore'

const MenuButton = styled(MenuDisclosure)`
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 3px;
  cursor: pointer;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.primary.medium};
  &:hover {
    background-color: ${props => props.theme.primary.dark};
  }
`

const PopoverMenu = styled(Menu)`
  outline: none;
  padding: 10px 0;
  border-radius: 3px;
  background-color: ${props => props.theme.primary.light};
`

const PopoverMenuItem = styled(MenuItem)`
  border: none;
  padding: 8px;
  outline: none;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.primary.light};
  &:hover {
    background-color: ${props => props.theme.primary.medium};
  }
`

type OwnProps = {
  columnId: string
}

type DispatchProps = {
  deleteColumn: (columnId: string) => void
}

type Props = OwnProps & DispatchProps
const ColumnActions: React.FC<Props> = ({ columnId, deleteColumn }) => {
  const menu = useMenuState()
  return (
    <>
      <MenuButton {...menu}>...</MenuButton>
      <PopoverMenu {...menu}>
        <PopoverMenuItem {...menu} onClick={() => deleteColumn(columnId)}>
          Delete card
        </PopoverMenuItem>
      </PopoverMenu>
    </>
  )
}

export default connect(
  null,
  { deleteColumn }
)(ColumnActions)
