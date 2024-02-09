import { render, screen } from '@testing-library/react';

import { env } from '@/env';

import { TestBanner } from './TestBanner';

vi.mock('@/env', () => ({
  env: {
    NODE_ENV: 'production',
    NEXT_PUBLIC_STAGE_NAME: '',
  },
}));

describe('<TestBanner />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show `local` on local dev env', () => {
    vi.spyOn(env, 'NODE_ENV', 'get').mockReturnValue('development');

    render(<TestBanner />);

    expect(screen.getByRole('banner')).toHaveTextContent('local');
  });

  it('should show `development` on deployed dev env', () => {
    vi.spyOn(env, 'NEXT_PUBLIC_STAGE_NAME', 'get').mockReturnValue('dev');

    render(<TestBanner />);

    expect(screen.getByRole('banner')).toHaveTextContent('development');
  });

  it('should show `staging` on deployed staging env', () => {
    vi.spyOn(env, 'NEXT_PUBLIC_STAGE_NAME', 'get').mockReturnValue('staging');

    render(<TestBanner />);

    expect(screen.getByRole('banner')).toHaveTextContent('staging');
  });

  it('should show nothing on deployed prod env', () => {
    vi.spyOn(env, 'NEXT_PUBLIC_STAGE_NAME', 'get').mockReturnValue('prod');

    render(<TestBanner />);

    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });
});
