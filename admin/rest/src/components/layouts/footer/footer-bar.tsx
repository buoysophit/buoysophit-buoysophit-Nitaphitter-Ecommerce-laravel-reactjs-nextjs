import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { useSettings } from '@/contexts/settings.context';
import { useTranslation } from 'next-i18next';

export type IFooterProp = {
  className?: string;
};

const Footer: React.FC<IFooterProp> = ({ className }) => {
  const { t } = useTranslation();
  
  return (
    <footer className="mt-auto bg-white shadow">
      <div className="mx-auto w-full">
        <div className="flex items-center bg-white px-5 py-6 md:px-8">
          <span className="text-sm text-body sm:text-center">
            ©{new Date().getFullYear()}{' '}
            <Link
              className="font-medium text-heading"
              href={Routes?.dashboard}
            >
              Nitaphitter
            </Link>
            . All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
