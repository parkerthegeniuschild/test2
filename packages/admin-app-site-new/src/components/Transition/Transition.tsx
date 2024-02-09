'use client';

import * as Ariakit from '@ariakit/react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';

import { styled } from '@/styled-system/jsx';

const TRANSITION_EASINGS = {
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
} as const;

const DisclosureContent = styled(Ariakit.DisclosureContent, {
  base: { display: 'block' },
});

interface TransitionProps
  extends React.ComponentPropsWithoutRef<typeof DisclosureContent> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: Ariakit.DisclosureProps['render'];
  placement?: 'top' | 'bottom';
}

function Collapse({
  open,
  children,
  trigger,
  placement = 'bottom',
  onOpenChange,
  ...props
}: React.PropsWithChildren<TransitionProps>) {
  const disclosureStore = Ariakit.useDisclosureStore({
    open,
    setOpen: onOpenChange,
  });

  const mounted = disclosureStore.useState('mounted');

  return (
    <MotionConfig reducedMotion="user">
      <Ariakit.DisclosureProvider store={disclosureStore}>
        {placement === 'bottom' && !!trigger && (
          <Ariakit.Disclosure render={trigger} />
        )}

        <AnimatePresence>
          {mounted && (
            <DisclosureContent
              alwaysVisible
              overflow="hidden"
              render={
                <motion.div
                  initial="exit"
                  animate="enter"
                  exit="exit"
                  variants={{
                    enter: {
                      opacity: 1,
                      height: 'auto',
                      transition: {
                        height: {
                          duration: 0.3,
                          ease: TRANSITION_EASINGS.ease,
                        },
                        opacity: {
                          duration: 0.4,
                          ease: TRANSITION_EASINGS.ease,
                        },
                      },
                    },
                    exit: {
                      opacity: 0,
                      height: 0,
                      transition: {
                        height: {
                          duration: 0.2,
                          ease: TRANSITION_EASINGS.ease,
                        },
                        opacity: {
                          duration: 0.3,
                          ease: TRANSITION_EASINGS.ease,
                        },
                      },
                    },
                  }}
                />
              }
              {...props}
            >
              {children}
            </DisclosureContent>
          )}
        </AnimatePresence>

        {placement === 'top' && !!trigger && (
          <Ariakit.Disclosure render={trigger} />
        )}
      </Ariakit.DisclosureProvider>
    </MotionConfig>
  );
}

function Fade({
  open,
  children,
  trigger,
  placement = 'bottom',
  onOpenChange,
  ...props
}: React.PropsWithChildren<TransitionProps>) {
  const disclosureStore = Ariakit.useDisclosureStore({
    open,
    setOpen: onOpenChange,
  });

  const mounted = disclosureStore.useState('mounted');

  return (
    <MotionConfig reducedMotion="user">
      <Ariakit.DisclosureProvider store={disclosureStore}>
        {placement === 'bottom' && !!trigger && (
          <Ariakit.Disclosure render={trigger} />
        )}

        <AnimatePresence>
          {mounted && (
            <DisclosureContent
              alwaysVisible
              render={
                <motion.div
                  initial="exit"
                  animate="enter"
                  exit="exit"
                  variants={{
                    enter: {
                      opacity: 1,
                      transition: {
                        duration: 0.2,
                        ease: TRANSITION_EASINGS.easeOut,
                      },
                    },
                    exit: {
                      opacity: 0,
                      transition: {
                        duration: 0.1,
                        ease: TRANSITION_EASINGS.easeIn,
                      },
                    },
                  }}
                />
              }
              {...props}
            >
              {children}
            </DisclosureContent>
          )}
        </AnimatePresence>

        {placement === 'top' && !!trigger && (
          <Ariakit.Disclosure render={trigger} />
        )}
      </Ariakit.DisclosureProvider>
    </MotionConfig>
  );
}

export const Transition = {
  Collapse,
  Fade,
};
