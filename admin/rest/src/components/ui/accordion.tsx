import { Disclosure, Transition } from '@headlessui/react';
import { Chevron } from '@/components/icons/chevron';
import Alert from '@/components/ui/alert';
import classNames from 'classnames';
import { InfoIcon } from '@/components/icons/info-icon';
import { Warning } from '@/components/icons/warning';
import { twMerge } from 'tailwind-merge';

interface AccordionProps {
  defaultOpen: boolean;
  isError?: boolean;
  buttonTitle: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const Accordion = ({
  defaultOpen,
  isError,
  buttonTitle,
  children,
  icon = isError ? (
    <Warning className="text-lg" />
  ) : (
    <InfoIcon className="text-lg" />
  ),
  className,
}: AccordionProps) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full">
            <Alert
              childClassName={classNames(
                'flex gap-2 items-center w-full',
                isError ? 'animate-pulse' : '',
              )}
              message={buttonTitle}
              variant={isError ? 'error' : 'success'}
            >
              {icon}
              <Chevron
                className={classNames(
                  'ml-auto transform transition-transform duration-300',
                  open ? 'rotate-180' : 'rotate-0',
                )}
              />
            </Alert>
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className={twMerge(classNames(className))} static>
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Accordion;
