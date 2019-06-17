import { reducer, addCard } from './reducer'

describe('reducer', () => {
  it('should add a card to a list', () => {
    const state = {
      cards: {
        card1: {
          id: 'card1',
          title: 'Test card',
          description: '',
        },
      },
      columns: [
        {
          id: 'A',
          title: 'Test list',
          cardIds: ['card1'],
        },
      ],
    }
    const newState = reducer(state, addCard('A', 'card2'))
    expect(newState).toEqual({
      cards: {
        card1: {
          id: 'card1',
          title: 'Test card',
          description: '',
        },
        card2: {
          id: 'card2',
          title: 'New card',
          description: '',
        },
      },
      columns: [
        {
          id: 'A',
          title: 'Test list',
          cardIds: ['card1', 'card2'],
        },
      ],
    })
  })
})
