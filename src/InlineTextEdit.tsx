import React from 'react'
import useInlineEdit from './useInlineEdit'
import styled, { css } from 'styled-components/macro'

type CssProps = {
  small?: boolean
  bold?: boolean
}
const text = css<CssProps>`
  display: block;
  font-size: 18px;
  ${props => props.small && 'font-size: 14px'};
  ${props => props.bold && 'font-weight: bold'};
  padding: 5px;
  width: 100%;
  color: ${props => props.theme.text};
`

const Input = styled.input`
  ${text}
  border: none;
  outline: 0;
  border-radius: 3px;
  min-height: 18px;
  padding-bottom: 2px;
  background-color: ${props => props.theme.overlay.light};
`

const Text = styled.span`
  ${text}
  text-align: left;
  &:hover {
    background-color: ${props => props.theme.overlay.light};
  }
`

type Props = {
  onChange: (newValue: string) => void
  value: string
  small?: boolean
  bold?: boolean
}

const InlineTextEdit: React.FC<Props> = ({ onChange, value, small, bold }) => {
  const {
    onChangeText,
    onFinishEditing,
    onStartEditing,
    inputEl,
    text,
    editing,
    onKeyDown,
  } = useInlineEdit(value, onChange)

  if (editing) {
    return (
      <Input
        ref={inputEl}
        value={text}
        onChange={event => onChangeText(event.target.value)}
        onBlur={onFinishEditing}
        onKeyDown={onKeyDown}
        small={small}
        bold={bold}
      />
    )
  } else {
    return (
      <Text onClick={onStartEditing} small={small} bold={bold}>
        {value}
      </Text>
    )
  }
}

export default InlineTextEdit
