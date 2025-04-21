import cn from 'classnames';
import { LabelHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Title: React.FC<Props> = ({ className = 'mb-3', ...rest }) => {
  return (
    <span
      className={twMerge(
        cn(
          'block text-body-dark font-semibold text-sm leading-none',
          className,
        ),
      )}
      {...rest}
    />
  );
};

export default Title;
