import { ErdTable } from '../types/erd';
import { BASE_WIDTH } from '../erd/layoutConstants';

export interface ExportPngOptions {
  scale?: number;
  backgroundColor?: string;
  padding?: number;
  filename?: string;
}

export async function exportDiagramAsPng(
  tables: ErdTable[],
  options: ExportPngOptions = {}
): Promise<{ dataUrl: string; isPng: boolean }> {
  const scale = options.scale || 2;
  const bgColor = options.backgroundColor || '#121316';
  const padding = options.padding ?? 60;
  const baseFilename = (options.filename || 'diagram.png').replace(/\.[^.]+$/, '');

  const svgElement = document.getElementById('erd-canvas-svg') as SVGSVGElement | null;
  if (!svgElement) throw new Error('Canvas SVG not found');

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const t of tables) {
    const x = t.x || 0;
    const y = t.y || 0;
    const w = t.width || BASE_WIDTH;
    const h = t.height || 120;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  }

  if (minX === Infinity) {
    minX = 0;
    minY = 0;
    maxX = 800;
    maxY = 600;
  }

  const exportX = minX - padding;
  const exportY = minY - padding;
  const exportW = maxX - minX + padding * 2;
  const exportH = maxY - minY + padding * 2;

  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('viewBox', `${exportX} ${exportY} ${exportW} ${exportH}`);
  clone.setAttribute('width', `${exportW}`);
  clone.setAttribute('height', `${exportH}`);

  const innerGroup = clone.querySelector('g[transform]');
  if (innerGroup) innerGroup.removeAttribute('transform');

  const bgRect = clone.querySelector('#canvas-bg') as SVGRectElement | null;
  if (bgRect) {
    bgRect.setAttribute('x', `${exportX}`);
    bgRect.setAttribute('y', `${exportY}`);
    bgRect.setAttribute('width', `${exportW}`);
    bgRect.setAttribute('height', `${exportH}`);
    bgRect.setAttribute('fill', bgColor);
  }

  // Remove any foreignObject elements just in case
  clone.querySelectorAll('foreignObject').forEach((fo) => fo.remove());

  const svgString = new XMLSerializer().serializeToString(clone);
  const base64Svg = window.btoa(unescape(encodeURIComponent(svgString)));
  const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const fallbackToSvg = () => {
      const link = document.createElement('a');
      link.download = `${baseFilename}.svg`;
      link.href = dataUrl;
      link.click();
      resolve({ dataUrl, isPng: false });
    };

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = exportW * scale;
        canvas.height = exportH * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return fallbackToSvg();

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, exportW, exportH);

        const pngDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${baseFilename}.png`;
        link.href = pngDataUrl;
        link.click();
        resolve({ dataUrl: pngDataUrl, isPng: true });
      } catch {
        // If canvas is blocked by browser security restrictions, gracefully download SVG
        fallbackToSvg();
      }
    };

    img.onerror = () => {
      fallbackToSvg();
    };

    img.src = dataUrl;
  });
}
