
'use client';
import * as fabric from '../../../../../fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';



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

            // Create 10 RectNotes
            for (let i = 0; i < 3; i++) {
                const rectNote = new fabric.XRectNotes(textValue, {
                    originX: 'center',
                    top: 220 + i * 120,
                    left: 200 + i * 120,
                    originY: 'center',
                    textAlign: 'center',
                    backgroundColor: 'lightblue',
                    id: Math.random().toString(36).substr(2, 9),
                });
                canvas.add(rectNote);
            }

            // Create 10 CircleNotes
            for (let i = 0; i < 3; i++) {
                const circleNote = new fabric.XCircleNotes(textValue, {
                    originX: 'center',
                    originY: 'center',
                    top: 520 + i * 110,
                    left: 520 + i * 110,
                    textAlign: 'center',
                    backgroundColor: 'yellow',
                    id: Math.random().toString(36).substr(2, 9),
                });
                canvas.add(circleNote);
            }

            // Create 10 more RectNotes with different dimensions
            for (let i = 0; i < 3; i++) {
                const rectNote = new fabric.XRectNotes(textValue, {
                    originX: 'center',
                    top: 200 + i * 110,
                    left: 600 + i * 110,
                    width: 138,
                    height: 138,
                    textAlign: 'center',
                    originY: 'center',
                    backgroundColor: 'lightgreen',
                    id: Math.random().toString(36).substr(2, 9),
                });
                canvas.add(rectNote);
            }

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

            //         backgroundColor: 'lightblue',
            //         id: Math.random().toString(36).substr(2, 9),
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
