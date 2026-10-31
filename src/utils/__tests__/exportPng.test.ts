import { describe, it, expect } from 'vitest';
import { exportDiagramAsPng } from '../exportPng';
import { ErdTable } from '../../types/erd';

describe('exportDiagramAsPng Utility', () => {
  it('throws error if canvas SVG is not found in DOM', async () => {
    const mockTables: ErdTable[] = [];
    await expect(exportDiagramAsPng(mockTables)).rejects.toThrow('Canvas SVG not found');
  });

  it('exports successfully when SVG exists', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'erd-canvas-svg';
    document.body.appendChild(svg);

    const mockTables: ErdTable[] = [
      {
        name: 'users',
        color: 'blue',
        x: 0,
        y: 0,
        width: 200,
        height: 100,
        fields: [],
        lineNumber: 1,
      },
    ];

    // Mock Image in jsdom to trigger onload
    const originalImage = window.Image;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Image = class {
      onload: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => this.onload && this.onload(), 0);
      }
    };

    const promise = exportDiagramAsPng(mockTables);
    await expect(promise).resolves.toBeDefined();

    window.Image = originalImage;
    document.body.removeChild(svg);
  });
});
