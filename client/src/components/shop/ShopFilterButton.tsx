export default function ShopFilterButton({
  name,
  active,
  updateFilter,
}: {
  name: string;
  active: boolean;
  updateFilter: (category: string, active: boolean) => void;
}) {
  if (active) {
    return (
      <div className="flex items-center gap-[6px] rounded-[10px] border border-[#0097E2] bg-[#0097E2] px-[12px] py-[6px]">
        <p className="text-[15px] font-bold uppercase">{name}</p>
        <button
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] bg-[#8BD9FF66] hover:bg-[#8BD9FF3F]"
          onClick={() => updateFilter(name, active)}
        >
          <div className="pt-[7px] text-xl text-[#8BD9FF]">˟</div>
        </button>
      </div>
    );
  } else {
    return (
      <button
        className="flex items-center gap-[6px] rounded-[10px] border border-[#0097E2] px-[12px] py-[6px] hover:bg-[#0097E2]"
        onClick={() => updateFilter(name, active)}
      >
        <p className="text-[15px] font-bold uppercase">{name}</p>
      </button>
    );
  }
}
