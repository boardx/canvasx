
'use client';
import * as fabric from '../../../../../fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';
import { Button } from '@mui/joy';

// import { RectNotes } from '../../../../src/shapes/RectNotes';



const IndexPage: NextPage = () => {
    const ref = useRef<fabric.XCanvas>(null);


    const onLoad = useCallback(
        (canvas: fabric.XCanvas) => {
            canvas.setDimensions({
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight - 60,
            });
            const textValue = 'CanvasX DemoCanvasX DemoCanvasX DemoCanvasX Demo';

            // Create 10 RectNotes
            for (let i = 0; i < 1; i++) {
                const rectNote = new fabric.XTextbox(textValue, {
                    originX: 'center',
                    originY: 'center',
                    top: 220 + i * 60,
                    left: 500 + i * 20,
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

    const createNew = () => {
        const canvas = ref.current;
        const textValue = 'abc';
        const rectNote = new fabric.IText(textValue, {
            originX: 'center',
            originY: 'center',
            top: 220,
            left: 200,
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
        canvas?.add(rectNote);

    }
    return (
        <div className="position-relative">
            <Canvas ref={ref} onLoad={onLoad} />
            <Button onClick={createNew} variant='solid' sx={{ position: 'absolute', left: "10px", top: "20px" }}> Create</Button>
        </div>
    );
};

export default IndexPage;
