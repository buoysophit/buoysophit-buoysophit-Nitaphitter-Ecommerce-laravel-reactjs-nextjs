import StickerCard from '@/components/widgets/sticker-card';
import { OwnershipTransfer, OrderStickerCardProps } from '@/types';
import usePrice from '@/utils/use-price';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';

interface OrderCardStickerCardProps {
  title: string;
  orderInfo: { [key: string]: number };
  contents: OrderStickerCardProps[];
  isShowOrderInfo?: boolean;
}

const OrderStickerCard = ({
  title,
  orderInfo,
  contents,
  isShowOrderInfo,
}: OrderCardStickerCardProps) => {
  const { t } = useTranslation();
  if (isShowOrderInfo) {
    return (
      <>
        {title ? (
          <p className="text-heading font-extrabold text-lg mb-5">{title}</p>
        ) : (
          ''
        )}
        {contents && !isEmpty(contents) && !isEmpty(orderInfo) ? (
          <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {contents.map((content) => {
              return (
                <div className="w-full" key={content?.key}>
                  <StickerCard
                    titleTransKey={t(content?.titleTransKey)}
                    icon={content?.icon}
                    color={content?.color}
                    price={orderInfo[content?.key]}
                    iconClassName="rounded-xl bg-[#F7F7F7]"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          ''
        )}
      </>
    );
  }
  return (
    <>
      {title ? (
        <p className="text-heading font-extrabold text-lg mb-5">{title}</p>
      ) : (
        ''
      )}
      {contents && !isEmpty(contents) ? (
        <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {contents.map((content, key) => {
            return <OrderInfoCard orderInfo={orderInfo} content={content} key={key} />;
          })}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export { OrderStickerCard };

export function OrderInfoCard({
  orderInfo,
  content,
}: {
  orderInfo: { [key: string]: number };
  content: OrderStickerCardProps;
}) {
  const { t } = useTranslation();
  const { price: total_revenue } = usePrice(
    orderInfo && {
      amount: Number(orderInfo[content?.key]),
    },
  );

  return (
    <div className="w-full" key={content?.key}>
      <StickerCard
        titleTransKey={t(content?.titleTransKey)}
        icon={content?.icon}
        color={content?.color}
        price={
          content?.key === 'admin_commission_rate'
            ? `${orderInfo[content?.key]}%`
            : total_revenue
        }
        iconClassName="rounded-xl bg-[#F7F7F7]"
      />
    </div>
  );
}
