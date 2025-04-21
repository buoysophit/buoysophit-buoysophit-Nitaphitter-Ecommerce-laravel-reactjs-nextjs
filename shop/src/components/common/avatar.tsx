import cn from 'classnames';
import { Image } from '@components/ui/image';

type AvatarProps = {
  className?: string;
  src: string;
  title: string;
  [key: string]: unknown;
};

const Avatar: React.FC<AvatarProps> = ({ src, className, title, ...rest }) => {
  return (
    <span
      className={cn(
        'relative block cursor-pointer overflow-hidden rounded-full border border-border-100',
        className
      )}
      {...rest}
    >
      <Image
        alt={title}
        src={src}
        fill
        sizes="(max-width: 768px) 100vw"
        priority={true}
      />
    </span>
  );
};

export default Avatar;
