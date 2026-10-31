import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined') {
  window.HTMLCanvasElement.prototype.getContext = (() => ({
    drawImage: () => {},
    scale: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray() }),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,fake';
}
