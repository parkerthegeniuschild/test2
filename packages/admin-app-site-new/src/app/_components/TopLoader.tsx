'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as NProgress from 'nprogress';

// Based on https://github.com/TheSGJ/nextjs-toploader
type NextTopLoaderProps = {
  /**
   * Color for the TopLoader.
   * @default "var(--colors-primary)"
   */
  color?: string;
  /**
   * The initial position for the TopLoader in percentage, 0.08 is 8%.
   * @default 0.08
   */
  initialPosition?: number;
  /**
   * The increament delay speed in milliseconds.
   * @default 200
   */
  crawlSpeed?: number;
  /**
   * The height for the TopLoader in pixels (px).
   * @default 3
   */
  height?: number;
  /**
   * Auto incrementing behavior for the TopLoader.
   * @default true
   */
  crawl?: boolean;
  /**
   * To show spinner or not.
   * @default true
   */
  showSpinner?: boolean;
  /**
   * Animation settings using easing (a CSS easing string).
   * @default "ease"
   */
  easing?: string;
  /**
   * Animation speed in ms for the TopLoader.
   * @default 200
   */
  speed?: number;
  /**
   * Defines a shadow for the TopLoader.
   * @default "0 0 10px ${color},0 0 5px ${color}"
   *
   * @ you can disable it by setting it to `false`
   */
  shadow?: string | false;
  /**
   * Minimum duration in ms until the TopLoader starts showing.
   * @default 200
   */
  delay?: number;
};

const DEFAULT_COLOR = 'var(--colors-primary)';
const DEFAULT_HEIGHT = 3;

const START_PROGRESS_BAR_EVENT_KEY = 'startProgressBar';
const START_PROGRESS_BAR_EVENT = new Event(START_PROGRESS_BAR_EVENT_KEY);

const STOP_PROGRESS_BAR_EVENT_KEY = 'stopProgressBar';
const STOP_PROGRESS_BAR_EVENT = new Event(STOP_PROGRESS_BAR_EVENT_KEY);

export function TopLoader({
  color = DEFAULT_COLOR,
  height = DEFAULT_HEIGHT,
  showSpinner,
  crawl,
  crawlSpeed,
  initialPosition,
  easing,
  speed,
  shadow,
  delay = 200,
}: NextTopLoaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Any falsy (except undefined) will disable the shadow
  const boxShadow =
    // eslint-disable-next-line no-nested-ternary
    !shadow && shadow !== undefined
      ? ''
      : shadow
      ? `box-shadow:${shadow}`
      : `box-shadow:0 0 10px ${color},0 0 5px ${color}`;

  useEffect(() => {
    let progressBarTimeout: NodeJS.Timeout | undefined;

    NProgress.configure({
      showSpinner: showSpinner ?? true,
      trickle: crawl ?? true,
      trickleSpeed: crawlSpeed ?? 200,
      minimum: initialPosition ?? 0.08,
      easing: easing ?? 'ease',
      speed: speed ?? 200,
    });

    function startProgressBar() {
      clearTimeout(progressBarTimeout);
      progressBarTimeout = setTimeout(NProgress.start, delay);
    }

    function stopProgressBar() {
      clearTimeout(progressBarTimeout);
      NProgress.done();
    }

    function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string) {
      const currentUrlObj = new URL(currentUrl);
      const newUrlObj = new URL(newUrl);
      // Compare hostname, pathname, and search parameters
      if (
        currentUrlObj.hostname === newUrlObj.hostname &&
        currentUrlObj.pathname === newUrlObj.pathname &&
        currentUrlObj.search === newUrlObj.search
      ) {
        // Check if the new URL is just an anchor of the current URL page
        const currentHash = currentUrlObj.hash;
        const newHash = newUrlObj.hash;
        return (
          currentHash !== newHash &&
          currentUrlObj.href.replace(currentHash, '') ===
            newUrlObj.href.replace(newHash, '')
        );
      }
      return false;
    }

    const npgclass = document.querySelectorAll('html');

    function findClosestAnchor(
      element: HTMLElement | null
    ): HTMLAnchorElement | null {
      let currentElement = element;

      while (currentElement && currentElement.tagName.toLowerCase() !== 'a') {
        currentElement = currentElement.parentElement;
      }

      return currentElement as HTMLAnchorElement;
    }

    function handleClick(event: MouseEvent) {
      try {
        const target = event.target as HTMLElement;
        const anchor = findClosestAnchor(target);

        if (!anchor) {
          return;
        }

        const isValidHref =
          anchor.getAttribute('href')?.startsWith('/') ||
          anchor.getAttribute('href')?.startsWith('http');

        if (!isValidHref) {
          return;
        }

        const currentUrl = window.location.href;
        const newUrl = (anchor as HTMLAnchorElement).href;
        const isExternalLink =
          (anchor as HTMLAnchorElement).target === '_blank';
        const isAnchor = isAnchorOfCurrentUrl(currentUrl, newUrl);

        if (newUrl === currentUrl || isAnchor || isExternalLink) {
          startProgressBar();
          stopProgressBar();
          [].forEach.call(npgclass, (el: Element) => {
            el.classList.remove('nprogress-busy');
          });
          return;
        }

        startProgressBar();

        (history => {
          const { pushState } = history;

          // eslint-disable-next-line no-param-reassign
          history.pushState = function pushStateFn() {
            stopProgressBar();

            [].forEach.call(npgclass, (el: Element) => {
              el.classList.remove('nprogress-busy');
            });

            return pushState.apply(
              history,
              // eslint-disable-next-line prefer-rest-params
              arguments as unknown as Parameters<typeof pushState>
            );
          };
        })(window.history);
      } catch (err) {
        startProgressBar();
        stopProgressBar();
      }
    }

    (history => {
      const { replaceState } = history;

      // eslint-disable-next-line no-param-reassign
      history.replaceState = function replaceStateFn() {
        stopProgressBar();

        [].forEach.call(npgclass, (el: Element) => {
          el.classList.remove('nprogress-busy');
        });

        return replaceState.apply(
          history,
          // eslint-disable-next-line prefer-rest-params
          arguments as unknown as Parameters<typeof replaceState>
        );
      };
    })(window.history);

    document.addEventListener('click', handleClick);
    window.addEventListener(START_PROGRESS_BAR_EVENT_KEY, startProgressBar);
    window.addEventListener(STOP_PROGRESS_BAR_EVENT_KEY, stopProgressBar);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener(
        START_PROGRESS_BAR_EVENT_KEY,
        startProgressBar
      );
      window.removeEventListener(STOP_PROGRESS_BAR_EVENT_KEY, stopProgressBar);
    };
  }, [crawl, crawlSpeed, delay, easing, initialPosition, showSpinner, speed]);

  useEffect(() => {
    // Making sure the progress bar is stopped when the URL changes
    window.dispatchEvent(STOP_PROGRESS_BAR_EVENT);
  }, [pathname, searchParams]);

  return (
    <style>
      {`#nprogress{pointer-events:none}#nprogress .bar{background:${color};position:fixed;z-index:1031;top:0;left:0;width:100%;height:${height}px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;${boxShadow};opacity:1;-webkit-transform:rotate(3deg) translate(0px,-4px);-ms-transform:rotate(3deg) translate(0px,-4px);transform:rotate(3deg) translate(0px,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:1031;top:15px;right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:${color};border-left-color:${color};border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}
    </style>
  );
}

TopLoader.start = () => window.dispatchEvent(START_PROGRESS_BAR_EVENT);
TopLoader.stop = () => window.dispatchEvent(STOP_PROGRESS_BAR_EVENT);
