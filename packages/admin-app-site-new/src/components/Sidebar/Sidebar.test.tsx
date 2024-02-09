import { render, screen } from '@testing-library/react';

import { Sidebar } from './Sidebar';

describe('<Sidebar />', () => {
  it('should render correctly', () => {
    render(
      <Sidebar>
        <Sidebar.Item>Test</Sidebar.Item>
      </Sidebar>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test/i })).toBeInTheDocument();
  });

  it('should start opened', () => {
    render(
      <Sidebar>
        <Sidebar.Header>
          <div data-testid="sample-logo" />
        </Sidebar.Header>
        <Sidebar.Item>Test</Sidebar.Item>
      </Sidebar>
    );

    const sidebarItem = screen.getByRole('button', { name: /test/i });
    expect(sidebarItem).toHaveTextContent(/test/i);

    expect(screen.getByTestId('sample-logo')).toBeInTheDocument();
  });

  it('should hide content when closed', () => {
    render(
      <Sidebar open={false}>
        <Sidebar.Header>
          <div data-testid="sample-logo" />
        </Sidebar.Header>
        <Sidebar.Item leftSlot={<div data-testid="sample-icon" />}>
          Test
        </Sidebar.Item>
      </Sidebar>
    );

    const sidebarItem = screen.getByRole('button', { name: /test/i });
    expect(sidebarItem).not.toHaveTextContent(/test/i);

    expect(screen.getByTestId('sample-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sample-logo')).not.toBeInTheDocument();
  });
});
