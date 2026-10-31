import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce Hook', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 100));
    expect(result.current).toBe('initial');
  });

  it('updates debounced value after specified delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 150), {
      initialProps: { val: 'first' },
    });

    expect(result.current).toBe('first');

    rerender({ val: 'second' });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(result.current).toBe('second');

    vi.useRealTimers();
  });
});
