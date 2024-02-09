import { redirect } from 'next/navigation';

import { css } from '@/styled-system/css';

import { useGetProviderLocations } from './_api';
import { Container } from './container';

export function generateMetadata({ params }: { params: { id: string } }) {
  return { title: `Provider #${params.id} Map` };
}

export default async function ProviderMapPage({
  params,
}: {
  params: { id: string };
}) {
  const providerId = Number(params.id);

  if (Number.isNaN(providerId)) {
    redirect('/providers');
  }

  let providerRecentLocations;

  try {
    providerRecentLocations = await useGetProviderLocations.queryFn({
      providerId,
      timeFrom: Date.now() - 60 * 60 * 1000,
    });
  } catch (err) {
    console.error('Error fetching provider locations', err);
  }

  return (
    <main
      className={css({
        h: '100vh',
        display: 'flex',
        overflow: 'hidden',

        '& [class*="marker-view"]:hover': {
          zIndex: 1,

          '& .pin-container': {
            w: '17.5rem',
            h: 'auto',
            p: 3,
            textTransform: 'none',
            rounded: 'xl',

            '& > svg': {
              display: 'none',
            },

            '& .info-container': {
              display: 'flex',
            },
          },
        },
      })}
    >
      <Container
        providerId={providerId}
        initialProviderRecentLocations={providerRecentLocations}
      />
    </main>
  );
}
