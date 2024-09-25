import { TOriginX, TOriginY } from './widget.entity.base';
import   {WidgetTextboxInterface, Connector } from './widget.entity.textbox';
import { WidgetType } from './widget.type';

export   interface WidgetRectNotesInterface extends WidgetTextboxInterface {}

export class WidgetRectNotesClass implements WidgetRectNotesInterface {
    updatedBy: string = "";
    updatedByName: string = "";
    createdByName: string="";
    fontFamily: string = 'Inter';
    fontSize: number = 16;
    fontWeight: string = '400';
    lineHeight: number = 1.5;
    text: string = '';
    textAlign: string = 'center';
    editable: boolean = true;
    fixedScaleChange: boolean = false;
    connectors: Connector[] = [];
    id: string = '';
    boardId: string = '';
    backgroundColor: string = 'rgba(252,236,138,1)';
    width: number = 230;
    height: number = 138;
    left: number = 0;
    locked: boolean = false;
    objType: WidgetType = "XRectNotes";
    originX: TOriginX = 'center';
    originY: TOriginY = 'center';
    scaleX: number = 1;
    scaleY: number = 1;
    selectable: boolean = true;
    top: number = 0;
    userId: string = '';
    zIndex: number = Date.now()*100;
    version: string = '1.0';
    updatedAt: number = Date.now();
 
    createdAt: number = Date.now();
    createdBy: string = '';
    visible: boolean = true;
}

export const EntityKeys = Object.keys(new WidgetRectNotesClass()) as (keyof WidgetRectNotesInterface)[];