import * as sellerIcons from '@/components/icons/sellers';
import { sellerIconList } from '@/components/become-seller/seller-icons';
import { getIcon } from '@/utils/get-icon';

export const updatedIcons = sellerIconList.map((item: any) => {
  item.label = (
    <div className="flex items-center space-s-5">
      <span className="flex items-center justify-center w-5 h-5">
        {getIcon({
          iconList: sellerIcons,
          iconName: item.value,
          className: 'max-h-full max-w-full',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});
