import * as React from 'react';

import { env } from '@/env';
import { isServer } from '@/environments';

async function initializeAxeCore() {
  if (env.NODE_ENV === 'production' || isServer()) {
    return;
  }

  const ReactDOM = (await import('react-dom')).default;
  // eslint-disable-next-line import/no-extraneous-dependencies
  const axe = (await import('@axe-core/react')).default;

  void axe(React, ReactDOM, 1000);
}

void initializeAxeCore();
