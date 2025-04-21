import Avatar from '@/components/common/avatar';
import { ChatIconNew } from '@/components/icons/chat';
import { MapPin } from '@/components/icons/map-pin';
import * as socialIcons from '@/components/icons/shop-transfer';
import ShortDescription from '@/components/shop-single/short-description';
import Badge from '@/components/ui/badge/badge';
import Button from '@/components/ui/button';
import Link from '@/components/ui/link';
import { Tooltip } from '@/components/ui/tooltip';
import { useCreateConversations } from '@/data/conversations';
import { Shop, ShopSocials, UserAddress } from '@/types';
import { getAuthCredentials } from '@/utils/auth-utils';
import { SUPER_ADMIN } from '@/utils/constants';
import { formatAddress } from '@/utils/format-address';
import { getIcon } from '@/utils/get-icon';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  title: string;
  className?: string;
  type?: 'OWNER' | 'RECEIVER';
  data: {
    id: Shop['id'];
    name: Shop['name'];
    image: Shop['logo'];
    email: string;
    address?: UserAddress;
    description?: string;
    socials?: ShopSocials[];
  };
}

const ShopDetailsCard = ({
  title,
  data,
  className,
  type = 'OWNER',
  ...rest
}: CardProps) => {
  const { permissions } = getAuthCredentials();
  const { mutate: createConversations, isLoading: creating } =
    useCreateConversations();

  const createAConversations = useCallback(({ shopId }: { shopId: number }) => {
    createConversations({
      shop_id: shopId,
      via: 'admin',
    });
  }, []);
  return (
    <div
      className={twMerge(
        classNames(
          '2xl:col-span-2 col-span-full self-stretch text-center space-y-5',
          className,
        ),
      )}
      {...rest}
    >
      <Badge
        text={title}
        className="rounded-full bg-[#E5E7EB] px-3 py-1.5 text-heading font-semibold text-sm tracking-[0.6px]"
      />
      <div className="bg-white rounded-[0.625rem] px-[3.75rem] py-12 shadow-shopTransferCard relative">
        {permissions?.includes(SUPER_ADMIN) && type === 'OWNER' ? (
          <div className="absolute top-6 right-6 z-10">
            <Tooltip content={`Connect With ${data?.name}`}>
              <Button
                onClick={() =>
                  createAConversations({ shopId: Number(data?.id) })
                }
                disabled={creating}
                loading={creating}
                className="cursor-pointer gap-2 bg-[#F3F4F6] h-auto rounded-[0.625rem] text-accent hover:text-white p-[0.875rem] text-[1.375rem]"
                title={`Connect With ${data?.name}`}
              >
                <ChatIconNew />
              </Button>
            </Tooltip>
          </div>
        ) : (
          ''
        )}
        <Avatar
          name={data?.name as string}
          src={data?.image?.thumbnail}
          className="w-[6.25rem] h-[6.25rem] rounded-3xl mb-4"
          customSize="100px"
        />
        {data?.name ? (
          <h3 className="text-xl font-semibold text-heading mb-1">
            {data?.name}
          </h3>
        ) : (
          ''
        )}
        {data?.email ? (
          <div>
            <Link
              className="text-base text-gray-600 hover:text-accent-hover transition-colors"
              href={`mailTo:${data?.email}`}
            >
              {data?.email}
            </Link>
          </div>
        ) : (
          ''
        )}
        {data?.address && formatAddress(data?.address) ? (
          <div className="mt-5">
            <Link
              href={`https://www.google.com/maps/place/${formatAddress(
                data?.address as UserAddress,
              )}`}
              className="text-sm text-[#111827] hover:text-accent-hover transition-colors inline-flex items-center gap-1"
            >
              <MapPin width="1em" height="1em" />
              {formatAddress(data?.address)}
            </Link>
          </div>
        ) : (
          ''
        )}
        {data?.description ? (
          <div className="mt-5">
            <ShortDescription
              content={data?.description}
              character={150}
              className="text-sm text-heading leading-[170%]"
            />
          </div>
        ) : (
          ''
        )}
        {!isEmpty(data?.socials) ? (
          <ul className="mt-5 flex justify-center items-center flex-wrap gap-3">
            {data?.socials?.map((social, index) => {
              return (
                <li key={index}>
                  <Link
                    href={social?.url as string}
                    className="bg-white flex h-10 w-10 transition-colors hover:bg-gray-100 rounded-[0.625rem] border border-[#E5E7EB] text-lg duration-300"
                  >
                    {getIcon({
                      iconList: socialIcons,
                      iconName: social?.icon as string,
                      className: 'm-auto',
                    })}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export { ShopDetailsCard };

