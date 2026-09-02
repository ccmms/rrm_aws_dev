import { useEffect, useRef, useState } from 'react'
import { callAPI, clearToken, createLoginUrl, createLogoutUrl, exchangeCodeForToken, getToken, saveToken } from './auth';
import logoImg from './assets/logo.png'
import './App.css'

function App() 
{
  const [status, setStatus] = useState<"loggedOut" | "loggedIn" | "loading">("loading");
  const authInitialized = useRef(false);

  useEffect(() => 
  {
    if (authInitialized.current) { return; }
    authInitialized.current = true;

    async function initialize() 
    {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) 
      {
        const token = await exchangeCodeForToken(code);
        saveToken(token);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      setStatus(getToken() ? "loggedIn" : "loggedOut");
    }

    initialize();

  }, []);

  async function login() { window.location.href = await createLoginUrl(); }

  async function logout() 
  {
    await callAPI("logout", "POST");
    clearToken();
    setStatus("loggedOut");

    window.location.href = await createLogoutUrl();
  }

  async function registerClick() 
  {
    await callAPI("clicks", "POST");
    clearToken();
  }

  if (status == "loading") { return <p>loading...</p> }

  if (status == "loggedIn") 
  {
    return (
      <>
        <section id="center" onClick={registerClick}>
          <div className="hero">
            <img src={logoImg} width="400" height="209" alt="" />
          </div>
          <div>
            <h1>Welcome back.</h1>
            <p>So far you clicked X times in this session.</p>
          </div>

          <button type="submit" className="btn btn-primary" onClick={logout}>Logout</button>
        </section>
      </>
    )
  }

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
        <button type="submit" className="btn btn-primary" onClick={login}>Login</button>
      </section>
    </>
  )
}

export default App