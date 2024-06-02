
'use client';
import * as fabric from '../../../../../fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';

// import { RectNotes } from '../../../../src/shapes/RectNotes';

// SVG data URL
const penCursor = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="purple" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
`);

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

            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.width = 3;
            // canvas.setCursor(penCursor);
            canvas.freeDrawingCursor = `url(${penCursor}) 0 24, auto`;
            canvas.freeDrawingBrush.color = 'purple';
            // canvas.defaultCursor = `url(${penCursor}) 0 24, auto`;

            const textValue = 'CanvasX Demo Drawing';

            canvas.add(new fabric.XRectNotes(textValue, {
                originX: 'center',
                top: 220,
                left: 200,
                textAlign: 'center',

                backgroundColor: 'lightblue',

                id: Math.random().toString(36).substr(2, 9),

            })
            );

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
