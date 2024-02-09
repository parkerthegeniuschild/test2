import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { mock, server } from '@/mocks';
import { render, screen, within } from '@/tests/helpers';

import { Container } from './Container';

describe('<Jobs.Container />', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('should render fields correctly', async () => {
    render(<Container />);

    expect(
      await screen.findByRole('cell', { name: '4092' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: /first class transport/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/^pending review$/i)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /travis scott/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /bobby brown/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /kyle hatcher/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: /st\. louis, mo/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$365.00' })).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'Sep 11, 2022' })
    ).toBeInTheDocument();
    expect(screen.getByText('(123) 456-7890')).toBeInTheDocument();
    expect(screen.getByText('(098) 765-4321')).toBeInTheDocument();
    expect(screen.getByText('(111) 111-1111')).toBeInTheDocument();
    expect(screen.getByText(/online/i)).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('1-15 of 18')).toBeInTheDocument();
  });

  it('should render the empty message if no jobs were found', async () => {
    server.use(
      rest.get(mock.jobs.url, (req, res, ctx) =>
        res(ctx.status(200), ctx.json(mock.jobs.data.empty))
      )
    );

    render(<Container />);

    expect(
      await screen.findByRole('cell', { name: /no jobs found/i })
    ).toBeInTheDocument();
  });

  it('should render the error message if the API returned an error', async () => {
    server.use(
      rest.get(mock.jobs.url, (req, res, ctx) =>
        res(ctx.status(500), ctx.json({}))
      )
    );

    render(<Container />);

    expect(
      await screen.findByText(/some error occurred while fetching jobs/i)
    ).toBeInTheDocument();
  });

  it('should start with the `open` tab attributes selected by default', () => {
    render(<Container />);

    expect(screen.getByRole('tab', { name: /open/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(
      screen.getByRole('button', { name: /status: completed and 7 more/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /pending review: yes/i })
    ).toBeInTheDocument();
  });

  it('should change to `all` tab correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const allTab = screen.getByRole('tab', { name: /all/i });
    await user.click(allTab);

    expect(allTab).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('button', { name: /status: completed and 7 more/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^pending review$/i })
    ).toBeInTheDocument();
  });

  it('should change to `closed` tab correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const closedTab = screen.getByRole('tab', { name: /closed/i });
    await user.click(closedTab);

    expect(closedTab).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('button', { name: /status: completed and 1 more/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /pending review: no/i })
    ).toBeInTheDocument();
  });

  it('should change to `unpaid` tab correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const unpaidTab = screen.getByRole('tab', { name: /unpaid/i });
    await user.click(unpaidTab);

    expect(unpaidTab).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('button', { name: /^status: completed$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^pending review$/i })
    ).toBeInTheDocument();
  });

  it('should access `open` tab via filters', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const statusFilterButton = screen.getByRole('button', {
      name: /status: completed and 7 more/i,
    });
    const pendingReviewFilterButton = screen.getByRole('button', {
      name: /pending review: yes/i,
    });

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    screen.getAllByRole('tab').forEach(tab => {
      expect(tab).not.toHaveAttribute('aria-selected', 'true');
    });

    await user.click(statusFilterButton);

    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /unassigned/i })
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /notifying/i })
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /on the way/i })
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /in progress/i })
    );
    await user.click(screen.getByRole('menuitemcheckbox', { name: /paused/i }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: /manual/i }));
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /completed/i })
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /canceled/i })
    );
    await user.click(screen.getByRole('button', { name: /apply/i }));

    await user.click(pendingReviewFilterButton);
    await user.click(screen.getByRole('menuitemcheckbox', { name: /yes/i }));
    await user.click(screen.getAllByRole('button', { name: /apply/i })[1]);

    expect(screen.getByRole('tab', { name: /open/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('should access `all` tab via filters', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const statusFilterButton = screen.getByRole('button', {
      name: /status: completed and 7 more/i,
    });

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    screen.getAllByRole('tab').forEach(tab => {
      expect(tab).not.toHaveAttribute('aria-selected', 'true');
    });

    await user.click(statusFilterButton);

    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /unassigned/i })
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /notifying/i })
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /on the way/i })
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /in progress/i })
    );
    await user.click(screen.getByRole('menuitemcheckbox', { name: /paused/i }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: /manual/i }));
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /completed/i })
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /canceled/i })
    );
    await user.click(screen.getByRole('button', { name: /apply/i }));

    expect(screen.getByRole('tab', { name: /all/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('should access `closed` tab via filters', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const statusFilterButton = screen.getByRole('button', {
      name: /status: completed and 7 more/i,
    });
    const pendingReviewFilterButton = screen.getByRole('button', {
      name: /pending review: yes/i,
    });

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    screen.getAllByRole('tab').forEach(tab => {
      expect(tab).not.toHaveAttribute('aria-selected', 'true');
    });

    await user.click(statusFilterButton);

    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /completed/i })
    );
    await user.click(
      screen.getByRole('menuitemcheckbox', { name: /canceled/i })
    );
    await user.click(screen.getByRole('button', { name: /apply/i }));

    await user.click(pendingReviewFilterButton);
    await user.click(screen.getByRole('menuitemcheckbox', { name: /^no$/i }));
    await user.click(screen.getAllByRole('button', { name: /apply/i })[1]);

    expect(screen.getByRole('tab', { name: /closed/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('should clear individual filters correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const statusFilterButton = screen.getByRole('button', {
      name: /status: completed and 7 more/i,
    });
    expect(statusFilterButton).toBeInTheDocument();

    await user.click(within(statusFilterButton).getByTitle(/clear filter/i));
    expect(statusFilterButton).toHaveTextContent(/^status$/i);

    const pendingReviewFilterButton = screen.getByRole('button', {
      name: /pending review: yes/i,
    });
    expect(pendingReviewFilterButton).toBeInTheDocument();

    await user.click(
      within(pendingReviewFilterButton).getByTitle(/clear filter/i)
    );
    expect(pendingReviewFilterButton).toHaveTextContent(/^pending review$/i);
  });

  it('should clear filters correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const statusFilterButton = screen.getByRole('button', {
      name: /status: completed and 7 more/i,
    });
    expect(statusFilterButton).toBeInTheDocument();

    const pendingReviewFilterButton = screen.getByRole('button', {
      name: /pending review: yes/i,
    });
    expect(pendingReviewFilterButton).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(statusFilterButton).toHaveTextContent(/^status$/i);
    expect(pendingReviewFilterButton).toHaveTextContent(/^pending review$/i);
  });

  it('should toggle columns correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const priceColumn = screen.getByRole('columnheader', { name: /price/i });

    expect(priceColumn).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /price/i }));
    await user.click(screen.getByRole('menuitem', { name: /hide column/i }));

    expect(priceColumn).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /columns/i }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: /price/i }));

    expect(
      screen.getByRole('columnheader', { name: /price/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('menuitemcheckbox', { name: /price/i }));

    expect(
      screen.queryByRole('columnheader', { name: /price/i })
    ).not.toBeInTheDocument();
  });

  it('should sort columns correctly', async () => {
    render(<Container />);

    const user = userEvent.setup();

    const jobIdColumn = screen.getByRole('columnheader', { name: /job #/i });
    expect(jobIdColumn).toHaveAttribute('aria-sort', 'none');

    const jobIdColumnButton = screen.getByRole('button', { name: /job #/i });

    await user.click(jobIdColumnButton);
    await user.click(screen.getByRole('menuitem', { name: /sort 0-9/i }));

    expect(jobIdColumn).toHaveAttribute('aria-sort', 'ascending');

    await user.click(jobIdColumnButton);
    await user.click(screen.getByRole('menuitem', { name: /sort 9-0/i }));

    expect(jobIdColumn).toHaveAttribute('aria-sort', 'descending');

    await user.click(jobIdColumnButton);
    await user.click(screen.getByRole('menuitem', { name: /clear sort/i }));

    expect(jobIdColumn).toHaveAttribute('aria-sort', 'none');
  });
});
