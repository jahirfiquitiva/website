import { css } from '@emotion/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { Component, ComponentProps } from '~/types';

interface BaseLinkProps {
  underline?: boolean;
}

const baseLinkStyles = css`
  font-weight: 500;
  display: inline-block;
  color: var(--accent);
  &:hover,
  &:focus {
    color: var(--accent-dark);
  }
`;

export const isLocalLink = (href?: string) =>
  href && (href.startsWith('/') || href.startsWith('#'));

export interface LinkProps extends ComponentProps, BaseLinkProps {
  title: string;
  href: string;
  newTab?: boolean;
}

const prefetchBlockList = ['/music', '/dashboard', '/inspiration', '/static'];

export const Link: Component<LinkProps> = (props) => {
  const {
    title,
    href,
    newTab = !isLocalLink(href),
    underline = true,
    children,
    className,
    style,
  } = props;
  const router = useRouter();

  const shouldPrefetch = useMemo<boolean>(() => {
    if (!router || !router.isReady || newTab) return false;
    if (prefetchBlockList.some((link) => href.startsWith(link))) {
      return false;
    }
    const { asPath: pathname } = router;
    if (href === pathname || href.startsWith('#')) return false;
    const hrefWithoutCurrentPath = href.replace(pathname, '');
    const lastHrefPart = hrefWithoutCurrentPath.substring(
      hrefWithoutCurrentPath.lastIndexOf('/') + 1,
    );
    if (href.startsWith(pathname) && lastHrefPart.startsWith('#')) return false;
    return true;
  }, [router, href, newTab]);

  if (newTab) {
    return (
      <a
        href={href}
        title={title}
        aria-label={title}
        target={'_blank'}
        rel={'noopener noreferrer'}
        className={className}
        style={style}
        css={[
          baseLinkStyles,
          underline
            ? css`
                text-decoration: underline;
              `
            : css`
                text-decoration: none;
              `,
        ]}
      >
        {children}
      </a>
    );
  }

  const prefetchProps = !shouldPrefetch ? { prefetch: false } : {};
  return (
    <NextLink href={href} passHref {...prefetchProps}>
      <a
        title={title}
        aria-label={title}
        className={className}
        style={style}
        css={[
          baseLinkStyles,
          underline
            ? css`
                text-decoration: underline;
              `
            : css`
                text-decoration: none;
              `,
        ]}
      >
        {children}
      </a>
    </NextLink>
  );
};
