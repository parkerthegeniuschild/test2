import { match, P } from 'ts-pattern';

import { Flex, styled } from '@/styled-system/jsx';

const StepContainer = styled('span', {
  base: {
    width: 5,
    height: 5,
    rounded: 'full',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2xs.xl',
    fontWeight: 'semibold',
    lineHeight: '1.25rem',
    userSelect: 'none',
  },
  variants: {
    status: {
      done: { bgColor: 'primary.700' },
      active: { bgColor: 'primary' },
      pending: { bgColor: 'gray.400' },
    },
  },
});

type StepStatus = 'active' | 'done' | 'pending';

type StepProps = {
  status: StepStatus;
};

function Step({ status, children }: React.PropsWithChildren<StepProps>) {
  return (
    <StepContainer status={status}>
      {status === 'done' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="none"
          viewBox="0 0 12 12"
        >
          <path
            fill="currentColor"
            d="M10.53 3.53a.75.75 0 10-1.06-1.06L4.5 7.44 2.53 5.47a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5.5-5.5z"
          />
        </svg>
      ) : (
        children
      )}
    </StepContainer>
  );
}

type StepperProps = {
  activeStep: number;
};

export function Stepper({ activeStep }: StepperProps) {
  return (
    <Flex
      bgColor="rgba(1, 2, 3, 0.04)"
      w="fit"
      p={0.75}
      rounded="1.625rem"
      gap={5}
    >
      <Step status={activeStep > 1 ? 'done' : 'active'}>1</Step>
      <Step
        status={match(activeStep)
          .returnType<StepStatus>()
          .with(P.number.lt(2), () => 'pending')
          .with(P.number.gt(2), () => 'done')
          .otherwise(() => 'active')}
      >
        2
      </Step>
      <Step status={activeStep < 3 ? 'pending' : 'active'}>3</Step>
    </Flex>
  );
}
