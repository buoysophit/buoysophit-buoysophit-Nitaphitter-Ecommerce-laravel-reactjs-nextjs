import { useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import cn from 'classnames';
import { ToggleIcon } from '@components/icons/toggle-icon';
import {
  offset,
  flip,
  autoUpdate,
  useFloating,
  shift,
} from '@floating-ui/react-dom-interactions';

interface PopOverProps {
  children: React.ReactNode;
  popOverButtonClass?: string;
  popOverPanelClass?: string;
}

const PopOver = ({
  children,
  popOverButtonClass,
  popOverPanelClass,
}: PopOverProps) => {
  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    strategy: 'fixed',
    placement: 'bottom',
    middleware: [offset(0), flip(), shift()],
  });

  // This one is for recalculating the position of the floating element if no space is left on the given placement
  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  return (
    <Popover className="relative">
      {({}) => (
        <>
          <Popover.Button
            className={cn(
              'p-2 text-base opacity-80 ring-0 transition duration-200 hover:text-heading focus:outline-0',
              popOverButtonClass
            )}
            ref={reference}
          >
            <ToggleIcon width={16} />
          </Popover.Button>
          <div
            ref={floating}
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
              zIndex: 1,
            }}
          >
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={cn(
                  'w-full min-w-[10rem] rounded bg-white py-2 px-1 text-left shadow-cardAction',
                  popOverPanelClass
                )}
              >
                {children}
              </Popover.Panel>
            </Transition>
          </div>
        </>
      )}
    </Popover>
  );
};

export default PopOver;
