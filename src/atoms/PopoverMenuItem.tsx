import { MenuItem } from 'reakit/Menu'
import styled from 'styled-components/macro'
export const PopoverMenuItem = styled(MenuItem)`
  border: none;
  padding: 8px;
  outline: none;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.primary.light};
  &:hover {
    background-color: ${props => props.theme.primary.medium};
  }
`
