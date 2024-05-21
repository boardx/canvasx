
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



            const connectDock1 = ['right', 'left', 'center'];
            const connectDock2 = ['top', 'bottom', 'center'];
            const connectBorder = ['left', 'right', 'top', 'bottom'];


            for (let i = 0; i < connectBorder.length; i++) {
                for (let j = 0; j < connectBorder.length; j++) {

                    // if (connectDock1[i] === 'center' && connectDock2[j] === 'center') continue;
                    // if (connectDock1[i] !== 'center' && connectDock2[j] !== 'center') continue;
                    let rectNoteA: fabric.RectNotes;
                    let rectNoteB: fabric.RectNotes;
                    rectNoteA = new fabric.RectNotes(textValue, {
                        originX: 'center',
                        top: 220 + i * 300,
                        left: 200 + j * 900,
                        textAlign: 'center',
                        textValue,
                        connectors: [],
                        backgroundColor: 'lightblue',
                        id: Math.random().toString(36).substr(2, 9),
                    });
                    canvas.add(rectNoteA);


                    rectNoteB = new fabric.RectNotes(textValue, {
                        originX: 'center',
                        top: 520 + i * 300,
                        left: 700 + j * 900,
                        textAlign: 'center',
                        textValue,
                        connectors: [],
                        backgroundColor: 'lightblue',
                        id: Math.random().toString(36).substr(2, 9),
                    });
                    canvas.add(rectNoteB);
                    console.log('points combine: ', connectDock1[i], connectDock2[j]);

                    let origin1A = connectDock1[i];
                    let origin1B = connectDock2[j];
                    let origin2A = connectDock1[j];
                    let origin2B = connectDock2[j];

                    if (connectBorder[i] === 'left' || connectBorder[i] === 'right') {
                        origin1A = connectBorder[i];
                        origin1B = 'center'

                    }
                    else {

                        origin1A = 'center'
                        origin1B = connectBorder[i]
                    }
                    if (connectBorder[j] === 'left' || connectBorder[j] === 'right') {
                        origin2A = connectBorder[j];
                        origin2B = 'center'

                    } else {
                        origin2A = 'center'
                        origin2B = connectBorder[j]
                    }

                    const point1 = rectNoteA.getPointByOrigin(origin1A, origin1B);
                    const point2 = rectNoteB.getPointByOrigin(origin2A, origin2B);
                    console.log('points:', point1, point2)

                    let cp1 = { x: 0, y: 0 }, cp2 = { x: 0, y: 0 };


                    cp1 = rectNoteA.calculateControlPoint(rectNoteA.getBoundingRect(), point1);
                    cp2 = rectNoteB.calculateControlPoint(rectNoteB.getBoundingRect(), point2);


                    const style = 'curved';

                    const curve = new fabric.X_Connector(point1, point2, cp1, cp2, style, {
                        stroke: 'black',
                        strokeWidth: 2,
                        fill: '',
                        objectCaching: false,
                        hasBorders: false,
                        hasControls: true,
                        selectable: true,
                        fromId: null,
                        toId: null,
                        perPixelTargetFind: true,
                        id: Math.random().toString(36).substr(2, 9),
                    });

                    canvas.add(curve);


                    //add connecter id to rectNote's field connectors as an object, {connectorId: string, point: {x: number, y: number}} the point shouldb be t he local point to the rectNote.
                    rectNoteA.connectors.push({ connectorId: curve.id, point: { x: point1.x - rectNoteA.left, y: point1.y - rectNoteA.top } });
                    rectNoteB.connectors.push({ connectorId: curve.id, point: { x: point2.x - rectNoteB.left, y: point2.y - rectNoteB.top } });
                    //add rectNote's id to the connector's field connectedRectNotes as an array of string
                    curve.fromId = rectNoteA.id;
                    curve.toId = rectNoteB.id;

                }
            }





            // // Create 10 RectNotes
            // const rectNote1 = new fabric.RectNotes(textValue, {
            //     originX: 'center',
            //     top: 220,
            //     left: 200,
            //     textAlign: 'center',
            //     textValue,
            //     backgroundColor: 'lightblue',
            //     _id: Math.random().toString(36).substr(2, 9),
            // });
            // canvas.add(rectNote1);

            // const rectNote2 = new fabric.RectNotes(textValue, {
            //     originX: 'center',
            //     top: 520,
            //     left: 700,
            //     textAlign: 'center',
            //     textValue,
            //     backgroundColor: 'lightblue',
            //     _id: Math.random().toString(36).substr(2, 9),
            // });
            // canvas.add(rectNote2);

            // const point1 = rectNote1.getPointByOrigin('right', 'center');
            // const point2 = rectNote2.getPointByOrigin('left', 'center');

            // // Calculate the control points for connecting two points
            // const cp1 = {
            //     x: point1.x + (point2.x - point1.x) / 2,
            //     y: point1.y,
            // };

            // const cp2 = {
            //     x: point2.x - (point2.x - point1.x) / 2,
            //     y: point2.y,
            // };

            // const style = 'curved';

            // const curve = new fabric.X_Connector(point1,
            //     point2, cp1, cp2, style, {
            //     stroke: 'black',
            //     strokeWidth: 2,
            //     fill: '',
            //     objectCaching: false,
            //     hasBorders: false,
            //     hasControls: true,
            //     selectable: true,
            //     perPixelTargetFind: true,
            // });

            // canvas.add(curve);

            // // Create 10 RectNotes
            // const rectNote11 = new fabric.RectNotes(textValue, {
            //     originX: 'center',
            //     top: 220,
            //     left: 200 + 800,
            //     textAlign: 'center',
            //     textValue,
            //     backgroundColor: 'lightblue',
            //     _id: Math.random().toString(36).substr(2, 9),
            // });
            // canvas.add(rectNote11);

            // const rectNote22 = new fabric.RectNotes(textValue, {
            //     originX: 'center',
            //     top: 520,
            //     left: 700 + 800,
            //     textAlign: 'center',
            //     textValue,
            //     backgroundColor: 'lightblue',
            //     _id: Math.random().toString(36).substr(2, 9),
            // });
            // canvas.add(rectNote22);

            // const point11 = rectNote11.getPointByOrigin('center', 'bottom');
            // const point22 = rectNote22.getPointByOrigin('left', 'center');

            // // Calculate the control points for connecting two points
            // const cp11 = {
            //     x: point11.x,
            //     y: point11.y + (point22.y - point11.y) / 2,
            // };

            // const cp22 = {
            //     x: point22.x - (point22.x - point11.x) / 2,
            //     y: point22.y,
            // };


            // const curve2 = new fabric.X_Connector(point11,
            //     point22, cp11, cp22, style, {
            //     stroke: 'black',
            //     strokeWidth: 2,
            //     fill: '',
            //     objectCaching: false,
            //     hasBorders: false,
            //     hasControls: true,
            //     selectable: true,
            //     perPixelTargetFind: true,
            // });

            // canvas.add(curve2);

            // canvas.add(new fabric.Circle({
            //     radius: 5,
            //     fill: 'black',
            //     left: 0,
            //     top: 0,
            //     originX: 'center',
            //     originY: 'center',
            //     selectable: false,
            //     evented: false,
            // }));
            // canvas.add(new fabric.Circle({
            //     radius: 5,
            //     fill: 'black',
            //     left: 0,
            //     top: 100,
            //     originX: 'center',
            //     originY: 'center',
            //     selectable: false,
            //     evented: false,
            // }));
            // canvas.add(new fabric.Circle({
            //     radius: 5,
            //     fill: 'black',
            //     left: 0,
            //     top: 200,
            //     originX: 'center',
            //     originY: 'center',
            //     selectable: false,
            //     evented: false,
            // }));
            // canvas.add(new fabric.Circle({
            //     radius: 5,
            //     fill: 'black',
            //     left: 100,
            //     top: 0,
            //     originX: 'center',
            //     originY: 'center',
            //     selectable: false,
            //     evented: false,
            // }));
            // canvas.add(new fabric.Circle({
            //     radius: 5,
            //     fill: 'black',
            //     left: 200,
            //     top: 0,
            //     originX: 'center',
            //     originY: 'center',
            //     selectable: false,
            //     evented: false,
            // }));




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



