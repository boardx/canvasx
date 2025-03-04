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

// Default values for the textbox
export const textboxDefaultValues: Partial<TClassProperties<XTextbase>> = {
    minWidth: 20,
    dynamicMinWidth: 2,
    splitByGrapheme: false,
    cornerColor: 'white',
    cornerSize: 10,
    cornerStyle: 'circle',
    transparentCorners: false,
    cornerStrokeColor: 'gray',
    connectors: [],
};

// Connector class definition
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
export class XTextbox extends XTextbase implements WidgetTextInterface {
    // Property declarations
    declare minWidth: number;
    declare tempTop: number;
    declare hasNoText: boolean;
    static objType: WidgetType = 'XTextbox';
    static type: WidgetType = 'XTextbox';

    declare dynamicMinWidth: number;
    declare oneLine: boolean;
    declare fromCopy: boolean;
    declare originX: TOriginX;
    declare originY: TOriginY;
    declare connectors: Connector[];

    /**
     * Use this boolean property in order to split strings that have no white space concept.
     * This is a cheap way to help with Chinese/Japanese.
     * @type Boolean
     * @since 2.6.0
     */
    declare splitByGrapheme: boolean;

    static textLayoutProperties = [...IText.textLayoutProperties, 'width'];

    static ownDefaults: Record<string, any> = textboxDefaultValues;

    /**
     * Override the getDefaults method to set default origin to center
     */
    static getDefaults() {
        return {
            ...super.getDefaults(),
            controls: createTextboxDefaultControls(),
            originX: 'center', // Default originX
            originY: 'center', // Default originY
            ...XTextbox.ownDefaults,
        };
    }


    /**
     * Constructor to initialize the textbox with default origin
     * @param text - The initial text content
     * @param options - Configuration options
     */
    constructor(text: string, options: any) {
        super(text, options);

        // Initialize dimensions
        this.initDimensions();

        // Remove height from options to manage it dynamically
        delete options.height;
        Object.assign(this, options);
        this.objType = 'XTextbox';

        this.dirty = true;

        // Lock scaling flip and rotation to maintain aspect
        this.lockScalingFlip = true;
        this.lockRotation = true;
        // Setup custom resize controls
        this.setupCustomResizeControls();
        // Bind event listeners for editing
        this.on('editing:entered', this.onEditingEntered.bind(this));
        this.on('editing:exited', this.onEditingExited.bind(this));
    }
    /**
     * Set up custom resize controls that use our implementation
     */
    setupCustomResizeControls() {
        // Override the action handler for 'mr' (middle right) control
        if (this.controls && this.controls.mr) {
            this.controls.mr.actionHandler = this.handleWidthChange.bind(this);
        }

        // Override the action handler for 'ml' (middle left) control
        if (this.controls && this.controls.ml) {
            this.controls.ml.actionHandler = this.handleWidthChange.bind(this);
        }
    }
    /**
     * Event handler for entering edit mode
     */
    private onEditingEntered() {
        const canvas = this.canvas;
        if (!canvas) return;

        // Calculate the current top-left corner in canvas coordinates
        const topLeft = this.getBoundingRect();

        // Store the current center position
        const center = this.getCenterPoint();

        // Change origin to 'left' and 'top'
        this.originX = 'left';
        this.originY = 'top';

        // Update the position to keep the top-left corner fixed
        this.set({
            left: topLeft.left,
            top: topLeft.top,
        });

        this.setCoords();
    }

    /**
     * Event handler for exiting edit mode
     */
    private onEditingExited() {
        const canvas = this.canvas;
        if (!canvas) return;

        // Calculate the current top-left corner in canvas coordinates
        const topLeft = this.getBoundingRect();

        // Change origin back to 'center'
        this.originX = 'center';
        this.originY = 'center';

        // Calculate the new center based on top-left to keep position fixed
        this.set({
            left: topLeft.left + this.width / 2,
            top: topLeft.top + this.height / 2,
        });

        this.setCoords();
    }

    /**
     * Retrieves the object's properties
     * @returns A record of the object's properties
     */
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

    /**
     * Override the initDimensions method to ensure height increases downward
     */
    initDimensions() {
        if (!this.initialized) {
            return;
        }
        if (this.isEditing) {
            this.initDelayedCursor();
        }
        this._clearCache();
        // Clear dynamicMinWidth as it will be different after we re-wrap line
        this.dynamicMinWidth = 0;

        // Check if text contains Chinese characters
        if (/[\u3400-\u9FBF]/.test(this.text)) {
            this.splitByGrapheme = true;
        }

        // Wrap lines
        this._styleMap = this._generateStyleMap(this._splitText());
        // If after wrapping, the width is smaller than dynamicMinWidth, change the width and re-wrap
        if (this.dynamicMinWidth > this.width) {
            this.set('width', this.dynamicMinWidth);
        }
        if (this.textAlign.indexOf('justify') !== -1) {
            // Once text is measured we need to make space fatter to make justified text.
            this.enlargeSpaces();
        }
        // Calculate height based on wrapped text
        const newHeight = this.calcTextHeight();
        if (newHeight !== this.height) {
            this.set('height', newHeight);
            this.setCoords(); // Update coordinates after height change
        }
    }


    /**
     * Handler for width changes that maintains top-left position
     */
    handleWidthChange(eventData: any, transform: any, x: number, y: number) {
        // Store original top-left position
        const oldBoundingRect = this.getBoundingRect();

        // Calculate new width based on mouse position
        const localPoint = getLocalPoint(
            transform,
            transform.originX,
            transform.originY,
            x,
            y
        );

        const strokePadding =
            this.strokeWidth / (this.strokeUniform ? this.scaleX : 1);
        const multiplier = isTransformCentered(transform) ? 2 : 1;
        const oldWidth = this.width;

        // Calculate and set new width
        const newWidth =
            Math.abs((localPoint.x * multiplier) / this.scaleX) - strokePadding;

        // Record original left/top before width change
        const originalLeft = this.left;
        const originalTop = this.top;

        // Set new width and update dimensions
        this.set('width', Math.max(newWidth, this.getMinWidth()));

        // Recalculate text dimensions and height
        this.initDimensions();
        this.set('dirty', true);

        // After dimensions update, get new bounding rectangle
        const newBoundingRect = this.getBoundingRect();

        // Calculate position adjustment to keep top-left fixed
        const dx = newBoundingRect.left - oldBoundingRect.left;
        const dy = newBoundingRect.top - oldBoundingRect.top;

        // Apply position adjustment
        this.set({
            left: originalLeft - dx,
            top: originalTop - dy
        });

        // Update coordinates
        this.setCoords();

        return oldWidth !== this.width;
    }
}

// Register the XTextbox class with the class registry
classRegistry.setClass(XTextbox);
// classRegistry.getSVGClass(Textbox); // Uncomment if SVG class registration is needed
