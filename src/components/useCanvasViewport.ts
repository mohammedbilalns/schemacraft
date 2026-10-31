import { useState, useCallback, useEffect, useRef, RefObject } from 'react';
import { ErdTable } from '../types/erd';
import { BASE_WIDTH } from '../erd/layoutConstants';

export function useCanvasViewport(
  containerRef: RefObject<HTMLDivElement | null>,
  tables: ErdTable[]
) {
  const [transform, setTransform] = useState({ x: 80, y: 80, scale: 0.85 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const transformRef = useRef(transform);
  transformRef.current = transform;

  // Zoom function matching the exact step and scaling of the canvas zoom buttons
  const handleZoom = useCallback((delta: number, clientCenter?: { x: number; y: number }) => {
    setTransform((prev) => {
      const newScale = Math.min(2.5, Math.max(0.15, prev.scale + delta));
      if (!clientCenter || !containerRef.current) {
        return { ...prev, scale: newScale };
      }
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = clientCenter.x - rect.left;
      const mouseY = clientCenter.y - rect.top;

      const scaleRatio = newScale / prev.scale;
      const newX = mouseX - (mouseX - prev.x) * scaleRatio;
      const newY = mouseY - (mouseY - prev.y) * scaleRatio;

      return { x: newX, y: newY, scale: newScale };
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Handle touchpad pinch and scroll inside canvas
    const handleCanvasWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.ctrlKey || e.metaKey) {
        // Touchpad pinch: zoom like the zoom button (+0.08 / -0.08 per tick)
        const sign = -Math.sign(e.deltaY);
        const magnitude = Math.min(0.15, Math.max(0.04, Math.abs(e.deltaY) * 0.02));
        const factor = sign * magnitude;
        handleZoom(factor, { x: e.clientX, y: e.clientY });
      } else {
        // Two-finger pan
        setTransform((prev) => ({
          ...prev,
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };

    // Multi-touch gestures (touchscreen / trackpad)
    let initialTouchDist = 0;
    let initialTouchScale = 1;
    let touchCenter = { x: 0, y: 0 };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialTouchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        touchCenter = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
        initialTouchScale = transformRef.current.scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialTouchDist > 0) {
        e.preventDefault();
        e.stopPropagation();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const targetScale = Math.min(2.5, Math.max(0.15, initialTouchScale * (currentDist / initialTouchDist)));
        handleZoom(targetScale - transformRef.current.scale, touchCenter);
      }
    };

    let startScale = 1;
    const handleGestureStart = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      startScale = transformRef.current.scale;
    };
    const handleGestureChange = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scale = (e as any).scale || 1;
      const targetScale = Math.min(2.5, Math.max(0.15, startScale * scale));
      const delta = targetScale - transformRef.current.scale;
      const rect = container.getBoundingClientRect();
      handleZoom(delta, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    };

    container.addEventListener('wheel', handleCanvasWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('gesturestart', handleGestureStart as EventListener, { passive: false });
    container.addEventListener('gesturechange', handleGestureChange as EventListener, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleCanvasWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('gesturestart', handleGestureStart as EventListener);
      container.removeEventListener('gesturechange', handleGestureChange as EventListener);
    };
  }, [containerRef, handleZoom]);

  const fitToScreen = useCallback(() => {
    if (tables.length === 0 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

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

    const padding = 80;
    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;
    const scale = Math.min(1.2, Math.max(0.2, Math.min(rect.width / contentWidth, rect.height / contentHeight)));

    setTransform({
      x: rect.width / 2 - ((minX + maxX) / 2) * scale,
      y: rect.height / 2 - ((minY + maxY) / 2) * scale,
      scale,
    });
  }, [tables, containerRef]);

  const startPan = (clientX: number, clientY: number) => {
    setIsPanning(true);
    setPanStart({ x: clientX - transform.x, y: clientY - transform.y });
  };

  const updatePan = (clientX: number, clientY: number) => {
    if (isPanning) {
      setTransform((prev) => ({
        ...prev,
        x: clientX - panStart.x,
        y: clientY - panStart.y,
      }));
    }
  };

  const endPan = () => setIsPanning(false);

  return {
    transform,
    setTransform,
    isPanning,
    startPan,
    updatePan,
    endPan,
    handleZoom,
    fitToScreen,
  };
}
