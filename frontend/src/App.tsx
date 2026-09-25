import { useEffect, useRef, useState } from 'react'
import { callAPI, clearToken, createLoginUrl, createLogoutUrl, decodeToken, exchangeCodeForToken, getToken, saveToken } from './auth';
import { Viewer3D } from './components/viewer3d.tsx'
import logoImg from './assets/logo.png'
import './App.css'

type SessionState =
    {
        status: "loggedOut" | "loggedIn" | "loading";
        email: string | null;
        totalClicks: number;
    };

const LOGGED_OUT: SessionState = { status: "loggedOut", email: null, totalClicks: 0 };

function App() 
{
    const [session, setSession] = useState<SessionState>({ status: "loading", email: null, totalClicks: 0 });
    const authInitialized = useRef(false);

    async function loadSession() 
    {
        const token = getToken();
        if (!token) 
        {
            setSession(LOGGED_OUT);
            return;
        }

        try 
        {
            const email = decodeToken(token).email ?? null;
            const result = await callAPI<{ totalClicks: number }>("me", "GET");
            setSession({ status: "loggedIn", email, totalClicks: result.totalClicks });
        }
        catch (err) 
        {
            console.error("Failed to load session:", err);
            clearToken();
            setSession(LOGGED_OUT);
        }
    }

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
                try 
                {
                    const token = await exchangeCodeForToken(code);
                    saveToken(token);
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
                catch (err)
                {
                    console.error("Token exchange failed: ", err);
                }
            }

            await loadSession();
        }

        initialize();

    }, []);

    async function login() { window.location.href = await createLoginUrl(); }

    async function logout() 
    {
        let totalClicks = session.totalClicks;

        try 
        {
            const result = await callAPI<{ totalClicks: number }>("logout", "POST");
            totalClicks = result.totalClicks;
        }
        catch (err)
        {
            console.error("An error happenned when trying to close the session:", err);
        }

        clearToken();
        setSession(LOGGED_OUT);
        alert(`You clicked ${totalClicks} times during your session!`);

        window.location.href = await createLogoutUrl();
    }

    if (session.status == "loading") { return <p>loading...</p> }

    if (session.status == "loggedIn") 
    {
        return (
            <>
                <section id= "center">
                    <div className="hero" >
                        <img src={ logoImg } width = "400" height = "209" alt = "" />
                    </div>
                    < div style = {{ width: '100%', height: '200' }} >
                        <Viewer3D />
                    </div>
                    < button type = "submit" className = "btn btn-primary" onClick = { logout } > Logout </button>
                </section>
        </>);
    }

    return (
        <>
            <section id= "center" >
                <div className="hero" >
                    <img src={ logoImg } width = "400" height = "209" alt = "" />
                </div>
                < div >
                    <h1>Hello! </h1>
                    <p>Sign in to continue.</p>
                </div>
                < button type = "submit" className = "btn btn-primary" onClick = { login } > Login </button>
            </section>
        </>);
}

export default App