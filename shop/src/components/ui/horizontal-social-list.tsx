import { Social } from '@type/index';
import Link from '@components/ui/link';
import socialIcons from '@components/icons/social-icon';
import { getIcon } from '@lib/get-icon';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

type HorizontalSocialLinkProps = {
  socials: Social[];
  className?: string;
};

const HorizontalSocialLink: React.FC<HorizontalSocialLinkProps> = ({
  socials,
  className,
}) => {
  return (
    <div
      className={twMerge(classNames('flex items-center gap-5 pb-7', className))}
    >
      {socials?.map(
        ({ icon, url }: { icon: string; url: string }, idx: number) => (
          <Link
            key={idx}
            href={url}
            className="group flex items-center text-2xl"
          >
            {getIcon({
              iconList: socialIcons,
              iconName: icon,
            })}
          </Link>
        )
      )}
    </div>
  );
};

export default HorizontalSocialLink;
