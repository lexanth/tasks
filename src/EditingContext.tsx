import React from 'react'

type Callback = (value: string | null) => void
const EditingContext = React.createContext<Callback | null>(null)

export default EditingContext
