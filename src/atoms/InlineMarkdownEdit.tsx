import React from 'react'
import useInlineEdit from './useInlineEdit'
import styled, { css } from 'styled-components/macro'
import ReactMarkdown from 'react-markdown'
import Editor from 'react-simple-code-editor'
import * as prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import 'prismjs/themes/prism.css'

type CssProps = {
  small?: boolean
  bold?: boolean
}
const text = css<CssProps>`
  display: block;
  font-size: 16px;
  border-radius: 5px;
  ${props => props.small && 'font-size: 14px'};
  ${props => props.small && 'border-radius: 3px'};
  ${props => props.bold && 'font-weight: bold'};
  padding: 10px;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.primary.dark};
`

const Input = styled(Editor)`
  ${text}
  border: none;
  outline: 0;
  min-height: 18px;
  padding-bottom: 2px;
  background-color: ${props => props.theme.overlay.light};
`

const Text = styled(ReactMarkdown)`
  ${text}
  text-align: left;
  &:hover {
    background-color: ${props => props.theme.overlay.light};
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

const Container = styled.div`
  padding: 10px;
`

const HelperText = styled.span`
  color: ${props => props.theme.text};
`

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
    // inputEl,
    text,
    editing,
    onKeyDown,
  } = useInlineEdit(value, onChange)

  if (editing) {
    return (
      <Container>
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
          padding={10}
        />
        <HelperText>
          You can use markdown in the editor! See{' '}
          <a
            href="http://commonmark.org/help/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Markdown Guide
          </a>
        </HelperText>
      </Container>
    )
  } else {
    return (
      <Container onClick={onStartEditing}>
        <Text small={small} bold={bold} source={placeholderIfBlank(value)} />
      </Container>
    )
  }
}

export default InlineMarkdownEdit
