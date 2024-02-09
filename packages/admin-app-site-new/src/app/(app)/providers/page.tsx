import { prefetchProviders } from './_api/prefetchProviders';
import { Container } from './_components';

export const metadata = { title: 'Providers' };

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { providers, providersColumns, providersCount } =
    await prefetchProviders({ searchParams });

  return (
    <main>
      <Container
        initialProviders={providers}
        initialColumnsVisibility={providersColumns}
        initialProvidersCount={providersCount}
      />
    </main>
  );
}
