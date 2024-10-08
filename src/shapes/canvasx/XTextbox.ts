import { TClassProperties, TOriginX, TOriginY } from '../../typedefs';
import { IText } from '../IText/IText';
import { classRegistry } from '../../ClassRegistry';
import { createTextboxDefaultControls } from '../../controls/X_commonControls';
import { XTextbase } from './XTextbase';
import { isTransformCentered, getLocalPoint } from '../../controls/util';
import { EntityKeys } from './type/widget.entity.textbox';
import { WidgetType } from './type/widget.type';
import { Point } from '../../Point';
import { WidgetTextInterface } from './type/widget.entity.text';
// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
export const textboxDefaultValues: Partial<TClassProperties<XTextbase>> = {
    minWidth: 20,
    dynamicMinWidth: 2,
    // _wordJoiners: /[ \t\r]/,
    splitByGrapheme: false,
    cornerColor: 'white',
    cornerSize: 10,
    cornerStyle: 'circle',
    transparentCorners: false,
    cornerStrokeColor: 'gray',
    connectors: [],
};

class Connector {
    connectorId: string;
    connectorType: string;
    point: Point;
}

export const XTextboxProps: Partial<TClassProperties<XTextbase>> = {};

/**
 * Textbox class, based on IText, allows the user to resize the text rectangle
 * and wraps lines automatically. Textboxes have their Y scaling locked, the
 * user can only change width. Height is adjusted automatically based on the
 * wrapping of lines.
 */
export class XTextbox
    extends XTextbase
    implements WidgetTextInterface {


    /**
     * Minimum width of textbox, in pixels.
     * @type Number
     * @default
     */
    declare minWidth: number;
    declare tempTop: number;
    declare hasNoText: boolean;
    static objType: WidgetType = 'XTextbox';
    static type: WidgetType = 'XTextbox';

    /**
     * Minimum calculated width of a textbox, in pixels.
     * fixed to 2 so that an empty textbox cannot go to 0
     * and is still selectable without text.
     * @type Number
     * @default
     */
    declare dynamicMinWidth: number;

    declare oneLine: boolean;

    declare fromCopy: boolean;
    declare originX: TOriginX;
    declare originY: TOriginY;
    declare connectors: Connector[];
    /**
     * Use this boolean property in order to split strings that have no white space concept.
     * this is a cheap way to help with chinese/japanese
     * @type Boolean
     * @since 2.6.0
     */
    declare splitByGrapheme: boolean;

    static textLayoutProperties = [...IText.textLayoutProperties, 'width'];

    static ownDefaults: Record<string, any> = textboxDefaultValues;


    getObject() {
        const entityKeys: string[] = EntityKeys;
        const result: Record<string, any> = {};

        entityKeys.forEach((key) => {
            if (key in this) {
                result[key] = (this as any)[key];
            }
        });

        return result;
    }


    static getDefaults() {
        return {
            ...super.getDefaults(),
            controls: createTextboxDefaultControls(),
            ...XTextbox.ownDefaults,
        };
    }

    constructor(text: string, options: any) {

        super(text, options);
        this.initDimensions();
        this.initializeEvent();
        delete options.height;
        Object.assign(this, options);
        this.objType = 'XTextbox';


        this.dirty = true;

        // this.resetResizeControls();
    }

    changeWidth(eventData: any, transform: any, x: any, y: any) {
        var target = transform.target,
            localPoint = getLocalPoint(
                transform,
                transform.originX,
                transform.originY,
                x,
                y
            ),
            strokePadding =
                target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
            multiplier = isTransformCentered(transform) ? 2 : 1,
            oldWidth = target.width,
            newWidth =
                Math.abs((localPoint.x * multiplier) / target.scaleX) - strokePadding,
            shapeScaleX =
                Math.abs(target.aCoords['tl'].x - target.aCoords['tr'].x) / 138;
        target.set('shapeScaleX', shapeScaleX);
        target.set('width', Math.max(newWidth, 0));

        target.initDimensions();

        target.set('dirty', true);

        if (target.objType === 'XTextbase' || target.objType === 'XText') {
            target.set('fixedScaleChange', false);
        }

        return oldWidth !== newWidth;
    }

    /**
  * Unlike superclass's version of this function, Textbox does not update
  * its width.
  * @private
  * @override
  */
    initDimensions() {
        if (!this.initialized) {
            return;
        }
        this.isEditing && this.initDelayedCursor();
        this._clearCache();
        // clear dynamicMinWidth as it will be different after we re-wrap line
        this.dynamicMinWidth = 0;
        // wrap lines
        this._styleMap = this._generateStyleMap(this._splitText());
        // if after wrapping, the width is smaller than dynamicMinWidth, change the width and re-wrap
        if (this.dynamicMinWidth > this.width) {
            this._set('width', this.dynamicMinWidth);
        }
        if (this.textAlign.indexOf('justify') !== -1) {
            // once text is measured we need to make space fatter to make justified text.
            this.enlargeSpaces();
        }
        // clear cache and re-calculate height
        this.height = this.calcTextHeight();
    }

}

classRegistry.setClass(XTextbox);
// classRegistry.getSVGClass(Textbox);
