import { Dialog, Transition } from '@headlessui/react';
import { getDirection } from '@lib/constants';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { FC, Fragment, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
// import { CloseIcon } from '@/components/icons/close-icon';
import { twMerge } from 'tailwind-merge';

type ModalProps = {
  open?: boolean;
  children?: React.ReactNode;
  onClose: () => void;
  rootClassName?: string;
  useBlurBackdrop?: boolean;
  containerClassName?: string;
  variant?: 'default' | 'center' | 'bottom' | 'fullWidth';
};
type DivElementRef = React.MutableRefObject<HTMLDivElement>;

// variant based classes for modal root, container & close btn
const rootClasses = {
  center: 'p-4 md:p-5',
  default: 'p-4 md:p-5',
  bottom: 'p-5 pb-0',
  fullWidth: '',
};
const containerClasses = {
  center: 'h-auto max-h-full top-1/2 -translate-y-1/2 rounded-lg',
  default: 'h-auto max-h-full top-1/2 -translate-y-1/2 rounded-lg',
  bottom:
    'h-full max-h-70vh bottom-0 ltr:rounded-tl-2xl rtl:rounded-tr-2xl ltr:rounded-tr-2xl rtl:rounded-tl-2xl',
  fullWidth: 'h-full top-0 left-0 sm:w-full translate-x-0',
};
const closeBtnClasses = {
  center:
    '-top-3.5 md:-top-4 ltr:-right-3.5 ltr:md:-right-4 rtl:-left-3.5 rtl:md:-left-4',
  default:
    '-top-3.5 md:-top-4 ltr:-right-3.5 ltr:md:-right-4 rtl:-left-3.5 rtl:md:-left-4',
  bottom:
    'top-1/4 ltr:left-1/2 rtl:right-1/2 transform -translate-y-1/2 -translate-x-1/2',
  fullWidth: '',
};

const Modal: FC<ModalProps> = ({
  children,
  open,
  onClose,
  rootClassName,
  useBlurBackdrop,
  containerClassName,
  variant = 'center',
}) => {
  // const { closeModal } = useUI();
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('common');

  const { locale } = useRouter();
  const dir = getDirection(locale);

  // const { locale } = useRouter();
  // const dir = getDirection(locale);
  // const modalRootRef = useRef() as DivElementRef;
  // const modalInnerRef = useRef() as DivElementRef;
  // useOnClickOutside(modalInnerRef, () => closeModal());

  // useEffect(() => {
  //   if (modalInnerRef.current) {
  //     if (open) {
  //       disableBodyScroll(modalInnerRef.current);
  //     } else {
  //       enableBodyScroll(modalInnerRef.current);
  //     }
  //   }
  //   return () => {
  //     clearAllBodyScrollLocks();
  //   };
  // }, [open]);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className={cn(
          'fixed inset-0 z-50 overflow-y-auto',
          rootClasses[variant],
          rootClassName,
        )}
        initialFocus={cancelButtonRef}
        static
        open={open}
        onClose={onClose}
        dir={dir}
      >
        <div className="relative h-full mx-auto w-full">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={cn(
                'fixed inset-0 h-full w-full bg-black bg-opacity-70',
                useBlurBackdrop && 'backdrop-filter backdrop-blur-sm',
              )}
            />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-105"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-105"
          >
            <Dialog.Panel
              className={twMerge(
                cn(
                  'w-full sm:w-auto absolute left-1/2 transform -translate-x-1/2 shadow-xl',
                  containerClasses[variant],
                  containerClassName,
                ),
              )}
            >
              <button
                onClick={onClose}
                aria-label="Close panel"
                ref={cancelButtonRef}
                className={twMerge(
                  cn(
                    'fixed z-10 inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white shadow text-gray-600 transition duration-200 focus:outline-none focus:text-gray-800 focus:shadow-md hover:text-gray-800 hover:shadow-md',
                    closeBtnClasses[variant],
                  ),
                )}
              >
                <span className="sr-only">{t('text-close')}</span>
                <IoClose className="text-xl" />
              </button>
              <div
                className={`h-full ${
                  variant !== 'default' ? 'overflow-y-auto' : ' '
                } ${variant !== 'fullWidth' ? 'rounded-lg' : ''}`}
              >
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
