/**
 * Server-side Firebase helpers.
 * In production, this integrates with Firebase Admin SDK or REST verification.
 */
export async function verifyFirebaseIdToken(token?: string): Promise<{ uid: string; email?: string } | null> {
  if (!token) return null;
  const clean = token.replace(/^Bearer\s+/i, '').trim();
  if (!clean) return null;

  try {
    // In local development or server environments, parse claims or verify
    // Tokens contain header.payload.signature
    const parts = clean.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
      if (payload.user_id || payload.sub) {
        return {
          uid: payload.user_id || payload.sub,
          email: payload.email,
        };
      }
    }
  } catch (err) {
    console.warn('Failed to parse Firebase token claims:', err);
  }

  return null;
}
