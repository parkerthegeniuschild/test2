import { useParams } from 'next/navigation';

export function useJobId() {
  return useParams().id as string;
}
