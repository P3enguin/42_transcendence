
export async function verifyOTP(event: React.FormEvent, api: string) {
  const span = document.getElementById('errorSpan');

  const nbr1 = (document.getElementById('numb1') as HTMLInputElement).value;
  const nbr2 = (document.getElementById('numb2') as HTMLInputElement).value;
  const nbr3 = (document.getElementById('numb3') as HTMLInputElement).value;
  const nbr4 = (document.getElementById('numb4') as HTMLInputElement).value;
  const nbr5 = (document.getElementById('numb5') as HTMLInputElement).value;
  const nbr6 = (document.getElementById('numb6') as HTMLInputElement).value;

  if (!nbr1 || !nbr2 || !nbr3 || !nbr4 || !nbr5 || !nbr6) {
    if (span) span.innerHTML = 'Please enter all the digits !';
    return false;
  }
  const token: string = nbr1 + nbr2 + nbr3 + nbr4 + nbr5 + nbr6;

  const resp = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_HOST + api,
    {
      method: 'POST',
      body: JSON.stringify({ token: token }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    },
  );
  if (resp.ok) {
    return true;
    // Router.push('/profile');
  } else if (resp.status === 400) {
    const message = await resp.json();
    if (span) span.innerHTML = 'The code is invalid';
    return false
  }
}
