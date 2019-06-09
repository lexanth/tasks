import React from 'react'
import { useMenuState } from 'reakit/Menu'
import { connect } from 'react-redux'
import { deleteColumn } from '../createStore'
import { MenuButton } from '../atoms/MenuButton'
import { PopoverMenu } from '../atoms/PopoverMenu'
import { PopoverMenuItem } from '../atoms/PopoverMenuItem'

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
          Delete list
        </PopoverMenuItem>
      </PopoverMenu>
    </>
  )
}

export default connect(
  null,
  { deleteColumn }
)(ColumnActions)
