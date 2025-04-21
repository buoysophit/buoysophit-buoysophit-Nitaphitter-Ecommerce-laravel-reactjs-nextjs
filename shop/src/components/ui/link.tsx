import NextLink, { LinkProps as NextLinkProps } from 'next/link';

const Link: React.FC<
  NextLinkProps & {
    className?: string;
    children?: React.ReactNode;
    title?: string;
    target?: string;
  }
> = ({ children, className, title, target, ...props }) => {
  return (
    <NextLink {...props} target={target} title={title} className={className}>
      {children}
    </NextLink>
  );
};

export default Link;
