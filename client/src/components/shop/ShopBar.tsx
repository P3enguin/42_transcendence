import { ShopFilterIcon } from '../icons/Icons';
import ShopFilterButton from './ShopFilterButton';
import Image from 'next/image';

export default function ShopBar({
  categories,
  selectedCategories,
  updateFilter,
}: {
  categories: string[];
  selectedCategories: string[];
  updateFilter: (category: string, active: boolean) => void;
}) {
  return (
    <div className="flex w-[90%] flex-wrap items-center gap-[15px] rounded-[10px] border border-white bg-[#2C3B7C] px-[18px] py-[12px] shadow-md">
      <ShopFilterIcon />
      {selectedCategories.map((category: string) => (
        <ShopFilterButton
          key={category}
          name={category}
          active={true}
          updateFilter={updateFilter}
        />
      ))}
      {categories.map(
        (category: string) =>
          !selectedCategories.includes(category) && (
            <ShopFilterButton
              key={category}
              name={category}
              active={false}
              updateFilter={updateFilter}
            />
          ),
      )}
      <div className="ml-auto flex gap-[7px]">
        <Image src="/coin.svg" alt="coinIcon" width={34} height={34} />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold">1337 ₳</p>
          <p className="text-[9px] text-[#FFFFFFB3]">coins earned</p>
        </div>
      </div>
    </div>
  );
}
