import ValidationError from '@/components/ui/form-validation-error';
import TooltipLabel from '@/components/ui/tooltip-label';
import classNames from 'classnames';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface DatePickerInputProps {
  control: any;
  minDate?: Date;
  maxDate?: Date;
  endDate?: Date;
  startDate?: Date;
  locale?: string;
  disabled?: boolean;
  placeholder?: string;
  todayButton?: string;
  name: string;
  label?: string;
  toolTipText?: string;
  required?: boolean;
  error?: string;
  dateFormat?: string;
  className?: string;
  showTimeSelect?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  timeCaption?: string;
  filterTime?: any;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  control,
  minDate,
  startDate,
  locale,
  disabled,
  placeholder = 'Start Date',
  todayButton = 'Today',
  name,
  label,
  toolTipText,
  required,
  error,
  dateFormat,
  className,
  maxDate,
  endDate,
  showTimeSelect,
  timeFormat,
  timeIntervals,
  timeCaption,
  filterTime,
  ...rest
}) => {
  return (
    <>
      {label ? (
        <TooltipLabel
          htmlFor={name}
          toolTipText={toolTipText}
          label={label}
          required={required}
        />
      ) : (
        ''
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <DatePicker
              {...field}
              minDate={minDate}
              // @ts-ignore
              selected={field?.value ? new Date(field?.value) : ''}
              startDate={new Date(startDate as Date)}
              locale={locale}
              todayButton={todayButton}
              placeholderText={placeholder}
              disabled={disabled}
              className={className}
              maxDate={maxDate}
              endDate={endDate}
              {...(showTimeSelect && {
                showTimeSelect: showTimeSelect,
                timeFormat: timeFormat,
                timeIntervals: timeIntervals,
                timeCaption: timeCaption,
                filterTime: filterTime,
              })}
              customInput={
                <div
                  className={twMerge(
                    classNames(
                      'border border-border-base px-4 h-12 flex items-center w-full rounded transition duration-300 ease-in-out text-heading text-sm cursor-pointer',
                      disabled
                        ? 'cursor-not-allowed border-[#D4D8DD] bg-[#EEF1F4] select-none'
                        : '',
                    ),
                  )}
                >
                  {field?.value
                    ? format(new Date(field?.value), 'MMMM, dd yyyy pp')
                    : field?.value}
                </div>
              } // use custom input to control input field focus
            />
          );
        }}
        {...rest}
      />
      <ValidationError message={error} />
    </>
  );
};

export default DatePickerInput;
