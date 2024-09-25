import { WidgetChartInterface } from './widget.entity.chart';
import { WidgetCircleNotesInterface } from './widget.entity.circlenote';
import { WidgetGroupInterface } from './widget.entity.group';
import { WidgetRectNotesInterface } from './widget.entity.rectnote';
import { WidgetTextboxInterface } from './widget.entity.textbox';
import { WidgetFileInterface } from './widget.entity.file';
import { WidgetImageInterface } from './widget.entity.image';
import { WidgetFrameInterface } from './widget.entity.frame';

import { WidgetPathInterface } from './widget.entity.path';
import { WidgetShapeNotesInterface } from './widget.entity.shapenote';
import { WidgetURLInterface } from './widget.entity.url';
import { WidgetConnectorInterface } from './widget.entity.connector';
import { WidgetMarkdownInterface } from './widget.entity.markdown';
import { WidgetTextInterface } from './widget.entity.text';

export type WidgetObjectType =
  | WidgetChartInterface
  | WidgetCircleNotesInterface
  | WidgetGroupInterface
  | WidgetRectNotesInterface
  | WidgetTextboxInterface
  | WidgetFileInterface
  | WidgetImageInterface
  | WidgetFrameInterface
  | WidgetPathInterface
  | WidgetShapeNotesInterface
  | WidgetURLInterface
  | WidgetConnectorInterface
  | WidgetMarkdownInterface
  | WidgetTextInterface;
