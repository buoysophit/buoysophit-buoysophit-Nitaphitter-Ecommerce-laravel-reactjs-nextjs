import cn from 'classnames';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
interface Props {
  className?: string;
  title: string;
  attributes: {
    id: number;
    value: string;
    meta: string;
  }[];
  active: string;
  onClick: any;
  clearAttribute?: any;
  variant?: 'default' | 'wishlist';
}

export const ProductAttributes: React.FC<Props> = ({
  className = 'mb-4',
  title,
  attributes,
  active,
  onClick,
  clearAttribute,
  variant = 'default',
}) => {
  const [activeValue, setActiveValue] = useState({ [title]: active });
  return (
    <div className={className}>
      <h3
        className={cn(
          'font-semibold capitalize',
          variant === 'default'
            ? 'text-base md:text-lg text-heading mb-2.5'
            : 'text-base text-black tracking-[-0.16px] mb-2'
        )}
      >
        {title}
      </h3>
      <ul
        className={cn(
          'colors flex flex-wrap',
          variant === 'default' ? 'ltr:-mr-3 rtl:-ml-3' : 'gap-2 mb-1'
        )}
      >
        {attributes?.map(({ id, value, meta }) => (
          <li
            key={`${value}-${id}`}
            className={twMerge(
              cn(
                'cursor-pointer',
                variant === 'default'
                  ? cn(
                      'rounded border min-w-[36px] md:min-w-[44px] min-h-[36px] md:min-h-[44px] p-1 mb-2 md:mb-3 ltr:mr-2 rtl:ml-2 ltr:md:mr-3 rtl:md:ml-3 flex justify-center items-center text-heading text-xs md:text-sm uppercase font-semibold transition duration-200 ease-in-out hover:border-black',
                      value === activeValue[title]
                        ? 'border-black'
                        : 'border-gray-100',
                      {
                        'px-3 md:px-3.5': title === 'size',
                      }
                    )
                  : cn(
                      'rounded-md overflow-hidden relative',
                      title === 'size'
                        ? 'px-[12px] py-[7px] text-sm text-black tracking-[-0.14px] bg-[#F1F1F1] border border-solid border-[#E6E6E6]'
                        : 'w-8 h-8 before:absolute before:top-0 before:left-0 before:h-full before:w-full before:border-2 before:border-solid before:border-transparent before:rounded-md',
                      value === activeValue[title]
                        ? title === 'size'
                          ? 'bg-white border-black border-2'
                          : 'before:border-black shadow-variationButton'
                        : ''
                    )
              )
            )}
            onClick={() => {
              onClick({ [title]: value });
              setActiveValue({ [title]: value });
            }}
          >
            {title === 'color' || title === 'colors' ? (
              <span
                className="h-full w-full rounded block"
                style={{ backgroundColor: meta ?? value }}
              />
            ) : (
              value
            )}
          </li>
        ))}
      </ul>
      {activeValue[title] ? (
        <span
          className="cursor-pointer text-red-500 text-xs"
          onClick={() => {
            setActiveValue({ [title]: '' });
            clearAttribute();
          }}
        >
          Clear
        </span>
      ) : (
        ''
      )}
    </div>
  );
};
