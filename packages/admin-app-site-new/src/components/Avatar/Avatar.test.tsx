import { render, screen } from '@testing-library/react';

import { Avatar } from './Avatar';

describe('<Avatar />', () => {
  it('should render correctly', () => {
    render(<Avatar src="https://i.pravatar.cc/300?u=truckup" name="Truckup" />);

    expect(screen.getByRole('img', { name: /truckup/i })).toBeInTheDocument();
  });

  it('should render the initials if src is not present', () => {
    render(<Avatar name="Foo bar" />);

    expect(screen.getByRole('img', { name: /foo bar/i })).toBeInTheDocument();
    expect(screen.getByText(/fb/i)).toBeInTheDocument();
  });
});
