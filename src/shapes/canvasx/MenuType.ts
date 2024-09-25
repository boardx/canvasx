export type WidgetMenu =
  | 'emojiMenu'
  | 'drawNote'
  | 'textNote'
  | 'fontSize'
  | 'textAlign'
  | 'resetDraw'
  | 'newLayout'
  | 'alignGroup'
  | 'backgroundColor'
  | 'fillColor'
  | 'strokeColor'
  | 'fontColor'
  | 'shapeBorderColor'
  | 'shapeBackgroundColor'
  | 'oldShapeBackgroundColor'
  | 'polylineArrowColor'
  | 'noteDrawColor'
  | 'drawOption'
  | 'lineWidth'
  | 'shadowMenu'
  | 'resetDraw'
  | 'arrowLineWidth'
  | 'connectorShape'
  | 'connectorStyle'
  | 'connectorTip'
  | 'borderLineIcon'
  | 'fontWeight'
  | 'textBullet'
  | 'crop'
  | 'objectLock'
  | 'aiassist'
  | 'fileName'
  | 'fileDownload'
  | 'audioToText'
  | 'textToMultipleStickyNotes'
  | 'more'
  | 'delete';

export type WidgetMenuList = Array<WidgetMenu>;