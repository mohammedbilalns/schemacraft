import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { getErdIcon } from '../icons';

describe('Icons Mapper', () => {
  it('renders known icons correctly', () => {
    const { container: userContainer } = render(getErdIcon('user'));
    expect(userContainer.querySelector('svg')).toBeInTheDocument();

    const { container: carContainer } = render(getErdIcon('car'));
    expect(carContainer.querySelector('svg')).toBeInTheDocument();

    const { container: buildingContainer } = render(getErdIcon('building-2'));
    expect(buildingContainer.querySelector('svg')).toBeInTheDocument();
  });

  it('renders fallback icon when name is empty or unknown', () => {
    const { container: emptyContainer } = render(getErdIcon(undefined));
    expect(emptyContainer.querySelector('svg')).toBeInTheDocument();

    const { container: unknownContainer } = render(getErdIcon('some_unknown_icon'));
    expect(unknownContainer.querySelector('svg')).toBeInTheDocument();
  });
});
