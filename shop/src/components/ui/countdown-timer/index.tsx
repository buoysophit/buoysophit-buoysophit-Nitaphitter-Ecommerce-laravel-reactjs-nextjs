import Countdown, { CountdownProps } from 'react-countdown';
import { SeparatorIcon } from '@components/icons/timer-separator';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

type CountdownTimerProps = {
  date: Date;
  title?: string;
  className?: string;
  onComplete?: CountdownProps['onComplete'];
  onStart?: CountdownProps['onStart'];
};

// Random component
const CompletionMessage = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = (
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
  if (completed) {
    // Render a completed state
    return <CompletionMessage />;
  } else {
    // Render a countdown
    return (
      <div
        className={twMerge(
          classNames(
            'text-accent [&>p]:bg-accent flex gap-2 text-lg [&>p]:mb-0 [&>p]:rounded [&>p]:p-3 [&>p]:text-sm [&>p]:font-semibold [&>p]:text-white [&>span]:self-center',
            props?.className,
          ),
        )}
      >
        <p>{days}d</p>
        <span>
          <SeparatorIcon />
        </span>
        <p>{hours}h</p>
        <span>
          <SeparatorIcon />
        </span>
        <p>{minutes}m</p>
        <span>
          <SeparatorIcon />
        </span>
        <p>{seconds}s</p>
      </div>
    );
  }
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  date,
  title,
  className,
  onComplete,
  onStart,
}) => {
  return (
    <>
      {title ? (
        <h4 className="text-muted-black text-xl font-semibold">{title}</h4>
      ) : (
        ''
      )}
      <Countdown
        date={date}
        renderer={(props) => renderer(props, { className })}
        onComplete={onComplete}
        onStart={onStart}
      />
    </>
  );
};

export default CountdownTimer;
