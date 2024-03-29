export async function verifyToken(cookie: string): Promise<Response> {
  return await fetch(
    process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/auth/verifytoken',
    {
      method: 'GET',
      headers: {
        Cookie: cookie,
      },
    },
  );
}

export async function verifySession(cookie: string): Promise<Response> {
  return await fetch(
    process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/auth/verifysession',
    {
      method: 'GET',
      headers: {
        Cookie: cookie,
      },
    },
  );
}

export async function verify2FAToken(cookie: string): Promise<Response> {
  return await fetch(
    process.env.NEXT_PUBLIC_BE_CONTAINER_HOST + '/auth/token2FA',
    {
      method: 'GET',
      headers: {
        Cookie: cookie,
      },
    },
  );
}
