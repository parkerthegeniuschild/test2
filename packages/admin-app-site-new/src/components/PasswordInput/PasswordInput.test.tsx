import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasswordInput } from './PasswordInput';

describe('<PasswordInput />', () => {
  it('should render correctly', () => {
    render(<PasswordInput placeholder="foo" />);

    expect(screen.getByPlaceholderText('foo')).toBeInTheDocument();
  });

  it('should initialize with hidden password', () => {
    render(<PasswordInput placeholder="foo" />);

    expect(screen.getByPlaceholderText('foo')).toHaveAttribute(
      'type',
      'password'
    );
  });

  it('should toggle password visibility correctly', async () => {
    render(<PasswordInput placeholder="foo" />);

    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('foo');
    const button = screen.getByRole('button', { name: /show password/i });

    expect(input).toHaveAttribute('type', 'password');

    await user.click(button);

    expect(input).toHaveAttribute('type', 'text');

    await user.click(button);

    expect(input).toHaveAttribute('type', 'password');
  });
});
