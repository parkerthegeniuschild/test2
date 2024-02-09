import userEvent from '@testing-library/user-event';

import { render, screen } from '@/tests/helpers';

import { CashBalanceFilter } from './CashBalanceFilter';

describe('<Providers.CashBalanceFilter />', () => {
  it('should render correctly', () => {
    render(
      <CashBalanceFilter initialValue={{ operator: 'eq', values: [''] }} />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should toggle fields amount correctly', async () => {
    render(
      <CashBalanceFilter initialValue={{ operator: 'eq', values: [''] }} />
    );

    const user = userEvent.setup();

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    const cashBalanceSelect = screen.getByRole('combobox');
    await user.click(cashBalanceSelect);

    await user.click(screen.getByRole('option', { name: /is between/i }));

    expect(screen.getAllByRole('textbox')).toHaveLength(2);

    await user.click(cashBalanceSelect);
    await user.click(screen.getByRole('option', { name: /is more than/i }));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should allow submitting empty fields', async () => {
    const onSubmitFn = vi.fn();

    render(
      <CashBalanceFilter
        initialValue={{ operator: 'eq', values: [''] }}
        onSubmit={onSubmitFn}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(onSubmitFn).toHaveBeenCalledWith({
      operator: 'eq',
      values: [''],
    });
  });

  it('should submit correctly', async () => {
    const onSubmitFn = vi.fn();

    render(
      <CashBalanceFilter
        initialValue={{ operator: 'eq', values: [''] }}
        onSubmit={onSubmitFn}
      />
    );

    const user = userEvent.setup();

    const cashBalanceSelect = screen.getByRole('combobox');
    await user.click(cashBalanceSelect);

    await user.click(screen.getByRole('option', { name: /is between/i }));

    const [minField, maxField] = screen.getAllByRole('textbox');

    await user.type(minField, '5');
    await user.type(maxField, '10');

    await userEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(onSubmitFn).toHaveBeenCalledWith({
      operator: 'between',
      values: ['5', '10'],
    });
  });

  it('should validate invalid numbers', async () => {
    render(
      <CashBalanceFilter initialValue={{ operator: 'eq', values: [''] }} />
    );

    const user = userEvent.setup();

    const textField = screen.getByRole('textbox');

    await user.type(textField, 'abc');

    await userEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(screen.getByText(/invalid number/i)).toBeInTheDocument();
  });

  it('should turn the other field required when on between operation and one field is filled', async () => {
    render(
      <CashBalanceFilter
        initialValue={{ operator: 'between', values: ['', ''] }}
      />
    );

    const user = userEvent.setup();

    const [minField] = screen.getAllByRole('textbox');

    await user.type(minField, '5');

    await userEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(screen.getByText(/required field/i)).toBeInTheDocument();
  });

  it('should not allow values over the range when on between operation', async () => {
    render(
      <CashBalanceFilter
        initialValue={{ operator: 'between', values: ['', ''] }}
      />
    );

    const user = userEvent.setup();

    const [minField, maxField] = screen.getAllByRole('textbox');

    await user.type(minField, '10');
    await user.type(maxField, '5');

    await userEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(screen.getByText(/out of range/i)).toBeInTheDocument();
  });
});
