import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

export default function CarouselNavigation({
  buttonClassName,
  nextActivateId,
  prevActivateId,
  buttonSize,
  buttonPosition,
  dir,
}: {
  buttonClassName?: string;
  dir?: string;
  buttonSize?: 'default' | 'small';
  buttonPosition?: 'inside' | 'outside';
  prevActivateId?: string;
  nextActivateId?: string;
}) {
  return (
    <div className="absolute z-10 flex items-center w-full top-2/4">
      <button
        id={prevActivateId}
        aria-label="prev-button"
        className={`${buttonClassName} ${
          buttonSize === 'default'
            ? 'w-7 h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 3xl:w-12 3xl:h-12 text-sm md:text-base lg:text-xl 3xl:text-2xl'
            : 'w-7 h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 text-sm md:text-base lg:text-lg'
        } text-black flex items-center justify-center rounded-full text-gray-0 bg-white absolute transition duration-250 hover:bg-gray-900 hover:text-white focus:outline-none ${
          buttonPosition === 'inside'
            ? 'ltr:left-16 rtl:right-16'
            : 'ltr:left-0 rtl:right-0'
        } transform ${
          dir === 'rtl'
            ? 'rotate-180 shadow-navigationReverse translate-x-1/2'
            : 'shadow-navigation -translate-x-1/2'
        }`}
      >
        <IoIosArrowBack />
      </button>
      <button
        id={nextActivateId}
        aria-label="next-button"
        className={`${buttonClassName} ${
          buttonSize === 'default'
            ? 'w-7 h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10 3xl:w-12 3xl:h-12 text-sm md:text-base lg:text-xl 3xl:text-2xl'
            : 'w-7 h-7 lg:w-8 lg:h-8 text-sm md:text-base lg:text-lg'
        } text-black flex items-center justify-center rounded-full bg-white absolute transition duration-250 hover:bg-gray-900 hover:text-white focus:outline-none ${
          buttonPosition === 'inside'
            ? 'ltr:right-16 rtl:left-16'
            : 'ltr:right-0 rtl:left-0'
        } transform ${
          dir === 'rtl'
            ? 'rotate-180 shadow-navigationReverse -translate-x-1/2'
            : 'shadow-navigation translate-x-1/2'
        }`}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
}
