import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NumberInput } from './NumberInput';

describe('<NumberInput />', () => {
  it('should render correctly', () => {
    render(<NumberInput placeholder="foo" />);

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('foo')).toBeInTheDocument();
  });

  it("shouldn't allow non-numeric characters", async () => {
    render(<NumberInput />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, 'abc');

    expect(input).toHaveValue('');

    await user.type(input, '33');

    expect(input).toHaveValue('33');
  });

  it('should reset field if the user put only a `-`', async () => {
    render(<NumberInput />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '-');
    await user.tab();

    expect(input).toHaveValue('');
  });

  it('should increment on `ArrowUp`', async () => {
    render(<NumberInput />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '{arrowup}');
    expect(input).toHaveValue('1');

    await user.type(input, '{arrowup}');
    expect(input).toHaveValue('2');
  });

  it('should decrement on `ArrowDown`', async () => {
    render(<NumberInput />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '{arrowdown}');
    expect(input).toHaveValue('-1');

    await user.type(input, '{arrowdown}');
    expect(input).toHaveValue('-2');
  });

  it('should put value `0` if the user tries to bump a `-` value', async () => {
    render(<NumberInput />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '-');
    await user.type(input, '{arrowup}');
    expect(input).toHaveValue('0');
  });

  it('should put value `0` if the user tries to decrease a `-` value', async () => {
    render(<NumberInput />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '-');
    await user.type(input, '{arrowdown}');
    expect(input).toHaveValue('0');
  });

  it('should not be able to decrease the value if it is already the minimum', async () => {
    render(<NumberInput min={-1} />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '{arrowdown}');
    await user.type(input, '{arrowdown}');
    await user.type(input, '{arrowdown}');
    await user.type(input, '{arrowdown}');
    await user.type(input, '{arrowdown}');
    expect(input).toHaveValue('-1');
  });

  it('should return to the minimum value on blur if the user typed a value lower than the minimum', async () => {
    render(<NumberInput min={-1} />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '-2');
    await user.tab();
    expect(input).toHaveValue('-1');
  });

  it('should put the minimum value if the user put a `-` value', async () => {
    render(<NumberInput min={-5} />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '-');
    await user.tab();
    expect(input).toHaveValue('-5');
  });

  it('should return to the minimum if the user put a value less than minimum and tries to bump it', async () => {
    render(<NumberInput min={10} />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '5');
    await user.type(input, '{arrowup}');
    expect(input).toHaveValue('10');
  });

  it('should return to the minimum if the user put a value less than minimum and tries to decrease it', async () => {
    render(<NumberInput min={10} />);

    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');

    await user.type(input, '5');
    await user.type(input, '{arrowdown}');
    expect(input).toHaveValue('10');
  });
});
