import { Fragment, useState } from 'react';
import { ReactComponentElement } from 'react';
import Link from 'next/link';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

interface pageState {
  name: string;
  current: boolean;
  animation: object;
}

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ');
}

export default function NavBar({
  state,
  handleClick,
}: {
  state: Array<pageState>;
  handleClick: Function;
}) {
  return (
    <Disclosure as="nav" className="bg-[#001033]">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center ">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}

                <Disclosure.Button className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500  lg:hidden">
                  <span className="sr-only">Open main menu</span>

                  <div className="w-6">
                    <span
                      aria-hidden="true"
                      className={`absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${
                        open ? 'rotate-45' : ' -translate-y-1.5'
                      }`}
                    ></span>
                    <span
                      aria-hidden="true"
                      className={`absolute block  h-0.5 w-6 transform   bg-current transition duration-300 ease-in-out ${
                        open ? 'opacity-0' : ''
                      }`}
                    ></span>
                    <span
                      aria-hidden="true"
                      className={`absolute block  h-0.5 w-6 transform bg-current  transition duration-300 ease-in-out ${
                        open ? '-rotate-45' : ' translate-y-1.5'
                      } `}
                    ></span>
                  </div>
                </Disclosure.Button>
              </div>

              <div
                className="flex flex-1 items-center justify-center sm:items-stretch 
              sm:justify-between"
              >
                <div className="flex flex-shrink-0 items-center">
                  <button onClick={(e) => handleClick(e, 0)}>
                    <Image
                      className="block h-12 w-auto "
                      src="/logo.svg"
                      alt="Pognitor-logo"
                      width={39}
                      height={41}
                    />
                  </button>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {state.map((item: pageState, index: number) => (
                      <button
                        key={item.name}
                        onClick={(e) => handleClick(e, index)}
                        className={classNames(
                          item.current
                            ? ' text-[#0097E2]'
                            : 'text-white duration-200 ease-in hover:text-[#656565]',
                          'text-md rounded-md px-3 py-2 font-bold',
                        )}
                      >
                        <div className="flex flex-row items-center gap-0.5">
                          <AnimatePresence>
                            {item.current && (
                              <motion.div
                                initial={{ opacity: 0, x: '-160%' }}
                                animate={{ opacity: 100, x: '-110%' }}
                                transition={{ duration: 0.2 }}
                                exit={{ opacity: 0, x: '-160%' }}
                                className="absolute h-[0px] w-[5px] rounded-sm border border-[#0097E2]"
                              ></motion.div>
                            )}
                          </AnimatePresence>
                          {item.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="absolute z-20 w-full  flex-grow sm:hidden">
            <div className="space-y-1 bg-[#001033] px-2 pb-3 pt-2">
              {state.map((item, index) => (
                <button
                  key={item.name}
                  onClick={(e) => handleClick(e, index)}
                  className={classNames(
                    item.current
                      ? 'bg-[#2C3B7C] text-white'
                      : 'text-gray-300 hover:bg-[#CBD2ED] hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
