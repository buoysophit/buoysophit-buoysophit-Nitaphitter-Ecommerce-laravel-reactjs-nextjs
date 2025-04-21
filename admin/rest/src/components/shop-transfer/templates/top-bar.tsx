import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import Badge from '@/components/ui/badge/badge';
import { useTranslation } from 'next-i18next';
import StatusColor from '@/components/order/status-color';

interface TopBarProps {
  status: string;
  className?: string;
}

const TopBar = ({ status, className, ...props }: TopBarProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={twMerge(
        classNames(
          'mb-6 -mt-5 -ml-5 -mr-5 md:-mr-8 md:-ml-8 md:-mt-8',
          className,
        ),
      )}
      {...props}
    >
      <div className="bg-[#F7F8FA] px-8 py-4 text-base font-bold text-heading capitalize">
        <span className="mb-2 block lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
          Shop Transfer Status :
        </span>
        <Badge text={t(status)} color={StatusColor(status)} />
      </div>
    </div>
  );
};

export { TopBar };
