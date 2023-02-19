import { Fragment, useState } from 'react'
import { ReactComponentElement } from 'react'
import Link from 'next/link'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { useEffect } from 'react'


function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}


export default function NavBar() {
    const router = useRouter();
    const navigation = [
      { name: 'Home', href: '/'},
      { name: 'About', href: '/about'},
      { name: 'Contact', href: '/contact'},
    ]
  
    return (

        <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center ">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center 
                    rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white 
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch 
                sm:justify-between">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-12 w-auto lg:hidden"
                    src="logo.png"
                    alt="Pognitor-logo"
                  />
                  <img
                    className="hidden h-12 w-auto lg:block"
                    src="logo.png"
                    alt="Pognitor-logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link 
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          router.pathname === item.href ? ' text-[#0097E2]' : 'text-white hover:text-[#656565] ease-in duration-200',
                          'px-3 py-2 rounded-md text-md font-bold'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center
                      pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400
                   hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                </button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      className={classNames(
                            router.pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'block px-3 py-2 rounded-md text-base font-medium'
                          )}

                      >
                      {item.name}
                    </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    )
  }

