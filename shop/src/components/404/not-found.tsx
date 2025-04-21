import cn from "classnames";
import { useTranslation } from "next-i18next";
import { Image } from "@components/ui/image";
import noResult from "@assets/not-found.svg";
import Link from '@components/ui/link';

interface Props {
  text?: string;
  className?: string;
  subTitle?: string;
  image?: string;
  link?: string;
  linkTitle?: string;
}

const NotFound: React.FC<Props> = ({
  className,
  text,
  image = noResult,
  subTitle,
  link,
  linkTitle,
}) => {
  const { t } = useTranslation('common');
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src={image}
          alt={text ? t(text) : t('text-no-result-found')}
          className="w-full h-full object-contain"
        />
      </div>
      {text && (
        <h3 className="w-full text-center text-lg lg:text-xl font-semibold text-heading my-7">
          {t(text)}
        </h3>
      )}
      {subTitle ? (
        <p className="2xl: mb-4 text-sm uppercase tracking-widest text-body-dark sm:mb-5">
          {t(subTitle)}
        </p>
      ) : (
        ''
      )}
      {link ? (
        <Link
          href={link}
          className="inline-flex items-center text-bolder underline hover:text-body-dark hover:no-underline focus:outline-none sm:text-base"
        >
          {t(linkTitle)}
        </Link>
      ) : (
        ''
      )}
    </div>
  );
};

export default NotFound;
