import React from 'react'
import { MenuDisclosure } from 'reakit/Menu'
import styled, { css } from 'styled-components/macro'

const lightBackgroundButton = css`
  background-color: ${props => props.theme.primary.medium};
  &:hover {
    background-color: ${props => props.theme.primary.dark};
  }
`

const darkBackgroundButton = css`
  background-color: ${props => props.theme.primary.dark};
  &:hover {
    background-color: ${props => props.theme.primary.light};
  }
`

export const MenuButton = styled(({ dark, ...props }) => (
  <MenuDisclosure {...props} />
))`
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 3px;
  cursor: pointer;
  color: ${props => props.theme.text};
  transition: background-color 0.1s ease;
  ${(props: { dark?: boolean }) =>
    props.dark ? darkBackgroundButton : lightBackgroundButton};
`
