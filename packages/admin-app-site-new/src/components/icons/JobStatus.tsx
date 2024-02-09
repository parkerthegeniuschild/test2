import { match } from 'ts-pattern';

function Unassigned() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="3.25" stroke="#828c99" strokeWidth="1.5" />
    </svg>
  );
}

function Notifying() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="4" fill="#ffaf0a" />
    </svg>
  );
}

function Scheduled() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="4" fill="#ff7d05" />
    </svg>
  );
}

function Queued() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="4" fill="#7825ff" />
    </svg>
  );
}

function OnTheWay() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="4" fill="#1c92ff" />
    </svg>
  );
}

function Manual() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="4" fill="#828c99" />
    </svg>
  );
}

function Paused() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="4" fill="#262c33" />
    </svg>
  );
}

function InProgress() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="4" fill="#00cc66" />
    </svg>
  );
}

function Canceled() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill="#f25d26"
        d="M5.325 4.175a.812.812 0 10-1.15 1.15L6.851 8l-2.676 2.675a.812.812 0 101.15 1.15L8 9.149l2.675 2.676a.812.812 0 101.15-1.15L9.149 8l2.676-2.675a.812.812 0 00-1.15-1.15L8 6.851 5.325 4.175z"
      />
    </svg>
  );
}

function Completed() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill="#0c6"
        d="M12.53 5.53a.75.75 0 00-1.06-1.06L6.5 9.44 4.53 7.47a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5.5-5.5z"
      />
    </svg>
  );
}

type JobStatusProps = {
  status:
    | 'Unassigned'
    | 'Notifying'
    | 'scheduled'
    | 'queued'
    | 'On the way'
    | 'Manual'
    | 'Paused'
    | 'In progress'
    | 'Canceled'
    | 'Completed';
};

export function JobStatus({ status }: JobStatusProps) {
  return match(status)
    .with('Unassigned', () => <Unassigned />)
    .with('Notifying', () => <Notifying />)
    .with('scheduled', () => <Scheduled />)
    .with('queued', () => <Queued />)
    .with('On the way', () => <OnTheWay />)
    .with('Manual', () => <Manual />)
    .with('Paused', () => <Paused />)
    .with('In progress', () => <InProgress />)
    .with('Canceled', () => <Canceled />)
    .with('Completed', () => <Completed />)
    .exhaustive();
}
