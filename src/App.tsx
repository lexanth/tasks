import React from 'react'
import styled, { createGlobalStyle } from 'styled-components/macro'
import SplitPane from 'react-split-pane'
import { Card, CardColumn } from './types'
import Board from './Board'
import EditingContext from './EditingContext'
import CardEdit from './CardEdit'

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
        background-color: rgb(30,30,30);
        z-index: 1;
    }

     .Resizer:hover {
        -webkit-transition: all 2s ease;
        transition: all 2s ease;
        background-color: rgb(50,50,50)
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
`

const AppContainer = styled.div`
  text-align: center;
`

type State = {
  editing: string | null
}

class App extends React.Component<{}, State> {
  state = {
    editing: null,
  }

  setEditing = (cardId: string | null) => {
    this.setState({ editing: cardId })
  }

  render() {
    const mainBoard = <Board containerHeight="100%" />
    return (
      <AppContainer>
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
              />
            </SplitPane>
          ) : (
            mainBoard
          )}
        </EditingContext.Provider>
      </AppContainer>
    )
  }
}
export default App
