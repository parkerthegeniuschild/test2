'use client';

import { useReducer } from 'react';
import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { match } from 'ts-pattern';

import { TopLoader } from '@/app/_components/TopLoader';
import { Icon, Sidebar } from '@/components';
import { Box } from '@/styled-system/jsx';

import { DEFAULT_PAGE_SIZE } from './_constants';
import { setServerCookie } from './_hooks';

type SidebarItemProps = React.ComponentProps<typeof Sidebar.Item> & {
  href: LinkProps['href'];
};

function SidebarLink({ href, ...props }: SidebarItemProps) {
  const pathname = usePathname();

  const isActive = match(typeof href === 'string' ? href : href.pathname)
    .with('/', _href => _href === pathname)
    .otherwise(_href => pathname.startsWith(_href ?? ''));

  return (
    <Sidebar.Item
      active={isActive}
      render={<Link href={href} prefetch={false} />}
      {...props}
    />
  );
}

type ContainerProps = {
  children: React.ReactNode;
  initialOpen?: boolean;
  initialPageSize?: string;
};

export function Container({
  children,
  initialOpen,
  initialPageSize,
}: ContainerProps) {
  const [open, toggleOpen] = useReducer(state => !state, !!initialOpen);

  const searchParams = useSearchParams();

  const pageSize =
    searchParams.get('size') ?? initialPageSize ?? DEFAULT_PAGE_SIZE;

  function handleHamburgerClick() {
    toggleOpen();
    setServerCookie('sidebar-open', !open);
  }

  function handleSignOut() {
    TopLoader.start();
    void signOut({ callbackUrl: '/sign-in' });
  }

  return (
    <>
      <Sidebar css={{ position: 'absolute' }} open={open}>
        <Sidebar.Header onHamburgerClick={handleHamburgerClick}>
          <Image
            src="/assets/truckup_logo_dark.svg"
            alt="Truckup"
            width={108}
            height={16}
            priority
          />
        </Sidebar.Header>

        <Sidebar.Body>
          <SidebarLink
            leftSlot={<Icon.Tool />}
            href={{ pathname: '/jobs', query: { size: pageSize } }}
          >
            Jobs
          </SidebarLink>
          <SidebarLink
            leftSlot={<Icon.Hand />}
            href={{ pathname: '/providers', query: { size: pageSize } }}
          >
            Providers
          </SidebarLink>
        </Sidebar.Body>

        <Sidebar.Footer>
          <Sidebar.Profile username="Truckup Admin" userHandle="admin">
            {/* <Sidebar.Profile.Item>
              <Icon.Edit
                className={css({ color: 'gray.500', fontSize: 'md' })}
              />
              Edit profile
            </Sidebar.Profile.Item> */}
            <Sidebar.Profile.Item
              css={{ color: 'danger' }}
              onClick={handleSignOut}
            >
              <Icon.Logout />
              Sign out
            </Sidebar.Profile.Item>
          </Sidebar.Profile>
        </Sidebar.Footer>
      </Sidebar>

      <Box
        css={{
          pl: open ? '17.5rem' : '3.5rem',
          flex: 1,
          transition: 'padding token(durations.fast) ease-in-out',
          position: 'relative',
          maxWidth: '100%',
        }}
      >
        {children}
      </Box>
    </>
  );
}
