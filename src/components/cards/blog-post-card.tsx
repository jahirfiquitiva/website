import styled from '@emotion/styled';
import Link from 'next/link';
import { usePalette } from 'react-palette';

import { Component, ComponentProps } from '~/elements/base/fc';
import { ExtLinkCard } from '~/elements/simple/card';
import { Heading } from '~/elements/simple/heading';
import { useTheme } from '~/providers/theme';
import { Post } from '~/types';
import buildShadowColors from '~/utils/build-shadow-colors';
import buildStyles from '~/utils/build-styles';
import formatDate from '~/utils/format-date';
import getColorFromPalette from '~/utils/get-color-from-palette';
import getReadableColor from '~/utils/get-readable-color';

const BaseBlogPostCard = styled(ExtLinkCard)`
  --border-radius: 8px;
  --shadow-one-size: 4px;
  --shadow-two-size: 8px;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .content {
    border: 1px solid var(--divider);
    display: flex;
    flex-direction: column;
    padding: 1.2rem;
    background-color: var(--blog-card-color);
    -webkit-backdrop-filter: saturate(200%) blur(8px);
    backdrop-filter: saturate(200%) blur(8px);
    text-shadow: 1px 1px 1px var(--blog-card-text-shadow);

    h4 {
      font-size: 1.1rem;
      color: var(--text-primary);
    }

    p {
      --max-lines: 2;
      display: -webkit-box;
      max-lines: var(--max-lines);
      -webkit-line-clamp: var(--max-lines);
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0.2rem 0;
      font-size: 0.9rem;
      color: var(--text-secondary);

      &.date-time {
        color: var(--text-tertiary);
      }
    }
  }

  &:hover,
  &:focus {
    & .content {
      background-color: var(--blog-card-color-hover);
      & h4 {
        color: var(--hl-color);
        text-decoration: underline;
      }
    }
  }
`;

interface BlogPostCardProps extends ComponentProps, Post {}

export const BlogPostCard: Component<BlogPostCardProps> = (props) => {
  const {
    title,
    excerpt,
    hero = '',
    date,
    color: defaultColor,
    slug,
    link,
    readingTime,
  } = props;
  const { isDark } = useTheme();

  const heroUrl =
    hero.length > 0 ? (hero.startsWith('..') ? null : hero) : null;

  const { data: paletteData } = usePalette(heroUrl || '');
  const color = getColorFromPalette(paletteData, isDark) || defaultColor;

  const rightLink = link && link.length > 0 ? link : `/blog/${slug}`;

  return (
    <Link href={rightLink} passHref={true}>
      <BaseBlogPostCard
        href={rightLink}
        underline={false}
        style={{
          ...buildShadowColors(color),
          backgroundColor: color || 'unset',
          backgroundImage: `url(${heroUrl})`,
        }}
      >
        <div className={'content'}>
          <Heading
            size={'4'}
            fontSize={'6'}
            style={buildStyles({
              '--hl-color': getReadableColor(color, isDark),
            })}
          >
            {title}
          </Heading>
          {excerpt && <p>{excerpt}</p>}
          <p className={'date-time'}>
            {formatDate(date)}
            {(readingTime?.text?.length || 0) > 0 && (
              <>
                {' • '}
                {readingTime?.text}
              </>
            )}
          </p>
        </div>
      </BaseBlogPostCard>
    </Link>
  );
};
