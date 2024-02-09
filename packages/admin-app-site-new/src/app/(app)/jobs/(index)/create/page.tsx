import { Container } from './_components';
import { Providers } from './providers';

export const metadata = { title: 'Create Job' };

export default function CreateJobPage() {
  return (
    <main>
      <Providers>
        <Container />
      </Providers>
    </main>
  );
}
