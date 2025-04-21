import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import Scrollbar from '@components/common/scrollbar';
import { fadeInRight } from '@utils/motion/fade-in-right';
import { fadeInLeft } from '@utils/motion/fade-in-left';
import { fadeInOut } from '@utils/motion/fade-in-out';
import { useRouter } from 'next/router';
import { getDirection } from '@lib/constants';
import { twMerge } from 'tailwind-merge';
import { Dialog } from '@headlessui/react';

interface DrawerProps {
  children: any;
  open: boolean;
  variant?: 'left' | 'right';
  useBlurBackdrop?: boolean;
  onClose: () => void;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  children,
  open = false,
  variant = 'right',
  useBlurBackdrop = true,
  onClose,
  className,
}) => {
  const { locale } = useRouter();
  const dir = getDirection(locale);

  if (dir === 'rtl' && variant === 'right') {
    variant = 'left';
  } else if (dir === 'rtl' && variant === 'left') {
    variant = 'right';
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog static as={motion.div} open={open} onClose={onClose}>
          <div dir={dir}>
            <motion.aside
              key="drawer"
              initial="from"
              animate="to"
              exit="from"
              variants={variant === 'right' ? fadeInRight() : fadeInLeft()}
              className="fixed inset-0 z-50 h-full overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  initial="from"
                  animate="to"
                  exit="from"
                  variants={fadeInOut(0.35)}
                  onClick={onClose}
                  className={cn(
                    'absolute inset-0 bg-heading bg-opacity-40',
                    useBlurBackdrop && 'use-blur-backdrop',
                  )}
                />
                <div
                  className={cn(
                    'absolute inset-y-0 flex max-w-full outline-none',
                    variant === 'right'
                      ? 'ltr:right-0 rtl:right-0'
                      : 'ltr:left-0 rtl:left-0',
                  )}
                >
                  <div
                    className={twMerge(
                      cn('h-full w-screen bg-white max-w-md', className),
                    )}
                  >
                    <div className="drawer flex h-full flex-col bg-light text-base shadow-xl">
                      <Scrollbar className="h-full w-full">
                        {children}
                      </Scrollbar>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
