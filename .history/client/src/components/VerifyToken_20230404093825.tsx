export async function verifyToken(cookie: string): Promise<Response> {
  return await fetch(
    process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/verifytoken',
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
    process.env.NEXT_PUBLIC_BACKEND_HOST + '/auth/verifysession',
    {
      method: 'GET',
      headers: {
        Cookie: cookie,
      },
    },
  );
}