export async function verifyToken(cookie:string) : Promise<Response> {
    return await fetch(process.env.NEXT_PUBLIC_VERIFY_TOKEN_ENDPOINT,{
        method: "GET",
        headers: {
            Cookie: cookie
          }
      });
}

export async function verifySession(cookie:string) : Promise<Response> {
    return await fetch(process.env.NEXT_PUBLIC_VERIFY_SESSION_ENDPOINT,{
        method: "GET",
        headers: {
            Cookie: cookie
          }
      });
}