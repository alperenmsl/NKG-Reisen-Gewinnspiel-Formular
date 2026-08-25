import './App.css'
import GiveawayForm from './components/GiveawayForm'

function App() {
  return (
    <div className="app">
      {/* Hintergrundbild */}
      <div className="background-image"></div>
      
      <header className="header">
        <div className="logo">
        {/* Logo aus public/ */}
        <img src="/Logo.png" alt="NKG Reisen Logo" className="logo-image" />
        </div>
      </header>
      
      <main className="main">
        <GiveawayForm />
      </main>
      
      <footer className="footer">
        <p>&copy; 2026 NKG Reisen. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  )
}

export default App
