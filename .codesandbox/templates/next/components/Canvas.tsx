import * as fabric from '../../../../fabric';
import React, { useEffect, useRef, useState } from 'react';
import MiniCanvas from './preview/MiniCanvas';
import showMenu from './widgetMenu/ShowMenu';

const DEV_MODE = process.env.NODE_ENV === 'development';

import { initializeCanvasEvents } from '../../../../fabric';
import WidgetMenu from './widgetMenu/WidgetMenu';
import MenuBar from './boardMenu/MenuBar';
import { BoardService } from '../services';
import { changeMode } from '../redux/features/mode.slice';
import store from '../redux/store';
import useLineActions from '../components/boardMenu/modeHandlers/useLineActions';

// declare global {
//   var canvas: fabric.XCanvas | undefined;
// }

export const Canvas = React.forwardRef<
  fabric.XCanvas,
  { onLoad?(canvas: fabric.XCanvas): void }
>(({ onLoad }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState(null as fabric.XCanvas | null);

  const { handleLineBefore,
    handleLineAfter,
    handleLineMouseDown,
    handleLineMouseMove,
    handleLineMouseUp,
    handleLineShortCut } = useLineActions();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvasInstance = new fabric.XCanvas(canvasRef.current, {
      backgroundColor: '#f0f0f0',
      height: document.documentElement.clientHeight
      ,
      width: document.documentElement.clientWidth
        - 60,
    });
    canvasInstance.setTargetFindTolerance(5)
    BoardService.getInstance().setBoard(canvasInstance);

    setCanvas(canvasInstance); // Update the type of the setCanvas argument

    const alignmentGuidelines = new fabric.alignmentGuideLines(canvasInstance);
    alignmentGuidelines.initializeEvents();
    initializeCanvasEvents(canvasInstance);
    const handleResize = () => {
      canvasInstance.setHeight(document.documentElement.clientHeight - 60);
      canvasInstance.setWidth(document.documentElement.clientWidth);
      canvasInstance.renderAll();
    };




    let lastTimeRefireMouseDown = Date.now();
    canvasInstance?.on('mouse:down:before', (e: any) => {
      console.log('Date.now() - lastTimeRefireMouseDown 111', Date.now() - lastTimeRefireMouseDown);
      if (e.target && e.target.controls) {
        const controls = e.target.controls;
        const pointer = e.scenePoint; // Get the mouse pointer position
        const tolerance = 5; // Adjust this value for control sensitivity

        // Helper function to check if pointer is within control bounds
        const isOverlapping = (control: any) => {
          if (!control) return false;
          const controlPosition = e.target.canvas.getControlPointOnCanvas(e.target, control.name);
          return (
            pointer.x >= controlPosition.x - tolerance &&
            pointer.x <= controlPosition.x + tolerance &&
            pointer.y >= controlPosition.y - tolerance &&
            pointer.y <= controlPosition.y + tolerance
          );
        };


        const isHoveringMbaSatrt = isOverlapping(controls.mbaStart);
        const isHoveringMlaStart = isOverlapping(controls.mlaStart);
        const isHoveringMraStart = isOverlapping(controls.mraStart);
        const isHoveringMtaStart = isOverlapping(controls.mtaStart);

        // Check if the mouse pointer overlaps with any of the specified controls
        if (
          isHoveringMbaSatrt ||
          isHoveringMlaStart ||
          isHoveringMraStart ||
          isHoveringMtaStart
        ) {
          if (isHoveringMbaSatrt) {
            e.target.hoveringControl = "mbaStart";
          }
          if (isHoveringMlaStart) {
            e.target.hoveringControl = "mlaStart";
          }
          if (isHoveringMraStart) {
            e.target.hoveringControl = "mraStart";
          }
          if (isHoveringMtaStart) {
            e.target.hoveringControl = "mtaStart";
          }
          canvasInstance.dockingWidget = e.target;
          // e.e.cancelable = true; // Make sure the event is cancelable
          // e.e.preventDefault(); // Cancel the original event
          // e.e.stopPropagation();
          // Manually dispatch a new mousedown event at the same position using canvas.fire
          setTimeout(() => {
            const pointerEvent: fabric.TPointerEvent = {
              ...e.e,
            };

            // if (Date.now() - lastTimeRefireMouseDown < 1000) {
            //   return;
            // }

            if (!e.isSecondEvent) {
              canvasInstance.fire('mouse:down:before', {
                e: pointerEvent,
                target: e.target,
                pointer: e.pointer,
                absolutePointer: e.absolutePointer,
                transform: e.transform,
                scenePoint: e.scenePoint,
                viewportPoint: e.viewportPoint,
                isSecondEvent: true
              });
            }

          }, 100);

          console.log("!@ store.dispatch(changeMode('line'));");
          store.dispatch(changeMode('line'));
          // setTimeout(() => {
          //   handleLineMouseDown(e);
          // }, 50);

          return false;
        }
      }
    });



    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.documentElement);

    //@ts-ignore
    DEV_MODE && (window.canvas = canvasInstance);

    if (typeof ref === 'function') {
      ref(canvasInstance);
    } else if (typeof ref === 'object' && ref) {
      ref.current = canvasInstance;
    }

    canvasInstance.on('selection:created', (e) => {
      console.log('selection:updated', e);
      showMenu(canvasInstance);
    });
    canvasInstance.on('selection:updated', (e) => {
      console.log('selection:updated', e);
      showMenu(canvasInstance);
    });
    canvasInstance.on('selection:cleared', (e) => {
      console.log('selection:updated', e);
      showMenu(canvasInstance);
    });
    canvasInstance.on('object:moving', (e) => {
      console.log('object:moving', e);
      showMenu(canvasInstance);
    });
    canvasInstance.on('object:modified', (e) => {
      setCoords();
    });




    //loop through all objects and setCoords()
    function setCoords() {
      canvasInstance.getObjects().forEach(function (obj) {
        obj.setCoords();
      });
    }



    // it is crucial `onLoad` is a dependency of this effect
    // to ensure the canvas is disposed and re-created if it changes
    onLoad?.(canvasInstance);

    return () => {
      resizeObserver.unobserve(document.documentElement);
      resizeObserver.disconnect();
      //@ts-ignore
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
      canvasInstance.dispose();
    };
  }, [canvasRef, onLoad]);

  return <>
    <canvas ref={canvasRef} />
    <MiniCanvas canvas={canvas!} />
    {canvas && <WidgetMenu canvas={canvas!} />}
    <MenuBar />
  </>
});
