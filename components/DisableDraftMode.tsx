'use client';

import { useTransition } from 'react';
import { disableDraftMode } from '@/app/actions';
import { useIsPresentationTool } from 'next-sanity/hooks';

export function DisableDraftMode() {
  const [pending, startTransition] = useTransition();
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool === null && isPresentationTool !== true) {
    return null;
  }

  const disable = () => startTransition(() => disableDraftMode());

  return (
    <div>
      {pending ? (
        'Disabling draft mode...'
      ) : (
        <button type="button" onClick={disable}>
          Disable draft mode
        </button>
      )}
    </div>
  );
}
