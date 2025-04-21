import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@lib/routes';
import { useTranslation } from 'next-i18next';
import { Type } from '@type/index';
import { filterBrandImages } from '@lib/filter-brands';
import React from 'react';

const BrandCard: React.FC<{ brand: Type }> = ({ brand }) => {
  const { slug, name, images } = brand;
  const { t } = useTranslation('common');

  // Filter images
  const filterImages = filterBrandImages(images, 'grid-layout');

  return (
    <Link
      href={{
        pathname: ROUTES.SEARCH,
        query: { brand: slug },
      }}
      className="relative flex justify-center overflow-hidden text-center rounded-md group"
    >
      <Image
        src={
          filterImages?.image?.[0]?.original ??
          '/assets/placeholder/brand-bg.svg'
        }
        alt={name || t('text-brand-thumbnail')}
        width={428}
        height={428}
        className="object-cover transition-transform duration-500 ease-in-out transform rounded-md group-hover:rotate-6 group-hover:scale-125"
      />
      <div className="absolute w-full h-full transition-opacity duration-500 bg-black opacity-50 top left group-hover:opacity-80" />
      <div className="absolute flex items-center justify-center w-full h-full p-8 top left">
        <img
          src={
            filterImages?.image?.[1]?.original ??
            '/assets/placeholder/brand-bg.svg'
          }
          alt={name || t('text-brand-thumbnail')}
          className="flex-shrink-0"
        />
      </div>
    </Link>
  );
};

export default BrandCard;
