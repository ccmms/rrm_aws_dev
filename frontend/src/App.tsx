import logoImg from './assets/logo.png'
import './App.css'

function App() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={logoImg} width="400" height="209" alt="" />
        </div>
        <div>
          <h1>Hello!</h1>
          <p>
            Sign in to continue.
          </p>
        </div>
        <button type="submit" className="btn btn-primary">Login</button>

      </section>
    </>
  )
}

export default App