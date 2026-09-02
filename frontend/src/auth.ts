/* eslint-disable prefer-const */

const CODE_VERIFIER_KEY = "cognito_pkce_code_verifier";
const ID_TOKEN_KEY = "cognito_id_token";

export const authConfig = 
{
  cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN as string,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
  redirectUri: import.meta.env.VITE_REDIRECT_URI as string,
  scope: "openid email",
};


function base64UrlEncode(bytes: Uint8Array): string 
{
  const str = btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}


function generateCodeVerifier(): string 
{
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}


async function generateCodeChallenge(verifier: string): Promise<string> 
{
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(verifier));
  return base64UrlEncode(new Uint8Array(hash));
}


export async function createLoginUrl(): Promise<string> 
{
  const verifier = generateCodeVerifier();
  sessionStorage.setItem(CODE_VERIFIER_KEY, verifier);

  const challenge = await generateCodeChallenge(verifier);

  const params = new URLSearchParams({
    client_id: authConfig.clientId,
    response_type: "code",
    scope: authConfig.scope,
    redirect_uri: authConfig.redirectUri,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  return `${authConfig.cognitoDomain}/oauth2/authorize?${params.toString()}`;
}


export async function createLogoutUrl(): Promise<string> 
{
  const params = new URLSearchParams({
    client_id: authConfig.clientId,
    logout_uri: authConfig.redirectUri
  });

  return `${authConfig.cognitoDomain}/logout?${params.toString()}`;
}


export async function exchangeCodeForToken(code: string): Promise<string> 
{
  const verifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
  if (!verifier) { throw new Error("Missing PKCE code verifier"); }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: authConfig.clientId,
    code,
    redirect_uri: authConfig.redirectUri,
    code_verifier: verifier,
  });

  const response = await fetch(`${authConfig.cognitoDomain}/oauth2/token`, 
  {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) { throw new Error(`Token exchange failed: ${await response.text()}`); }

  const tokens = await response.json();
  sessionStorage.removeItem(CODE_VERIFIER_KEY);

  return tokens.id_token;
}


export function saveToken(token: string) { sessionStorage.setItem(ID_TOKEN_KEY, token); }


export function getToken() { return sessionStorage.getItem(ID_TOKEN_KEY); }


export function clearToken() { sessionStorage.removeItem(ID_TOKEN_KEY); }