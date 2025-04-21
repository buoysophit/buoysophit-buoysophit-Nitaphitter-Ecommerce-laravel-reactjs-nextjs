import type { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import AnchorLink from '@components/ui/anchor-link';

interface ActiveLinkProps extends LinkProps {
  activeClassName?: string;
  children?: React.ReactNode;
}
const ActiveLink: React.FC<
  ActiveLinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
> = ({ href, className, activeClassName = 'active', ...props }) => {
  const { pathname } = useRouter();
  return (
    <AnchorLink
      href={href}
      className={classNames(className, {
        [activeClassName]: pathname === href,
      })}
      {...props}
    />
  );
};

export default ActiveLink;
