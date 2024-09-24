import { TClassProperties, TOriginX, TOriginY } from '../../typedefs';
import { IText } from '../IText/IText';
import { classRegistry } from '../../ClassRegistry';
import { createTextboxDefaultControls } from '../../controls/X_commonControls';
import { XTextbox } from './XTextbox';

import { EntityKeys } from './type/widget.entity.textbox';
import { WidgetType } from './type/widget.type';
import { Point } from '../../Point';
import { WidgetTextInterface } from './type/widget.entity.text';
// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
export const textboxDefaultValues: Partial<TClassProperties<XTextbox>> = {
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

export const XTextboxProps: Partial<TClassProperties<XTextbox>> = {};

/**
 * Textbox class, based on IText, allows the user to resize the text rectangle
 * and wraps lines automatically. Textboxes have their Y scaling locked, the
 * user can only change width. Height is adjusted automatically based on the
 * wrapping of lines.
 */
export class XText
    extends XTextbox
    implements WidgetTextInterface {


    /**
     * Minimum width of textbox, in pixels.
     * @type Number
     * @default
     */
    declare minWidth: number;

    declare tempTop: number;

    declare hasNoText: boolean;

    static objType: WidgetType = 'XText';
    static type: WidgetType = 'XText';

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
        // if (this.objType !== 'XText' && this.objType !== 'XTextbox') {
        // this.addControls();
        // }
        this.initializeEvent();
        Object.assign(this, options);


        // this.resetResizeControls();
    }


    /* boardx extend function */






}

classRegistry.setClass(XText);
// classRegistry.getSVGClass(Textbox);
