import Scrollbar from "@components/common/scrollbar";
import ShopSidebar from '@components/shops/shop-sidebar';
import { useUI } from '@contexts/ui.context';
import { getDirection } from '@utils/get-direction';
import { useRouter } from 'next/router';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

interface Props {
  data: any;
}

const ShopSidebarDrawer: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const dir = getDirection(router.locale);
  const { closeSidebar } = useUI();
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <div className="w-full border-b border-gray-100 flex justify-between items-center relative ltr:pr-5 ltr:md:pr-7 rtl:pl-5 rtl:md:pl-7 flex-shrink-0 py-0.5">
        <button
          className="flex text-2xl items-center justify-center text-gray-500 px-4 md:px-5 py-6 lg:py-8 focus:outline-none transition-opacity hover:opacity-60"
          onClick={closeSidebar}
          aria-label="close"
        >
          {dir === 'rtl' ? (
            <IoArrowForward className="text-black" />
          ) : (
            <IoArrowBack className="text-black" />
          )}
        </button>
        <h2 className="font-bold text-xl md:text-2xl m-0 text-heading w-full text-center ltr:pl-6 rtl:pr-6">
          Details
        </h2>
      </div>

      <Scrollbar className="shop-sidebar-scrollbar flex-grow mb-auto">
        <ShopSidebar data={data} />
      </Scrollbar>
    </div>
  );
};

export default ShopSidebarDrawer;