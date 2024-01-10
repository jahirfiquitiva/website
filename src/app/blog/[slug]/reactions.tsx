import { Suspense } from 'react';

import { getReactions } from '@/actions/reactions';
import { ReactionsButtons } from '@/components/views/blog/reactions';

export const Reactions = async ({ slug }: { slug?: string }) => {
  if (!slug) return null;
  const reactionsCounters = await getReactions(slug);
  return (
    <Suspense fallback={<div className={'min-h-11 min-w-11'} />}>
      <ReactionsButtons
        slug={slug}
        initialReactionCounters={reactionsCounters}
      />
    </Suspense>
  );
};
