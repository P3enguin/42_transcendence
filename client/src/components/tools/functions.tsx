
export async function verifyOTP(event: any, api: string) {
  const span = document.getElementById('errorSpan');
  const nbr1 = event.target.numb1.value;
  const nbr2 = event.target.numb2.value;
  const nbr3 = event.target.numb3.value;
  const nbr4 = event.target.numb4.value;
  const nbr5 = event.target.numb5.value;
  const nbr6 = event.target.numb6.value;

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
