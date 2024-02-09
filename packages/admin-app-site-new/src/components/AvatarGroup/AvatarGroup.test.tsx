import { render, screen } from '@testing-library/react';

import { Avatar } from '../Avatar';

import { AvatarGroup } from './AvatarGroup';

describe('<AvatarGroup />', () => {
  it('should render every children by default', () => {
    render(
      <AvatarGroup>
        <Avatar name="Daryl Coss" />
        <Avatar name="Nary Doe" />
        <Avatar name="Castell Morr" />
        <Avatar name="Kurt Doe" />
        <Avatar name="Bob Doe" />
      </AvatarGroup>
    );

    expect(screen.getAllByRole('img')).toHaveLength(5);
  });

  it('should render correctly with max prop', () => {
    render(
      <AvatarGroup max={3}>
        <Avatar name="Daryl Coss" />
        <Avatar name="Nary Doe" />
        <Avatar name="Castell Morr" />
        <Avatar name="Kurt Doe" />
        <Avatar name="Bob Doe" />
      </AvatarGroup>
    );

    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('should render correctly if max is greater than children length', () => {
    render(
      <AvatarGroup max={10}>
        <Avatar name="Daryl Coss" />
        <Avatar name="Nary Doe" />
        <Avatar name="Castell Morr" />
        <Avatar name="Kurt Doe" />
        <Avatar name="Bob Doe" />
      </AvatarGroup>
    );

    expect(screen.getAllByRole('img')).toHaveLength(5);
  });

  it('should render correctly if max is equal to children length', () => {
    render(
      <AvatarGroup max={5}>
        <Avatar name="Daryl Coss" />
        <Avatar name="Nary Doe" />
        <Avatar name="Castell Morr" />
        <Avatar name="Kurt Doe" />
        <Avatar name="Bob Doe" />
      </AvatarGroup>
    );

    expect(screen.getAllByRole('img')).toHaveLength(5);
  });
});
