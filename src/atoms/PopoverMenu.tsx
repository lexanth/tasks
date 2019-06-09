import { Menu } from 'reakit/Menu'
import styled from 'styled-components/macro'
export const PopoverMenu = styled(Menu)`
  outline: none;
  padding: 10px 0;
  border-radius: 3px;
  background-color: ${props => props.theme.primary.light};
`
