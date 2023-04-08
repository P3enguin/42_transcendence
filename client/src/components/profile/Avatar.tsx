import { EditIconProfile } from '../icons/Icons';
import { AvatarLevelCounter } from '../icons/Icons';
interface AvataProps {
  pfp: string;
  EditIcon: boolean;
  id: string;
  track:string;
  fill:string;
  cssProps:string;
  handlePfpChange?: (event: React.ChangeEvent) => Promise<void>;
}

function AvatarProfileComp({
  pfp,
  EditIcon,
  handlePfpChange,
  id,
  track,
  fill,
  cssProps,
}: AvataProps) {
  return (
    <div className="-mt-[120px] flex xl:-mt-[150px]">
      <img
        src={pfp}
        alt="pfp"
        id="pfp-holder"
        className="pfp absolute z-0 h-[130px] 
                w-[120px] translate-x-[20px] 
                translate-y-[28px] xl:h-[150px] xl:w-[130px] 
                xl:translate-x-[25px] xl:translate-y-[31px]"
      />
      {EditIcon && (
        <>
          <label
            htmlFor="pfp"
            className="absolute  z-20  mt-14  ml-28  cursor-pointer xl:mt-[70px] xl:ml-[130px]"
          >
            <EditIconProfile />
          </label>
          <input
            className="hidden cursor-pointer"
            name="pfp"
            id="pfp"
            type="file"
            accept="image/*"
            onChange={handlePfpChange}
          />
        </>
      )}
      <AvatarLevelCounter id={id} track={track} fill={fill} cssProps={cssProps}/>
    </div>
  );
}

export default AvatarProfileComp;
