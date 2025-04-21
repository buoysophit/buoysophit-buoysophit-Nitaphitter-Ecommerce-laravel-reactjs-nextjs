import React from 'react';
import { guestEmailAtom, guestNameAtom } from '@store/checkout';
import { useAtom } from 'jotai';
import Input from '@components/ui/input';
import { Tooltip } from 'react-tooltip';
import { InfoIcon } from '@components/icons/info-icon';

interface GuestNameProps {
  count: number;
  label: string;
  className: string;
}

function GuestName({ count, label, className }: GuestNameProps) {
  const [name, setName] = useAtom(guestNameAtom);
  const [emailAddress, setEmailAddress] = useAtom(guestEmailAtom);
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-5 lg:mb-6 xl:mb-7 -mt-1 xl:-mt-2">
        <div className="flex items-center gap-3 md:gap-4 text-lg lg:text-xl text-heading capitalize font-medium">
          {count && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-heading text-base text-white lg:text-xl">
              {count}
            </span>
          )}
          {label}
          <a data-tooltip-id="my-tooltip" data-tooltip-content="Email address is mandatory for some payment gateways">
            <InfoIcon className='w-4 h-4' />
          </a>
          <Tooltip id="my-tooltip" style={{ background: "#212121", fontSize: "14px", padding: "0 10px"}} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Input
          //@ts-ignore
          value={name}
          name="guestName"
          onChange={(e) => setName(e.target.value)}
          variant="outline"
          placeholder='Name'
          inputClassName='py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12'
        />
        <Input
          //@ts-ignore
          value={emailAddress}
          name="setEmailAddress"
          onChange={(e) => setEmailAddress(e.target.value)}
          variant="outline"
          placeholder='Email'
          inputClassName='py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12'
        />
      </div>
    </div>
  );
}
export default GuestName;
