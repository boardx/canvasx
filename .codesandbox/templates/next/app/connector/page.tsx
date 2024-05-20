
'use client';
import * as fabric from '../../../../../fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';
// import { RectNotes } from '../../../../src/shapes/RectNotes';



const IndexPage: NextPage = () => {
    const ref = useRef<fabric.Canvas>(null);
    //@ts-ignore
    window.fabric = fabric
    const onLoad = useCallback(
        (canvas: fabric.Canvas) => {
            canvas.setDimensions({
                width: window.innerWidth,
                height: window.innerHeight - 60,
            });
            const textValue = 'CanvasX Demo';

            // Create 10 RectNotes

            const rectNote1 = new fabric.RectNotes(textValue, {
                originX: 'center',
                top: 220,
                left: 200,
                textAlign: 'center',
                textValue,
                backgroundColor: 'lightblue',
                _id: Math.random().toString(36).substr(2, 9),
            });
            canvas.add(rectNote1);

            const rectNote2 = new fabric.RectNotes(textValue, {
                originX: 'center',
                top: 520,
                left: 500,
                textAlign: 'center',
                textValue,
                backgroundColor: 'lightblue',
                _id: Math.random().toString(36).substr(2, 9),
            });
            canvas.add(rectNote2);

            const point1 = rectNote1.getPointByOrigin('right', 'center');
            const point2 = rectNote2.getPointByOrigin('left', 'center');

            // Calculate the control points for connecting two points
            const cp1 = {
                x: point1.x + (point2.x - point1.x) / 2,
                y: point1.y,
            };

            const cp2 = {
                x: point2.x - (point2.x - point1.x) / 2,
                y: point2.y,
            };


            const x1 = -50, y1 = -50;
            const x2 = 50, y2 = 50;
            const controlPoint1X = 50, controlPoint1Y = -50;
            const controlPoint2X = -50, controlPoint2Y = 50;
            const left = 100, top = 100;
            const style = 'curved';

            const curve = new fabric.X_Connector(x1, y1, x2, y2, controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, left, top, style, {
                stroke: 'black',
                strokeWidth: 2,
                fill: '',
                objectCaching: false,
                hasBorders: true,
                hasControls: true,
                selectable: true,
                perPixelTargetFind: true,
            });

            canvas.add(curve);

            canvas.add(new fabric.Circle({
                radius: 5,
                fill: 'black',
                left: 0,
                top: 0,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
            }));
            canvas.add(new fabric.Circle({
                radius: 5,
                fill: 'black',
                left: 0,
                top: 100,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
            }));
            canvas.add(new fabric.Circle({
                radius: 5,
                fill: 'black',
                left: 0,
                top: 200,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
            }));
            canvas.add(new fabric.Circle({
                radius: 5,
                fill: 'black',
                left: 100,
                top: 0,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
            }));
            canvas.add(new fabric.Circle({
                radius: 5,
                fill: 'black',
                left: 200,
                top: 0,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
            }));




            // const line = new fabric.Line([x1 + 400, y1 + 400, x2 + 400, y2 + 400], {
            //     stroke: 'black',
            //     strokeWidth: 2,

            // });

            // canvas.add(line);
            canvas.renderAll();


            // // Create 10 CircleNotes
            // for (let i = 0; i < 10; i++) {
            //     const circleNote = new fabric.CircleNotes(textValue, {
            //         originX: 'center',
            //         top: 520 + i * 10,
            //         left: 520 + i * 10,
            //         textAlign: 'center',
            //         textValue,
            //         backgroundColor: 'yellow',
            //         _id: Math.random().toString(36).substr(2, 9),
            //     });
            //     canvas.add(circleNote);
            // }

            // // Create 10 more RectNotes with different dimensions
            // for (let i = 0; i < 10; i++) {
            //     const rectNote = new fabric.RectNotes(textValue, {
            //         originX: 'center',
            //         top: 200 + i * 10,
            //         left: 600 + i * 10,
            //         width: 138,
            //         height: 138,
            //         textAlign: 'center',
            //         textValue,
            //         backgroundColor: 'lightgreen',
            //         _id: Math.random().toString(36).substr(2, 9),
            //     });
            //     canvas.add(rectNote);
            // }
        },
        [ref]
    );

    return (
        <div className="position-relative">
            <Canvas ref={ref} onLoad={onLoad} />
        </div>
    );
};

export default IndexPage;
