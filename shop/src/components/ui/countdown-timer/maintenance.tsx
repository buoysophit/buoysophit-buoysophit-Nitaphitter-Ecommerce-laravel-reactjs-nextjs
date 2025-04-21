import { checkIsMaintenanceModeStart } from '@lib/constants';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import Countdown, { CountdownProps } from 'react-countdown';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';

type CountdownTimerProps = {
  date: Date;
  title?: string;
  onComplete?: CountdownProps['onComplete'];
};

// Random component
const CompletionMessage = () => <span>You are good to go!</span>;

// Renderer callback with condition
export const Renderer = (
  {
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  },
  // @ts-ignore
  props,
) => {
  let classNameList = {
    timer:
      'text-center text-xl font-bold leading-none tracking-wide lg:min-w-[120px] lg:text-[5.3125rem]',
    title: 'mt-4 block text-center text-base font-medium lowercase',
    separator: 'relative top-2 text-6xl font-bold leading-none',
    separatorParent: 'hidden self-start lg:block',
  };
  if (completed) {
    // Render a completed state
    return <CompletionMessage />;
  } else {
    // Render a countdown
    return (
      <ul className="mx-auto flex max-w-xl flex-col items-center justify-between gap-8 px-5 md:flex-row lg:w-[51.25rem] lg:max-w-2xl lg:px-0">
        <li className="flex">
          <div className={twMerge(classNames(classNameList?.timer))}>
            {days}
            <span className={twMerge(classNames(classNameList?.title))}>
              {props?.translate('text-title-days')}
            </span>
          </div>
        </li>
        <li className={twMerge(classNames(classNameList?.separatorParent))}>
          <div className={twMerge(classNames(classNameList?.separator))}>:</div>
        </li>
        <li className="flex">
          <div className={twMerge(classNames(classNameList?.timer))}>
            {hours}
            <span className={twMerge(classNames(classNameList?.title))}>
              {props?.translate('text-title-hours')}
            </span>
          </div>
        </li>
        <li className={twMerge(classNames(classNameList?.separatorParent))}>
          <div className={twMerge(classNames(classNameList?.separator))}>:</div>
        </li>
        <li className="flex">
          <div className={twMerge(classNames(classNameList?.timer))}>
            {minutes}
            <span className={twMerge(classNames(classNameList?.title))}>
              {props?.translate('text-title-minutes')}
            </span>
          </div>
        </li>
        <li className={twMerge(classNames(classNameList?.separatorParent))}>
          <div className={twMerge(classNames(classNameList?.separator))}>:</div>
        </li>
        <li className="flex">
          <div className={twMerge(classNames(classNameList?.timer))}>
            {seconds}
            <span className={twMerge(classNames(classNameList?.title))}>
              {props?.translate('text-title-seconds')}
            </span>
          </div>
        </li>
      </ul>
    );
  }
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ date, title, onComplete }) => {
  const { t } = useTranslation('common');
  return (
    <>
      {title ? (
        <h4 className="text-muted-black text-xl font-semibold">{title}</h4>
      ) : (
        ''
      )}
      <Countdown
        date={date}
        renderer={(props) => Renderer(props, { translate: t })}
        onComplete={onComplete}
      />
    </>
  );
};

export default CountdownTimer;
