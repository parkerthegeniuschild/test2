import { styled } from '@/styled-system/jsx';

const Wrapper = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
});

const Separator = styled('span', {
  base: {
    width: '2px',
    height: '2px',
    rounded: 'full',
    bgColor: 'gray.400',
  },
});

const Container = styled('p', {
  base: {
    fontSize: 'xs',
    lineHeight: 1,
    fontWeight: 'medium',
  },
  variants: {
    userRole: {
      dispatcher: { color: 'blue' },
      driver: { color: 'primary.400' },
      provider: { color: 'gray.300' },
    },
  },
});

type ContainerProps = React.ComponentPropsWithoutRef<typeof Container>;

type Role = Exclude<ContainerProps['userRole'], undefined>;

type UserCardRoleProps = Omit<ContainerProps, 'children' | 'userRole'> & {
  userRole: Role | Role[];
};

export function UserCardRole({ userRole, ...props }: UserCardRoleProps) {
  if (typeof userRole === 'string') {
    return (
      <Container userRole={userRole} {...props}>
        {userRole[0].toUpperCase() + userRole.slice(1)}
      </Container>
    );
  }

  return (
    <Wrapper>
      {userRole.map((role, index) => (
        <>
          {index > 0 && <Separator aria-hidden />}

          <Container key={role} userRole={role} {...props}>
            {role[0].toUpperCase() + role.slice(1)}
          </Container>
        </>
      ))}
    </Wrapper>
  );
}
