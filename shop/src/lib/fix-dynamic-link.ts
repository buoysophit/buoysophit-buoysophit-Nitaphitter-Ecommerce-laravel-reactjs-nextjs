import { ROUTES } from '@lib/routes';

export const fixDynamicLink = (link?: string) => {
  const obj: { href: string; target?: string; rel?: string } = { href: '/' };

  if (!link) obj['href'] = ROUTES.HOME;
  else if (
    link?.startsWith('http') ||
    link?.startsWith('https') ||
    link?.startsWith('www')
  ) {
    obj['href'] = link;
    obj['target'] = '_blank';
    obj['rel'] = 'noopener noreferrer';
  } else {
    obj['href'] = link;
  }
  return obj;
};
