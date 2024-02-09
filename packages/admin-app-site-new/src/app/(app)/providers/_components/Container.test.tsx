import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { mock, server } from '@/mocks';
import { act, render, screen } from '@/tests/helpers';

import { Container } from './Container';

describe('<Providers.Container />', () => {
  afterEach(() => {
    // reset query params
    window.history.pushState({}, '', '/');
  });

  it('should render fields correctly', async () => {
    render(<Container />);

    expect(
      await screen.findByRole('cell', { name: /john doe/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: '(123) 456-7890' })
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '100%' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$1,000.00' })).toBeInTheDocument();
  });

  it('should render the empty message if no providers were found', async () => {
    server.use(
      rest.get(mock.providers.url, (req, res, ctx) =>
        res(ctx.status(200), ctx.json(mock.providers.data.empty))
      )
    );

    render(<Container />);

    expect(
      await screen.findByRole('cell', { name: /no providers found/i })
    ).toBeInTheDocument();
  });

  it('should render the error message if the API returned an error', async () => {
    server.use(
      rest.get(mock.providers.url, (req, res, ctx) =>
        res(ctx.status(500), ctx.json({}))
      )
    );

    render(<Container />);

    expect(
      await screen.findByText(/some error occurred while fetching providers/i)
    ).toBeInTheDocument();
  });

  it('should render correct page metadata', async () => {
    render(<Container />);

    expect(await screen.findByText('1-15 of 33')).toBeInTheDocument();
  });

  it('should update query params when sort is changed', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const nameSortButton = screen.getByRole('button', { name: /name/i });
    await user.click(nameSortButton);

    const sortAscMenuItem = screen.getByRole('menuitem', { name: /sort a-z/i });
    await user.click(sortAscMenuItem);

    expect(window.location.search).toBe('?order=firstname-asc');

    await user.click(nameSortButton);
    await user.click(sortAscMenuItem);

    expect(window.location.search).toBe('');

    await user.click(nameSortButton);
    await user.click(screen.getByRole('menuitem', { name: /sort z-a/i }));

    expect(window.location.search).toBe('?order=firstname-desc');

    await user.click(nameSortButton);
    await user.click(screen.getByRole('menuitem', { name: /clear sort/i }));

    expect(window.location.search).toBe('');
  });

  it('should update query params when page size is changed', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const pageSizeCombobox = await screen.findByRole('combobox', {
      name: /entries per page/i,
    });
    await user.click(pageSizeCombobox);

    const option50 = screen.getByRole('option', { name: '50' });
    await user.click(option50);

    expect(window.location.search).toBe('?size=50');
  });

  it('should update query params when current page is changed', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const secondPageButton = await screen.findByRole('button', {
      name: /page 2/i,
    });
    await user.click(secondPageButton);

    expect(window.location.search).toBe('?page=2');
  });

  it('should update query params when search filter is changed', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const searchTextField = screen.getByPlaceholderText(/search/i);
    await user.type(searchTextField, 'testing');

    await act(() => new Promise(resolve => setTimeout(resolve, 300)));

    expect(window.location.search).toBe('?search=testing');
  });

  it('should clear search filter when clear button clicked', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const searchTextField = screen.getByPlaceholderText(/search/i);
    await user.type(searchTextField, 'testing');

    await act(() => new Promise(resolve => setTimeout(resolve, 300)));

    expect(window.location.search).toBe('?search=testing');

    const clearInputButton = screen.getByRole('button', {
      name: /clear input/i,
    });
    await user.click(clearInputButton);

    expect(searchTextField).toHaveValue('');

    await act(() => new Promise(resolve => setTimeout(resolve, 300)));

    expect(window.location.search).toBe('');
  });

  it('should update query params when cash balance is changed', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const [cashBalanceButton] = screen.getAllByRole('button', {
      name: /cash balance/i,
    });
    await user.click(cashBalanceButton);

    const balanceTextField = screen.getByPlaceholderText('0.00');
    await user.type(balanceTextField, '5{Enter}');

    expect(cashBalanceButton).toHaveTextContent(
      /cash balance: exactly \$5\.00/i
    );
    expect(window.location.search).toBe('?balance=operator-eq__values-5');
  });

  it('should clear cash balancer filter correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const [cashBalanceButton] = screen.getAllByRole('button', {
      name: /cash balance/i,
    });
    await user.click(cashBalanceButton);

    const balanceTextField = screen.getByPlaceholderText('0.00');
    await user.type(balanceTextField, '5{Enter}');

    expect(cashBalanceButton).toHaveTextContent(
      /cash balance: exactly \$5\.00/i
    );
    expect(window.location.search).toBe('?balance=operator-eq__values-5');

    await user.click(screen.getByTitle(/clear filter/i));

    expect(cashBalanceButton).toHaveTextContent(/^cash balance$/i);
    expect(window.location.search).toBe('');
  });

  it('should clear filters correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const [cashBalanceButton] = screen.getAllByRole('button', {
      name: /cash balance/i,
    });
    await user.click(cashBalanceButton);

    const balanceTextField = screen.getByPlaceholderText('0.00');
    await user.type(balanceTextField, '5{Enter}');

    expect(cashBalanceButton).toHaveTextContent(
      /cash balance: exactly \$5\.00/i
    );
    expect(window.location.search).toBe('?balance=operator-eq__values-5');

    const clearFiltersButton = screen.getByRole('button', {
      name: /clear filters/i,
    });
    await user.click(clearFiltersButton);

    expect(cashBalanceButton).toHaveTextContent(/^cash balance$/i);
    expect(window.location.search).toBe('');
  });

  it('should toggle columns correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const acceptRateColumn = screen.getByRole('columnheader', {
      name: /accept rate/i,
    });

    expect(acceptRateColumn).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /accept rate/i }));
    await user.click(screen.getByRole('menuitem', { name: /hide column/i }));

    expect(acceptRateColumn).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /columns/i }));
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /accept rate/i })
    );

    expect(
      screen.getByRole('columnheader', {
        name: /accept rate/i,
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /accept rate/i })
    );

    expect(
      screen.queryByRole('columnheader', {
        name: /accept rate/i,
      })
    ).not.toBeInTheDocument();
  });
});
