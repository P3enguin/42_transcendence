import Image from 'next/image';

interface Card {
  image: string;
  category: 'board' | 'ball' | 'paddle';
  price: number;
  status?: 'equipped' | 'owned';
}

export default function ShopCard({ image, category, price, status }: Card) {
  return (
    <li className="flex h-[220px] w-[215px] flex-col items-center rounded-[20px] bg-[#8BD9FFB3]">
      <Image
        className="rotate-90"
        src={'/' + image}
        alt="ShopCard"
        width={120}
        height={165}
      />
      {status == 'equipped' ? (
        <div className="flex gap-2">
          <button className="mt-[-5px] h-[40px] w-[115px] rounded-[10px] bg-[#B4B4B4] font-bold uppercase shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] hover:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]">
            Equipped
          </button>
        </div>
      ) : status == 'owned' ? (
        <div className="flex gap-2">
          <button className="mt-[-5px] h-[40px] w-[90px] rounded-[10px] bg-[#FFEA20] font-bold uppercase hover:bg-[#FFEA20CC] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]">
            Sell {price}₳
          </button>
          <button className="mt-[-5px] h-[40px] w-[70px] rounded-[10px] bg-[#0097E2] font-bold uppercase hover:bg-[#0097E2CC] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]">
            Equip
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button className="mt-[-5px] h-[40px] w-[115px] rounded-[10px] bg-[#01FD91] font-bold uppercase hover:bg-[#01FD91CC] active:shadow-[inset_0px_4px_4px_rgba(0,0,0,0.35)]">
            Buy {price}₳
          </button>
        </div>
      )}
    </li>
  );
}
