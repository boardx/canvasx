
'use client';
import * as fabric from '../../../../../fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';
import showMenu from '../../components/widgetMenu/ShowMenu';

// import { RectNotes } from '../../../../src/shapes/RectNotes';
export const shapeList = [
    {
        name: 'rect',
        path: 'M-50,-50L50,-50 50,50 -50,50z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'diamond',
        path: 'm-50,0 l50,-50 50,50 -50,50 -50,-50z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'roundedRect',
        path: 'M-50,-35 Q-50,-50 -35,-50 L35,-50 Q50,-50 50,-35 L50,35 Q50,50 35,50 L-35,50 Q-50,50 -50,35 Z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'circle',
        path: 'M-50,0a50,50 0 1,0 100,0a50,50 0 1,0 -100,0',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'hexagon',
        path: 'm-43.476 -25.4636 l 43.476 -24.5364 l 43.7551 25.2641 l 0 50.5157 l -43.7551 24.2202 l -43.7551 -25.2654 l 0 -50.5157 z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'triangle',
        path: 'm-50,50l50,-100l50,100l-100,0z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'parallelogramIcon',
        path: 'm-50,50l20,-100l80,0l-20,100l-80,0z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'star',
        path: 'm-50,-10l38,0l12,-38l12,38l38,0l-30,23l12,38l-30,-24l-30,24l12,-38l-30,-23z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'cross',
        path: 'm-50,-15l33,0l0,-33l34,0l0,33l33,0l0,34l-33,0l0,33l-34,0l0,-33l-33,0l0,-34z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'leftsideRightTriangle',
        path: 'm50,50l-100,0l0,-100l100,100z',
        offsetX: 100,
        offsetY: 100,
    },
    {
        name: 'rightsideRightTriangle',
        path: 'm-50,50l100,0l0,-100l-100,100z',
        offsetX: 200,
        offsetY: 200,
    },
    {
        name: 'topsideSemicircleCircle',
        path: 'm50,25l-100,-0.00205c3.5,-27.5 25,-48 50,-48c25,0 46.5,20.5 50,48z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'topLeftQuarterCircle',
        path: 'm-50,50c7,-55 47,-96 97,-97l0,65l0,32l-97,-0.00392z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'constellationRect',
        path: 'm20,0l25,23l0,24l-100,0l0,-100l100,0l0,23l-25,24l-0.15,0.14l0.15,0.14l-0.00001,0z',
        offsetX: 0,
        offsetY: 0,
    },
    {
        name: 'constellationRound',
        path: 'm20,1c0.002,0.002 0.004,0.004 0.01,0.001c0.007,0.01 0.015,0.02 0.02,0.03l0,0l0.001,0.0004l0.005,0.003l0.04,0.03l0.3,0.2l2.5,2l20,15c-7,15 -23,26 -42,26c-25,0 -45,-20 -45,-45c0,-25 20,-45 45,-45c19,0 35,10 42,25c-11,9 -17,14 -20,16c-1.5,1 -2,1.5 -2.5,2c-0.2,0.15 -0.3,0.2 -0.35,0.3c-0.02,0.02 -0.04,0.04 -0.05,0.06c-0.006,0.01 -0.02,0.03 -0.03,0.06c-0.005,0.015 -0.02,0.04 -0.03,0.07c-0.005,0.015 -0.01,0.04 -0.007,0.07c0.002,0.02 0.007,0.04 0.015,0.06c0.003,0.006 0.006,0.012 0.009,0.018c0.003,0.004 0.006,0.009 0.009,0.014c0.003,0.005 0.009,0.01 0.01,0.015c0.004,0.005 0.01,0.015 0.012,0.017z',
        offsetX: 0,
        offsetY: 0,
    },
];


const IndexPage: NextPage = () => {
    const ref = useRef<fabric.XCanvas>(null);

    const onLoad = useCallback(
        (canvas: fabric.XCanvas) => {
            canvas.setDimensions({
                width: document.documentElement.clientWidth
                ,
                height: document.documentElement.clientHeight
                    - 60,
            });
            const textValue = 'CanvasX Demo';



            for (let i = 0; i < shapeList.length; i++) {
                const shape = shapeList[i];
                const shapeNote = new fabric.XShapeNotes(textValue, {
                    originX: 'center',
                    originY: 'center',
                    top: (i % 3) * 300,
                    left: (i - i % 3) * 200,
                    textAlign: 'center',
                    width: 200,
                    height: 200,
                    shapeName: shape.name,
                    backgroundColor: 'lightblue',
                    id: Math.random().toString(36).substr(2, 9),
                });


                canvas.add(shapeNote);
            }

            canvas.on('selection:created', (e) => {
                console.log('selection:updated', e);
                showMenu(canvas);
            });
            canvas.on('selection:updated', (e) => {
                console.log('selection:updated', e);
                showMenu(canvas);
            });
            canvas.on('selection:cleared', (e) => {
                console.log('selection:updated', e);
                showMenu(canvas);
            });
            canvas.on('object:moving', (e) => {
                console.log('object:moving', e);
                showMenu(canvas);
            }
            );



            // // Create 10 RectNotes
            // for (let i = 0; i < 5; i++) {
            //     const rectNote = new fabric.XShapeNotes(textValue, {
            //         originX: 'center',
            //         originY: 'center',
            //         top: 220,
            //         left: 200 + i * 250,
            //         textAlign: 'center',
            //         width: 200,
            //         height: 200,
            //         icon: i,
            //         backgroundColor: 'lightblue',
            //         id: Math.random().toString(36).substr(2, 9),
            //     });
            //     canvas.add(rectNote);
            // }

            // // Create 10 RectNotes
            // for (let i = 6; i < 11; i++) {
            //     const rectNote = new fabric.XShapeNotes(textValue, {
            //         originX: 'center',
            //         top: 220 + 300,
            //         left: 200 + (i - 6) * 250,
            //         textAlign: 'center',
            //         width: 200,
            //         height: 200,
            //         icon: i,

            //         backgroundColor: 'lightblue',
            //         id: Math.random().toString(36).substr(2, 9),
            //     });
            //     canvas.add(rectNote);
            // }


            // // Create 10 CircleNotes
            // for (let i = 0; i < 10; i++) {
            //     const circleNote = new fabric.XCircleNotes(textValue, {
            //         originX: 'center',
            //         top: 520 + i * 10,
            //         left: 520 + i * 10,
            //         textAlign: 'center',
            //         textValue,
            //         backgroundColor: 'yellow',
            //     });
            //     canvas.add(circleNote);
            // }

            // // Create 10 more RectNotes with different dimensions
            // for (let i = 0; i < 10; i++) {
            //     const rectNote = new fabric.XRectNotes(textValue, {
            //         originX: 'center',
            //         top: 200 + i * 10,
            //         left: 600 + i * 10,
            //         width: 138,
            //         height: 138,
            //         textAlign: 'center',
            //         textValue,
            //         backgroundColor: 'green',
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
