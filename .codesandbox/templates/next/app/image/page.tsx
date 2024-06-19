
'use client';
import * as fabric from '../../../../../fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';


// import { XImage } from '../../../../../src/shapes/canvasx/XImage';

const IndexPage: NextPage = () => {
    const ref = useRef<fabric.XCanvas>(null);

    const onLoad = useCallback(
        async (canvas: fabric.XCanvas) => {
            canvas.setDimensions({
                width: document.documentElement.clientWidth
                ,
                height: document.documentElement.clientHeight
                    - 60,
            });
            // const textValue = 'CanvasX Demo';

            const image = new fabric.XImage('elementId', {
                top: 220,
                left: 200,
                width: 150,
                height: 150,

            });

            await image.setSrc('https://th.bing.com/th/id/OIP.WEKMZBVS3dCZ3PT9NU9UKAAAAA?rs=1&pid=ImgDetMain')

            canvas.add(image);

            const image2 = new fabric.XImage('elementId', {
                top: 220,
                left: 600,
                width: 150,
                height: 150,
            });

            await image2.setSrc(' https://knowledge.wharton.upenn.edu/wp-content/uploads/2023/03/3.15.23-scott-snyder-esg-corporate-innovation-GettyImages-1410816388-900x605.png')

            canvas.add(image2);

            canvas.renderAll();
            // // Create 10 RectNotes
            // for (let i = 0; i < 10; i++) {
            //     const rectNote = new RectNotes(textValue, {
            //         originX: 'center',
            //         top: 220 + i * 20,
            //         left: 200 + i * 20,
            //         textAlign: 'center',
            //         backgroundColor: 'lightblue',
            //         id: Math.random().toString(36).substr(2, 9),
            //     });
            //     canvas.add(rectNote);
            // }

            // // Create 10 CircleNotes
            // for (let i = 0; i < 10; i++) {
            //     const circleNote = new CircleNotes(textValue, {
            //         originX: 'center',
            //         top: 520 + i * 10,
            //         left: 520 + i * 10,
            //         textAlign: 'center',

            //         backgroundColor: 'yellow',
            //         id: Math.random().toString(36).substr(2, 9),
            //     });
            //     canvas.add(circleNote);
            // }

            // // Create 10 more RectNotes with different dimensions
            // for (let i = 0; i < 10; i++) {
            //     const rectNote = new RectNotes(textValue, {
            //         originX: 'center',
            //         top: 200 + i * 10,
            //         left: 600 + i * 10,
            //         width: 138,
            //         height: 138,
            //         textAlign: 'center',

            //         backgroundColor: 'lightgreen',
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
