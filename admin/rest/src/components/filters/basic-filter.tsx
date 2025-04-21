import Select from '@/components/ui/select/select';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

type Props = {
  onFilterFunction?: any;
  className?: string;
  filterOptions?: any;
  placeholder?: string;
  defaultValue?: any;
};

export default function BasicFilter({
  onFilterFunction,
  className,
  filterOptions,
  placeholder,
  defaultValue,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className,
      )}
    >
      <div className="w-full">
        <Select
          options={filterOptions}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.value}
          placeholder={placeholder}
          onChange={onFilterFunction}
          isClearable={true}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
}
