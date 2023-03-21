import Layout from "@/components/layout/layout";


function settings() {
  return (
      <></>
  );
}

export async function getServerSideProps({ req }: any) {
  // fetching all data :

  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/data',
      {
        headers: {
          Cookie: req.headers.cookie,
        },
      },
    );
    const data = await res.json();

    const timeFormat: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Intl.DateTimeFormat('en-US', timeFormat).format(
      new Date(data.player.joinAt),
    );
    return {
      // modify this to return anything you want before your page load
      props: {
        nickname: data.player.nickname,
        firstname: data.player.firstname,
        lastname: data.player.lastname,
        avatar: data.player.avatar,
        wallpaper: data.player.wallpaper,
      },
    };
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

settings.getLayout = function getLayout(page:React.ReactNode) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default settings;
