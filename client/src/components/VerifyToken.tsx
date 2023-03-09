export async function verifyToken(cookie:string) : Promise<Response> {
    return await fetch(process.env.NEXT_PUBLIC_VERIFY_TOKEN_ENDPOINT,{
        method: "GET",
        headers: {
            origin: 'localhost',
            Cookie: cookie
          }
      });
}