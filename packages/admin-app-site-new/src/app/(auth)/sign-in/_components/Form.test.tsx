import userEvent from '@testing-library/user-event';
import type { Mock } from 'vitest';

import { render, screen } from '@/tests/helpers';

import { useSignIn } from '../_api/useSignIn';

import { Form } from './Form';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock('../_api/useSignIn', () => ({
  useSignIn: vi.fn(() => ({
    mutate: vi.fn(),
    isError: false,
  })),
}));

describe('<SignIn.Form />', () => {
  it('should render correctly', () => {
    render(<Form />);

    expect(
      screen.getByRole('textbox', { name: /username/i })
    ).toBeInTheDocument();
  });

  it('should validate the form correctly', async () => {
    render(<Form />);

    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.click(submitButton);

    const usernameErrorMessage = screen.getByText(/please enter a username/i);
    const passwordErrorMessage = screen.getByText(/please enter a password/i);

    expect(usernameErrorMessage).toBeInTheDocument();
    expect(passwordErrorMessage).toBeInTheDocument();

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, 'foo');
    await user.type(passwordInput, 'bar');

    await user.click(submitButton);

    expect(usernameErrorMessage).not.toBeInTheDocument();
    expect(passwordErrorMessage).not.toBeInTheDocument();
  });

  it('should show the error message if request failed', () => {
    (useSignIn as Mock).mockReturnValueOnce({ isError: true });

    render(<Form />);

    expect(
      screen.getByText(/you entered an incorrect username or password/i)
    ).toBeInTheDocument();
  });
});
