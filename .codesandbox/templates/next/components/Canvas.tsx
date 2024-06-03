import * as fabric from '../../../../fabric';
import React, { useEffect, useRef, useState } from 'react';
import MiniCanvas from './preview/MiniCanvas';


const DEV_MODE = process.env.NODE_ENV === 'development';

import { initializeCanvasEvents } from '../../../../fabric';
import WidgetMenu from './widgetMenu/WidgetMenu';
import MenuBar from './boardMenu/MenuBar';
import { BoardService } from '../services';

declare global {
  var canvas: fabric.XCanvas | undefined;
}

export const Canvas = React.forwardRef<
  fabric.XCanvas,
  { onLoad?(canvas: fabric.XCanvas): void }
>(({ onLoad }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState(null as fabric.XCanvas | null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = new fabric.XCanvas(canvasRef.current, {
      backgroundColor: '#f0f0f0',
      height: document.documentElement.clientHeight
      ,
      width: document.documentElement.clientWidth
        - 60,
    });
    canvas.setTargetFindTolerance(5)
    BoardService.getInstance().setBoard(canvas);

    setCanvas(canvas); // Update the type of the setCanvas argument

    const alignmentGuidelines = new fabric.alignmentGuideLines(canvas);
    alignmentGuidelines.initializeEvents();
    initializeCanvasEvents(canvas);
    const handleResize = () => {
      canvas.setHeight(document.documentElement.clientHeight - 60);
      canvas.setWidth(document.documentElement.clientWidth);
      canvas.renderAll();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.documentElement);


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
      resizeObserver.unobserve(document.documentElement);
      resizeObserver.disconnect();
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
    <MiniCanvas canvas={canvas!} />
    <WidgetMenu canvas={canvas!} />
    <MenuBar />
  </>
});
