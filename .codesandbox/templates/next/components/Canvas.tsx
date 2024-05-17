import * as fabric from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import MiniCanvas from './preview/MiniCanvas';

const DEV_MODE = process.env.NODE_ENV === 'development';

import { initializeCanvasEvents } from './initializeCanvasEvents';

declare global {
  var canvas: fabric.Canvas | undefined;
}

export const Canvas = React.forwardRef<
  fabric.Canvas,
  { onLoad?(canvas: fabric.Canvas): void }
>(({ onLoad }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#f0f0f0',
      height: window.innerHeight,
      width: window.innerWidth - 60,
    });
    setCanvas(canvas);
    const alignmentGuidelines = new fabric.alignmentGuideLines(canvas);
    alignmentGuidelines.initializeEvents();
    initializeCanvasEvents(canvas);
    const handleResize = () => {
      canvas.setHeight(window.innerHeight - 60);
      canvas.setWidth(window.innerWidth);
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    DEV_MODE && (window.canvas = canvas);

    if (typeof ref === 'function') {
      ref(canvas);
    } else if (typeof ref === 'object' && ref) {
      ref.current = canvas;
    }

    // it is crucial `onLoad` is a dependency of this effect
    // to ensure the canvas is disposed and re-created if it changes
    onLoad?.(canvas);

    return () => {
      DEV_MODE && delete window.canvas;

      if (typeof ref === 'function') {
        ref(null);
      } else if (typeof ref === 'object' && ref) {
        ref.current = null;
      }

      // `dispose` is async
      // however it runs a sync DOM cleanup
      // its async part ensures rendering has completed
      // and should not affect react
      canvas.dispose();
    };
  }, [canvasRef, onLoad]);

  return <>
    <canvas ref={canvasRef} />
    <MiniCanvas canvas={canvas} />
  </>
});
