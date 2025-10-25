import { Toaster } from 'react-hot-toast'
import './App.css'
import HomePage from './pages/HomePage'

function App() {
  return (
    <>
      <HomePage />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
          },
          success: {
            iconTheme: {
              primary: "#4CAF50",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#F44336",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  )
}

export default App
