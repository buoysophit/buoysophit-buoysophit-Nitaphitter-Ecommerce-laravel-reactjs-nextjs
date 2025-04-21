import Card from '@/components/common/card';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowNextNew } from '@/components/icons/arrow-next';
import {
  orderStatusWidgetContent,
  orderSummaryWidgetContent,
} from '@/components/shop-transfer/constants';
import { ShopDetailsCard } from '@/components/shop-transfer/templates/card';
import { Header } from '@/components/shop-transfer/templates/header';
import { BankAccount } from '@/components/shop-transfer/templates/payment-info';
import { RefundList } from '@/components/shop-transfer/templates/refund-list';
import { OrderStickerCard } from '@/components/shop-transfer/templates/sticker-card';
import { TopBar } from '@/components/shop-transfer/templates/top-bar';
import { WithdrawList } from '@/components/shop-transfer/templates/withdraw-list';
import Scrollbar from '@/components/ui/scrollbar';
import { Routes } from '@/config/routes';
import {
  OwnershipTransfer,
  PaymentInfo,
  Refund,
  ShopSocials,
  User,
  Withdraw,
} from '@/types';
import { getAuthCredentials } from '@/utils/auth-utils';
import { STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { isString } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface ShopTransferDetailsProps {
  data: OwnershipTransfer;
  userId: User['id'];
}

const Details: React.FC<ShopTransferDetailsProps> = ({ data, userId }) => {
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();

  const paymentInfoArray = useMemo(() => {
    let newPaymentInfo: PaymentInfo[] = [];
    return isString(data?.balance_info?.payment_info)
      ? newPaymentInfo.concat(JSON?.parse(data?.balance_info?.payment_info))
      : newPaymentInfo.concat(data?.balance_info?.payment_info as PaymentInfo);
  }, []);

  return (
    <Card>
      <TopBar status={data?.status} />
      <Header data={data} className="mb-10" />
      <div className="bg-[#F9FAFB] items-stretch rounded-md 2xl:p-12 p-4 3xl:px-[6.25rem] border border-dashed border-[#E5E7EB] grid grid-cols-5">
        <ShopDetailsCard
          title="CURRENT OWNER"
          data={{
            email: data?.previous_owner?.email,
            image: data?.shop?.logo,
            id: data?.shop?.id,
            name: data?.shop?.name,
            address: data?.shop?.address,
            description: data?.shop?.description,
            socials: data?.shop?.settings?.socials,
          }}
        />
        <div className="2xl:col-span-1 col-span-full text-center self-center 2xl:mt-10 my-5">
          <span className="bg-accent w-9 h-9 rounded-full text-white inline-flex mb-3">
            <ArrowNextNew className="m-auto hidden 2xl:block" />
            <ArrowDown className="m-auto block 2xl:hidden" />
          </span>
          <h4 className="text-gray-500 text-sm tracking-[0.4px] font-semibold hidden 2xl:block">
            TRANSFER
          </h4>
        </div>
        <ShopDetailsCard
          title="RECEIVER"
          type="RECEIVER"
          data={{
            email: data?.current_owner?.email,
            image: data?.current_owner?.profile?.avatar as any,
            id: data?.current_owner?.id,
            name: data?.current_owner?.name,
            description: data?.current_owner?.profile?.bio,
            socials: data?.current_owner?.profile?.socials as ShopSocials[],
          }}
        />
      </div>

      {data?.message ? (
        <div className="mt-10">
          <h3 className="text-black font-medium text-sm leading-none mb-3">
            Message from {data?.shop?.name}
          </h3>
          <div className="bg-[#F9FAFB] text-[#374151] text-sm border border-dashed border-[#E5E7EB] rounded p-4 h-40 leading-[150%]">
            <Scrollbar
              className="h-full w-full"
              options={{
                scrollbars: {
                  autoHide: 'scroll',
                },
              }}
            >
              <p className="pr-2">{data?.message}</p>
            </Scrollbar>
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="my-12">
        <p className="text-heading font-extrabold text-lg mb-5">
          Current Refund Status
        </p>
        <div className="border border-[#F3F4F6] bg-white rounded shadow-shopTransferTable relative overflow-hidden">
          <RefundList
            data={data?.refund_info as Refund[]}
            url={Routes.refund.list}
            permission={Boolean(permissions?.includes(SUPER_ADMIN))}
          />
        </div>
      </div>

      <>
        <p className="text-heading font-extrabold text-lg mb-5">
          Current Withdraw Status
        </p>
        <div className="border border-[#F3F4F6] bg-white rounded shadow-shopTransferTable relative overflow-hidden">
          <WithdrawList
            data={data?.withdrawal_info as Withdraw[]}
            url={Routes.withdraw.list}
            permission={Boolean(permissions?.includes(SUPER_ADMIN))}
          />
        </div>
      </>

      {permissions?.includes(SUPER_ADMIN) || userId === data?.created_by ? (
        <div className="my-12">
          <p className="text-heading font-extrabold text-lg mb-5">
            Shop Bank Information
          </p>
          <div className="border border-[#F3F4F6] bg-white rounded shadow-shopTransferTable relative overflow-hidden">
            <BankAccount data={paymentInfoArray} />
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="my-12">
        <OrderStickerCard
          title="Order Summary"
          orderInfo={data?.balance_info as any}
          contents={orderSummaryWidgetContent}
        />
      </div>

      <OrderStickerCard
        title="Order Status"
        orderInfo={data?.order_info as any}
        contents={orderStatusWidgetContent}
        isShowOrderInfo={true}
      />
    </Card>
  );
};

export { Details };

