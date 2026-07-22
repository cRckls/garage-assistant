import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'

const chakraSystem = createSystem(defaultConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={chakraSystem}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
