import Head from 'next/head';
import Layout from '@/components/layout/layout';
import ShopBar from '@/components/shop/ShopBar';
import ShopCard from '@/components/shop/ShopCard';
import { useState } from 'react';

function Shop() {
  const categories = ['board', 'ball', 'paddle'];
  const [selectedCategories, setSelectedCategories] = useState(categories);

  const updateSelectedCategories = (category: string, active: boolean) => {
    if (active) {
      setSelectedCategories(selectedCategories.filter((f) => f !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <>
      <Head>
        <title>Ponginator | Shop</title>
      </Head>
      <div className="my-[55px] flex w-full flex-col items-center gap-[65px]">
        <ShopBar
          categories={categories}
          selectedCategories={selectedCategories}
          updateFilter={updateSelectedCategories}
        />
        <div className="flex w-[90%] rounded-[20px] border-[2px] border-white">
          <ul className="flex flex-wrap justify-center gap-10 px-[20px] py-[30px]">
            <ShopCard
              image="game/GameBoard.svg"
              category="board"
              price={30}
              status="owned"
            />
            <ShopCard
              image="game/GameBoard.svg"
              category="board"
              price={50}
              status="equipped"
            />
            <ShopCard image="game/GameBoard.svg" category="board" price={60} />
          </ul>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    return {
      // modify this to return anything you want before your page load
      props: {},
    };
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

Shop.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default Shop;
