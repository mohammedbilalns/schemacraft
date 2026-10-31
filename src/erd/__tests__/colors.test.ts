import { describe, it, expect } from 'vitest';
import { getColorTheme, ERD_COLORS } from '../colors';

describe('Color Themes', () => {
  it('returns valid colors for known color names', () => {
    const blue = getColorTheme('blue');
    expect(blue.border).toBe(ERD_COLORS.blue.border);
    expect(blue.typeColor).toBe(ERD_COLORS.blue.typeColor);

    const green = getColorTheme('green');
    expect(green.border).toBe(ERD_COLORS.green.border);

    const orange = getColorTheme('orange');
    expect(orange.border).toBe(ERD_COLORS.orange.border);

    const purple = getColorTheme('purple');
    expect(purple.border).toBe(ERD_COLORS.purple.border);

    const red = getColorTheme('red');
    expect(red.border).toBe(ERD_COLORS.red.border);
  });

  it('falls back to blue for unknown color names', () => {
    const fallback = getColorTheme('non_existent_color');
    expect(fallback.border).toBe(ERD_COLORS.blue.border);
  });
});
