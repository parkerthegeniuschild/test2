import { prefetchJobs } from './_api/prefetchJobs';
import { Container } from './_components';

export const metadata = { title: 'Jobs' };

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { jobs, jobsColumns, jobsCount } = await prefetchJobs({ searchParams });

  return (
    <main>
      <Container
        initialJobs={jobs}
        initialColumnsVisibility={jobsColumns}
        initialJobsCount={jobsCount}
      />
    </main>
  );
}
