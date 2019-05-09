export type Card = {
  id: string
  title: string
  description: string
}

export type CardColumn = {
  id: string
  title: string
  cardIds: string[]
}

export type ColumnMove = {
  sourceIndex: number
  destinationIndex: number
}

export type CardMove = {
  cardId: string
  sourceListId: string
  sourceIndex: number
  destinationListId: string
  destinationIndex: number
}

export type CardUpdate = {
  cardId: string
  field: keyof Card
  newValue: string
}

export type ColumnUpdate = {
  columnId: string
  field: keyof CardColumn
  newValue: string
}
