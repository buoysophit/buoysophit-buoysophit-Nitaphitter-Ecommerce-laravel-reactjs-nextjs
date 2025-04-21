import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

interface Props {
  message: string | undefined;
  className?: string;
}

const ValidationError = ({ message, className }: Props) => {
  return (
    <p
      className={twMerge(
        classNames('my-2 text-xs text-start text-red-500', className),
      )}
    >
      {message}
    </p>
  );
};

export default ValidationError;
