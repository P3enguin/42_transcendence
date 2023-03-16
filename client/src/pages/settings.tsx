import Layout from "@/components/layout/layout";

function settings() {
  return (
      <></>
  );
}


settings.getLayout = function getLayout(page:React.ReactNode) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default settings;
