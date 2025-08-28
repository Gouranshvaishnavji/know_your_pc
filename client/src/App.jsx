import { useState } from 'react'
import AgenticWrapper from './pages/AgenticWrapper'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AgenticWrapper />
    </>
  )
}

export default App
