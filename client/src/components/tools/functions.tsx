
export async function verifyOTP(event: React.FormEvent, api: string,method :string) {
  const span = document.getElementById('errorSpan');

  const nbr1 = (document.getElementById('1') as HTMLInputElement).value;
  const nbr2 = (document.getElementById('2') as HTMLInputElement).value;
  const nbr3 = (document.getElementById('3') as HTMLInputElement).value;
  const nbr4 = (document.getElementById('4') as HTMLInputElement).value;
  const nbr5 = (document.getElementById('5') as HTMLInputElement).value;
  const nbr6 = (document.getElementById('6') as HTMLInputElement).value;

  if (!nbr1 || !nbr2 || !nbr3 || !nbr4 || !nbr5 || !nbr6) {
    if (span) span.innerHTML = 'Please enter all the digits !';
    return false;
  }
  let resp ;
  const token: string = nbr1 + nbr2 + nbr3 + nbr4 + nbr5 + nbr6;
  if (method === "PATCH")
  {
     resp = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + api,
      {
        method: method,
        body: JSON.stringify({ token: token }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );
  }
  else if (method === "GET")
  {
    resp = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + api + "?" +  new URLSearchParams({token : token}),
      {
        method: method,
        credentials: 'include',
      },
    );
  }
  if (resp)
  {
    if (resp.ok) {
      return true;
      // Router.push('/profile');
    } else if (resp.status === 400) {
      const message = await resp.json();
      if (span) span.innerHTML = 'The code is invalid';
      return false
    }
  }
}

export const calculateTimeElapsed = (date: string): string => {
  const gamePlayedAt = new Date(date);
  const currentTime = new Date();
  const timeDiff = Math.abs(currentTime.getTime() - gamePlayedAt.getTime());

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
};