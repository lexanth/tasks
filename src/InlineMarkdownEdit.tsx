import React, { useRef } from 'react'
import useInlineEdit from './useInlineEdit'
import styled, { css } from 'styled-components/macro'
import ReactMarkdown from 'react-markdown'
import Editor from 'react-simple-code-editor'
import * as prism from 'prismjs'
// import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-markdown'
import 'prismjs/themes/prism.css'

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
  color: white;
`

const Input = styled(Editor)`
  ${text}
  border: none;
  outline: 0;
  border-radius: 3px;
  min-height: 18px;
  padding-bottom: 2px;
  background-color: rgb(44, 44, 44);
`

const Text = styled(ReactMarkdown)`
  ${text}
  text-align: left;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const placeholderIfBlank = (text: string): string =>
  text ? text : 'Click to edit description...'

type Props = {
  onChange: (newValue: string) => void
  value: string
  small?: boolean
  bold?: boolean
}

const InlineMarkdownEdit: React.FC<Props> = ({
  onChange,
  value,
  small,
  bold,
}) => {
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
        value={text}
        onValueChange={onChangeText}
        highlight={code =>
          prism.highlight(code, prism.languages.md, 'markdown')
        }
        onBlur={onFinishEditing}
        onKeyDown={onKeyDown}
        small={small}
        bold={bold}
      />
    )
  } else {
    return (
      <div onClick={onStartEditing}>
        <Text small={small} bold={bold} source={placeholderIfBlank(value)} />
      </div>
    )
  }
}

export default InlineMarkdownEdit
