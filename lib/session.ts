import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'studyvault_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Get or create a session ID for the current user
 * This is used for watermarking PDFs without requiring login
 */
export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (existingSession?.value) {
    return existingSession.value;
  }
  
  // Create new session ID
  const sessionId = uuidv4();
  
  // Set cookie
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
  
  return sessionId;
}

/**
 * Get the current session ID (returns null if not exists)
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}
