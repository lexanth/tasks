import React from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components/macro'
import SplitPane from 'react-split-pane'
import Board from './Board'
import EditingContext from './EditingContext'
import CardEdit from './CardEdit'
import { darkTheme } from './theme'
import { lighten } from 'polished'

const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

h4 {
  margin: 0;
  padding: 0;
}

    .Resizer {
        background-color: ${props => props.theme.primary.dark};
        z-index: 1;
    }

     .Resizer:hover {
        transition: all 0.1s ease;
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
`

type State = {
  editing: string | null
}

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
        <EditingContext.Provider value={this.setEditing}>
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
