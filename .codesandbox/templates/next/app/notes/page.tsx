
'use client';
import * as fabric from 'fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';
// import { RectNotes } from '../../../../src/shapes/RectNotes';



const IndexPage: NextPage = () => {
    const ref = useRef<fabric.Canvas>(null);

    const onLoad = useCallback(
        (canvas: fabric.Canvas) => {
            canvas.setDimensions({
                width: window.innerWidth,
                height: window.innerHeight - 60,
            });
            const textValue = 'CanvasX Demo';

            // Create 10 RectNotes
            for (let i = 0; i < 10; i++) {
                const rectNote = new fabric.RectNotes(textValue, {
                    originX: 'center',
                    top: 220 + i * 20,
                    left: 200 + i * 20,
                    textAlign: 'center',
                    textValue,
                    backgroundColor: 'lightblue',
                    _id: Math.random().toString(36).substr(2, 9),
                });
                canvas.add(rectNote);
            }

            // Create 10 CircleNotes
            for (let i = 0; i < 10; i++) {
                const circleNote = new fabric.CircleNotes(textValue, {
                    originX: 'center',
                    top: 520 + i * 10,
                    left: 520 + i * 10,
                    textAlign: 'center',
                    textValue,
                    backgroundColor: 'yellow',
                    _id: Math.random().toString(36).substr(2, 9),
                });
                canvas.add(circleNote);
            }

            // Create 10 more RectNotes with different dimensions
            for (let i = 0; i < 10; i++) {
                const rectNote = new fabric.RectNotes(textValue, {
                    originX: 'center',
                    top: 200 + i * 10,
                    left: 600 + i * 10,
                    width: 138,
                    height: 138,
                    textAlign: 'center',
                    textValue,
                    backgroundColor: 'lightgreen',
                    _id: Math.random().toString(36).substr(2, 9),
                });
                canvas.add(rectNote);
            }
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
