
'use client';
import * as fabric from '../../../../../fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';

// import { RectNotes } from '../../../../src/shapes/RectNotes';



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

            // // create a polygon object
            // var points = [{
            //     x: 3, y: 4
            // }, {
            //     x: 16, y: 3
            // }, {
            //     x: 30, y: 5
            // }, {
            //     x: 25, y: 55
            // }, {
            //     x: 19, y: 44
            // }, {
            //     x: 15, y: 30
            // }, {
            //     x: 15, y: 55
            // }, {
            //     x: 9, y: 55
            // }, {
            //     x: 6, y: 53
            // }, {
            //     x: -2, y: 55
            // }, {
            //     x: -4, y: 40
            // }, {
            //     x: 0, y: 20
            // }]
            // var polygon = new fabric.Polygon(points, {
            //     left: 100,
            //     top: 50,
            //     fill: '#D81B60',
            //     strokeWidth: 4,
            //     stroke: 'green',
            //     scaleX: 4,
            //     scaleY: 4,
            //     objectCaching: false,
            //     transparentCorners: false,
            //     cornerColor: 'blue',
            // });
            // canvas.viewportTransform = [0.7, 0, 0, 0.7, -50, 50];
            // canvas.add(polygon);

            // // define a function that can locate the controls.
            // // this function will be used both for drawing and for interaction.
            // function polygonPositionHandler(dim, finalMatrix, fabricObject) {
            //     var x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
            //         y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
            //     return fabric.util.transformPoint(
            //         { x: x, y: y },
            //         fabric.util.multiplyTransformMatrices(
            //             fabricObject.canvas.viewportTransform,
            //             fabricObject.calcTransformMatrix()
            //         )
            //     );
            // }

            // function getObjectSizeWithStroke(object) {
            //     var stroke = new fabric.Point(
            //         object.strokeUniform ? 1 / object.scaleX : 1,
            //         object.strokeUniform ? 1 / object.scaleY : 1
            //     ).multiply(object.strokeWidth);
            //     return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
            // }

            // // define a function that will define what the control does
            // // this function will be called on every mouse move after a control has been
            // // clicked and is being dragged.
            // // The function receive as argument the mouse event, the current trasnform object
            // // and the current position in canvas coordinate
            // // transform.target is a reference to the current object being transformed,
            // function actionHandler(eventData, transform, x, y) {
            //     var polygon = transform.target,
            //         currentControl = polygon.controls[polygon.__corner],
            //         mouseLocalPosition = fabric.controlsUtils.getLocalPoint(transform, currentControl.originX, currentControl.originY, x, y),
            //         //  polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
            //         polygonBaseSize = getObjectSizeWithStroke(polygon),
            //         size = polygon._getTransformedDimensions(0, 0),
            //         finalPointPosition = {
            //             x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
            //             y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
            //         };
            //     polygon.points[currentControl.pointIndex] = finalPointPosition;
            //     return true;
            // }

            // // define a function that can keep the polygon in the same position when we change its
            // // width/height/top/left.
            // function anchorWrapper(anchorIndex, fn) {
            //     return function (eventData, transform, x, y) {
            //         var fabricObject = transform.target,
            //             absolutePoint = fabric.util.transformPoint({
            //                 x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
            //                 y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
            //             }, fabricObject.calcTransformMatrix()),
            //             actionPerformed = fn(eventData, transform, x, y),
            //             newDim = fabricObject.setDimensions(),
            //             polygonBaseSize = getObjectSizeWithStroke(fabricObject),
            //             newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
            //             newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
            //         fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
            //         return actionPerformed;
            //     }
            // }

            // function Edit() {
            //     // clone what are you copying since you
            //     // may want copy and paste on different moment.
            //     // and you do not want the changes happened
            //     // later to reflect on the copy.
            //     var poly = canvas.getObjects()[0];
            //     canvas.setActiveObject(poly);
            //     poly.edit = !poly.edit;
            //     if (poly.edit) {
            //         var lastControl = poly.points.length - 1;
            //         poly.cornerStyle = 'circle';
            //         poly.cornerColor = 'rgba(0,0,255,0.5)';
            //         poly.controls = poly.points.reduce(function (acc, point, index) {
            //             acc['p' + index] = new fabric.Control({
            //                 positionHandler: polygonPositionHandler,
            //                 actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
            //                 actionName: 'modifyPolygon',
            //                 pointIndex: index
            //             });
            //             return acc;
            //         }, {});
            //     } else {
            //         poly.cornerColor = 'blue';
            //         poly.cornerStyle = 'rect';
            //         poly.controls = fabric.Object.prototype.controls;
            //     }
            //     poly.hasBorders = !poly.edit;
            //     canvas.requestRenderAll();
            // }
            // Edit();

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
