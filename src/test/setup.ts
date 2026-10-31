import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('monaco-vim', () => ({
  initVimMode: vi.fn(() => ({ dispose: vi.fn() })),
}));

if (typeof window !== 'undefined') {
  window.HTMLCanvasElement.prototype.getContext = (() => ({
    drawImage: () => {},
    scale: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray() }),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,fake';
}
