/* eslint-disable */
import React from 'react';
import Image from 'next/image';
const UM6P_LOGO = 'https://um6p.ma/sites/default/files/logo.svg';
const ECOLE_42_LOGO =
  'https://www.42network.org/wp-content/themes/e42-network/img/42-network-logo.svg';
const ECOLE_1337_LOGO =
  'https://candidature.1337.ma/assets/1337-3dd8e03c0c0e5b36e4f206b32202f47a388a55e0ddf80cadbd0c7e68fcaaf2ab.svg';

const PIC =
  'https://cdn.intra.42.fr/users/416493c507c25cad58df4a1e0d2cc04c/ael-hadd.jpg';

const badge = () => {
  return (
    <>
      <div className="relative h-[50vh] w-[40vw] rounded-2xl bg-[#001e30] text-[1.25vw]">
        <h2 className="absolute left-[4%] top-[4%]">ael-hadd&apos;s profile</h2>
        <Image
          width={100}
          height={100}
          src={UM6P_LOGO}
          alt="um6p logo"
          className="absolute right-[4%] top-[4%] w-[25%] brightness-0 invert"
        />
        <Image
          width={100}
          height={100}
          src={ECOLE_1337_LOGO}
          alt="1337 logo"
          className="absolute right-[31%] top-[4%] w-[15%] brightness-0 invert"
        />
        <Image
          width={100}
          height={100}
          src={ECOLE_42_LOGO}
          alt="42 logo"
          className="absolute bottom-[4%] right-[4%] w-[25%] invert"
        />
        <Image
          width={100}
          height={100}
          src={PIC}
          alt="pic"
          className=" absolute left-[4%] top-[25%] w-[20%] rounded-2xl"
        />
        <div className="absolute left-[28%] top-[25%] flex flex-col">
          <label htmlFor="name" className="block ">
            name:
          </label>
          <label htmlFor="email" className="block ">
            email:
          </label>
          <label htmlFor="cursus" className="block ">
            cursus:
          </label>
          <label htmlFor="grade" className="block ">
            grade:
          </label>
        </div>
        <div className="absolute left-[40%] top-[25%] flex flex-col text-[#008daf]">
          <label htmlFor="name" className="block ">
            AbderraHman El Haddad Asofi
          </label>
          <label htmlFor="email" className="block ">
            ael-hgadd@student.1337.ma
          </label>
          <label htmlFor="cursus" className="block ">
            42Cursus
          </label>
          <label htmlFor="grade" className="block ">
            Learner
          </label>
        </div>
        <div className="absolute left-[4%] top-[72%] h-[13%] w-[92%] rounded-lg bg-gray-600">
          <div className="h-[100%] w-[9.6%] content-center rounded-[20%] bg-[#008daf]">
            <p className="absolute right-[50%] top-[50%] translate-x-[50%] translate-y-[-50%] ">
              9.6%
            </p>
          </div>
        </div>
        <h2 className="absolute bottom-[4%] left-[4%] rounded-md bg-[#008daf] p-1 text-[1vw]">
          STUDENT
        </h2>
      </div>
    </>
  );
};

export default badge;
