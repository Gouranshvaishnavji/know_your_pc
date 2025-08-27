import { useState } from 'react'
import ZeroShot from './pages/ZeroShot'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ZeroShot />
    </>
  )
}

export default App
