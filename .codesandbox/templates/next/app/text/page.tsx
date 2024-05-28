
'use client';
import * as fabric from 'canvasx';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';
// import { RectNotes } from '../../../../src/shapes/RectNotes';



const IndexPage: NextPage = () => {
    const ref = useRef<fabric.WBCanvas>(null);

    const onLoad = useCallback(
        (canvas: fabric.WBCanvas) => {
            canvas.setDimensions({
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight - 60,
            });
            const textValue = 'CanvasX DemoCanvasX DemoCanvasX DemoCanvasX Demo';

            // Create 10 RectNotes
            for (let i = 0; i < 10; i++) {
                const rectNote = new fabric.X_Textbox(textValue, {
                    originX: 'center',
                    originY: 'center',
                    top: 220 + i * 60,
                    left: 200 + i * 20,
                    width: 500,
                    textAlign: 'center',
                    evented: true,
                    backgroundColor: 'lightblue',
                    editable: true,
                    cornerStrokeColor: "gray",
                    cornerStyle: "circle",
                    cornerColor: 'white',
                    transparentCorners: false,
                    id: Math.random().toString(36).substr(2, 9),
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
