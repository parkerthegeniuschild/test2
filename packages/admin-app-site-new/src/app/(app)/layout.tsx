import { cookies } from 'next/headers';

import { Flex } from '@/styled-system/jsx';

import { Container } from './container';

export default function AppLayout({ children }: React.PropsWithChildren) {
  const serverCookies = cookies();

  const sidebarOpenCookieValue = serverCookies.get('sidebar-open')?.value;
  const isSidebarOpen = sidebarOpenCookieValue
    ? sidebarOpenCookieValue === 'true'
    : true;

  const pageSize = serverCookies.get('page-size')?.value;

  return (
    <Flex css={{ minH: '100vh' }}>
      <Container initialOpen={isSidebarOpen} initialPageSize={pageSize}>
        {children}
      </Container>
    </Flex>
  );
}
