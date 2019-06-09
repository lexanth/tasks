import React from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components/macro'
import SplitPane from 'react-split-pane'
import Board from './Board'
import EditingContext, { Callback } from './EditingContext'
import CardEdit from './CardEdit'
import { darkTheme } from './theme'
import { lighten } from 'polished'
import moize from 'moize'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }

  body, input {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code, pre, textarea {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  h4, h1, p {
    margin: 0;
    padding: 0;
  }
  a {
    color: inherit;
  }

  .Resizer {
      background-color: ${props => props.theme.primary.dark};
      z-index: 1;
      transition: all 0.1s ease;
  }

    .Resizer:hover {
      background-color: ${props => lighten(0.1, props.theme.primary.dark)};
  }

  .Resizer.vertical {
      width: 10px;
      margin: 0;
      cursor: col-resize;
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
  #root {
    height: 100%;
  }
  ::-webkit-scrollbar { 
    width: 8px;
    height: 8px;
  }
  /* Handle */ 
  ::-webkit-scrollbar-thumb { 
    -webkit-border-radius: 10px; 
    border-radius: 10px; 
    background: ${props => props.theme.primary.dark};
    transition: all 0.1s ease;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${props => lighten(0.1, props.theme.primary.dark)};
  }
`

type State = {
  editing: string | null
}

const buildEditingStatus = moize(
  (editingCardId: string | null, callback: Callback | null) => ({
    editingCardId,
    callback,
  })
)

class App extends React.Component<{}, State> {
  state = {
    editing: null,
  }

  setEditing = (cardId: string | null, callback?: () => void) => {
    this.setState({ editing: cardId }, callback)
  }

  render() {
    const mainBoard = <Board containerHeight="100%" />
    return (
      <ThemeProvider theme={darkTheme}>
        <EditingContext.Provider
          value={buildEditingStatus(this.state.editing, this.setEditing)}
        >
          <GlobalStyle />
          {this.state.editing !== null ? (
            <SplitPane
              split="vertical"
              defaultSize="70%" // TODO - store this
            >
              {mainBoard}
              <CardEdit
                setEditing={this.setEditing}
                editingCardId={this.state.editing!}
                key={this.state.editing!}
              />
            </SplitPane>
          ) : (
            mainBoard
          )}
        </EditingContext.Provider>
      </ThemeProvider>
    )
  }
}
export default App
