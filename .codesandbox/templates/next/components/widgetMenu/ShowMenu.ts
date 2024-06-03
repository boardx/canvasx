import * as fabric from '@boardxus/canvasx';
//** Import Redux kit
import store from '../../redux/store';
import {
  handleChangeFontFamily,
  handleChangeFontSize,
  handleChangeMenuPosition,
} from '../../redux/features/widgetMenu.slice';
import {
  handleSetCurrentLockStatus,
  handleSetCurrentAlign,
  handleSetWidgetMenuList,
  handleWidgetMenuDisplay,
} from '../../redux/features/board.slice';
import {
  handleSetMultiFontSize,
  handleSetMultiFontFamily,
  handleSetOpacityValue,
  handleSetCurrentHoverObjectId,
} from '../../redux/features/widgets.slice';
//@ts-ignore
import _ from 'underscore';
import i18n from 'i18next';
import {
  handleSetArrowSelected,
  handleSetFileSelected,
  handleSetNoteSelected,
  handleSetPathSelected,
  handleSetShapeSelected,
  handleSetTextSelected,
} from '../../redux/features/widgets.slice';

const t = i18n.getFixedT(null, null);

const changeMenuBarSelected = (objType: string) => {
  store.dispatch(handleSetNoteSelected(false));
  store.dispatch(handleSetTextSelected(true));
  store.dispatch(handleSetShapeSelected(true));
  store.dispatch(handleSetPathSelected(true));
  store.dispatch(handleSetArrowSelected(true));
  store.dispatch(handleSetFileSelected(true));
  if (!objType) return;
  switch (objType) {
    case 'XRectNotes':
      store.dispatch(handleSetNoteSelected(true));
      break;
    case 'XText':
      store.dispatch(handleSetTextSelected(true));
      break;
    case 'WBPath':
      store.dispatch(handleSetPathSelected(true));
      break;
    case 'XConnector':
      store.dispatch(handleSetArrowSelected(true));
      break;
    case 'XShapeNotes':
      store.dispatch(handleSetShapeSelected(true));
      break;
    case 'WBImage':
      store.dispatch(handleSetFileSelected(true));
      break;
  }
};

const getMenuBarSelected = (objType: string) => {
  switch (objType) {
    case 'XRectNotes':
      return store.getState().widgets.noteSelected;
    case 'XText':
      return store.getState().widgets.textSelected;
    case 'WBPath':
      return store.getState().widgets.pathSelected;
    case 'XConnector':
      return store.getState().widgets.arrowSelected;
    case 'XShapeNotes':
      return store.getState().widgets.shapeSelected;
    case 'WBImage':
      return store.getState().widgets.fileSelected;
  }
};

const getMenuPositionLeft = (
  canvas: any,
  target: any,
  pointx: any,
  screenWidth: any,
  menuLength: any
) => {
  let left = pointx;
  left = Math.max(left, 72);

  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length > 1) {
    const groupLockedMark = activeObjects.some((r: any) => r.locked === true);

    if (groupLockedMark) {
      left = Math.min(left, screenWidth - 50);
    } else {
      left = Math.min(left, screenWidth - 42 * menuLength);
      // not accurate enough, there should be another way to calculate the menu length based on each widget menu width
    }
  } else if (target.getWidgetMenuLength && target.getWidgetMenuLength()) {
    left = Math.min(left, screenWidth - target.getWidgetMenuLength() - 72);
  } else {
    left = Math.min(left, screenWidth - 420 - 72);
  }

  left = Math.max(left, 6);

  return left;
};

const getMenuPositionTop = (
  canvas: any,
  target: any,
  pointy: any,
  objectHeightonCanvas: any
) => {
  let top = Math.max(pointy, 125);

  const singleObjectFlag =
    target.objType &&
    [
      'XCircleNotes',
      'XText',
      'XRectNotes',
      'XShapeNotes',
      'XFile',
      'WBImage',
      'WBUrlImage',
      'XConnector',
    ].includes(target.objType);

  if (singleObjectFlag || canvas.getActiveObjects().length > 1) {
    if (objectHeightonCanvas < canvas.height) {
      if (pointy < 106) {
        if (pointy < canvas.height - 48) {
          top =
            pointy > canvas.height - 60
              ? canvas.height - 48
              : pointy + objectHeightonCanvas + 124;
        }
      }
    }
  }

  return top;
};

const getLTPoint = (object: any, canvas: any) => {
  const topLeft = object.aCoords.tl;
  const point = fabric.util.transformPoint(
    {
      x: topLeft.x,
      y: topLeft.y - 20 / canvas.getZoom(),
    },
    canvas.viewportTransform
  );

  return point;
};

const getBRPoint = (object: any, canvas: any) => {
  const bottomRight = object.aCoords.br;
  const point = fabric.util.transformPoint(
    {
      x: bottomRight.x,
      y: bottomRight.y - 20 / canvas.getZoom(),
    },
    canvas.viewportTransform
  );

  return point;
};

const getScreenWidth = (canvas: fabric.XCanvas) => {
  const slidesMode = store.getState().slides.slidesMode;
  const screenWidth = slidesMode ? canvas.width - 240 : canvas.width;

  return screenWidth;
};

function setFontforMultiObject(menus: any, target: any, canvas: any) {
  let fontFlag = 0;
  let font: any;
  let fontNext;

  let fontSizeFlag = 0;
  let fontSize: any;
  let fontSizeNext;

  let isStickyNotes = false;
  let isTextBox = false;
  let isFile = false;
  let imagesNum = 0;
  let stickyNotesNum = 0;
  let circleNotesNum = 0;
  let textBoxNum = 0;

  if (canvas.getActiveObjects().length > 1) {
    let groupLockedMark = false;
    canvas.getActiveObjects().forEach((r: any) => {
      if (r.locked === true) groupLockedMark = true;
      if (r.objType === 'XFile') {
        isFile = true;
      }
      if (r.objType === 'WBImage') {
        imagesNum = imagesNum + 1;
      }
      if (r.objType === 'XRectNotes') {
        stickyNotesNum = stickyNotesNum + 1;
      }
      if (r.objType === 'XCircleNotes') {
        circleNotesNum = circleNotesNum + 1;
      }
      if (r.objType === 'XText') {
        textBoxNum = textBoxNum + 1;
        isTextBox = true;
      }
      if (
        r.objType === 'XCircleNotes' ||
        r.objType === 'XRectNotes' ||
        r.objType === 'XShapeNotes'
      ) {
        isStickyNotes = true;
      }
      if (r.getWidgetMenuList) {
        menus = _.intersection(menus, r.getWidgetMenuList());
      }

      if (fontFlag === 0) {
        font = r.fontFamily || ' ';
        fontNext = font;
        fontFlag = 1;
      } else if (fontFlag === 1) {
        fontNext = r.fontFamily || ' ';
        if (font !== fontNext) {
          fontFlag = 2;
        }
      }
      if (fontSizeFlag === 0) {
        fontSize = r.fontSize || ' ';
        fontSizeNext = fontSize;
        fontSizeFlag = 1;
      } else if (fontSizeFlag === 1) {
        fontSizeNext = r.fontSize || ' ';
        if (fontSize !== fontSizeNext) {
          fontSizeFlag = 2;
        }
      }
    });

    if (fontFlag !== 2 && !groupLockedMark) {
      store.dispatch(handleSetMultiFontFamily(font));
      menus.push('fontSize');
    } else {
      store.dispatch(handleSetMultiFontFamily(t('mixed')));
      menus = menus.filter((e: any) => e !== 'fontSize');
    }

    if (isFile) {
      menus = menus.filter(
        (e: any) => e === 'fileName' && e === 'fileDownload'
      );
      menus.push('objectLock');
    }

    // if (imagesNum > 1) {
    //   menus = menus.filter(e => e !== 'aiassist');
    // }

    // if (stickyNotesNum > 1 && imagesNum >= 1) {
    //   menus = menus.filter(e => e !== 'aiassist');
    // }

    if (textBoxNum > 1) {
      menus = menus.filter((e: any) => e !== 'textToMultipleStickyNotes');
    }

    // if (isTextBox && imagesNum > 0) {
    //   menus = menus.filter(e => e !== 'aiassist');
    // }

    if (isStickyNotes !== isTextBox && !groupLockedMark) {
      if (fontSizeFlag !== 2) {
        store.dispatch(handleSetMultiFontSize(fontSize));
        menus.push('fontSize');
      } else {
        store.dispatch(handleSetMultiFontSize(t('mixed')));
        menus = menus.filter((e: any) => e !== 'fontSize');
      }
    } else {
      // menus.push('fontSize');
      menus = menus.filter((e: any) => e !== 'fontSize');
    }

    store.dispatch(
      handleChangeFontSize(store.getState().widgets.multiFontSize)
    );

    if (!groupLockedMark) {
      let obj = canvas.getActiveObject();
      if (obj.objType === 'WBGroup') {
        let group = [];
        obj._objects.forEach((r: any) => {
          if (r.objType !== 'XConnector') {
            group.push(r);
          }
        });
        if (group.length > 1) {
          menus.push('alignGroup');
          menus.push('newLayout');
        }
      } else {
        menus.push('alignGroup');
        menus.push('newLayout');
      }

      if (stickyNotesNum > 1 && !groupLockedMark) {
        menus.push('changeFont');
        menus.push('fontSize');
        menus = menus.filter((e: any) => e !== 'emojiMenu');
      }

      if (circleNotesNum > 0 && !groupLockedMark) {
        menus.push('fontSize');
        menus = menus.filter((e: any) => e !== 'emojiMenu');
      }
    }
  } else if (target.getWidgetMenuList) {
    menus = _.intersection(menus, target.getWidgetMenuList());
    store.dispatch(handleChangeFontSize(canvas.getActiveObject().fontSize));
  } else {
    menus = [];
  }
  return menus;
}

// (window as any).showMenu = showMenu;

export default function showMenu(canvas: any) {
  if (
    !canvas ||
    !canvas.getActiveObject ||
    store.getState().board.connectorMode ||
    store.getState().slides.capturing ||
    store.getState().mode.type === 'eraser'
  ) {
    store.dispatch(handleSetWidgetMenuList([]));
    return;
  }

  let menus = [
    'emojiMenu',
    'drawNote',
    'textNote',
    'fontSize',
    'textAlign',
    'resetDraw',
    'newLayout',
    'alignGroup',
    'backgroundColor',
    'fillColor',
    'strokeColor',
    'fontColor',
    'shapeBorderColor',
    'shapeBackgroundColor',
    'oldShapeBackgroundColor',
    'polylineArrowColor',
    'noteDrawColor',
    'drawOption',
    'lineWidth',
    'shadowMenu',
    'resetDraw',
    'arrowLineWidth',
    'connectorShape',
    'connectorStyle',
    'connectorTip',
    'borderLineIcon',
    'fontWeight',
    'textBullet',
    'crop',
    'objectLock',
    'aiassist',
    'fileName',
    'fileDownload',
    'audioToText',
    'textToMultipleStickyNotes',
  ];
  if (localStorage.getItem('currentUIType') === 'laptop') {
    menus.push('switchNoteType');
    menus.push('applyFormat');
    // menus.push('objectLock');
    menus.push('changeFont');
  } else {
    menus.push('delete');
  }
  const target = canvas.getActiveObject();

  if (
    !target ||
    (target && target.objType === 'common') ||
    (!target && !canvas.isDrawingMode)
  ) {
    // changeMenuBarSelected(target.objType);
    store.dispatch(handleSetWidgetMenuList([]));
    return;
  }

  if (target && target._objects && target._objects.length > 0) {
    const shapeAndRect = target._objects.filter(
      (c: any) => c.objType === 'XShapeNotes' || c.objType === 'XRectNotes'
    );
    if (shapeAndRect && shapeAndRect.length > 1) {
      menus.splice(3, 1);
    }
  }
  if (target.objType) {
    switch (target.objType) {
      case 'XRectNotes':
      case 'XText':
      case 'WBPath':
      case 'XConnector':
      case 'XShapeNotes':
      case 'WBImage':
        changeMenuBarSelected(target.objType);
        break;
      default:
        changeMenuBarSelected(target.objType);
        break;
    }
  }
  store.dispatch(handleSetCurrentHoverObjectId(target.id));
  // Get Current Font Properties
  menus = setFontforMultiObject(menus, target, canvas); // Font for multiple objects

  store.dispatch(handleChangeFontFamily(canvas.getActiveObject().fontFamily));
  // Get Current Align
  store.dispatch(handleSetCurrentAlign(canvas.getActiveObject().textAlign));

  // Get Lock status
  if (canvas.getActiveObjects().length > 1) {
    let groupLockedStatus = false;
    canvas.getActiveObjects().forEach((r: any) => {
      if (r.locked === true) groupLockedStatus = true;
    });
    store.dispatch(handleSetCurrentLockStatus(groupLockedStatus));
  } else {
    store.dispatch(handleSetCurrentLockStatus(canvas.getActiveObject().locked));
  }

  // Get Opacity Value
  const objectColor = canvas.getActiveObject().fill;
  store.dispatch(
    handleSetOpacityValue(
      objectColor != null
        ? parseInt(
            String(
              objectColor.substring(
                objectColor.lastIndexOf(',') + 1,
                objectColor.length - 1
              ) * 100
            )
          )
        : 0
    )
  );

  // Get Current Menu Position
  const ltPoint = getLTPoint(canvas.getActiveObject(), canvas);
  const brPoint = getBRPoint(canvas.getActiveObject(), canvas);
  const screenWidth = getScreenWidth(canvas);
  const objectHeightonCanvas = brPoint.y - ltPoint.y;
  const left = getMenuPositionLeft(
    canvas,
    target,
    ltPoint.x,
    screenWidth,
    menus.length
  );
  const top = getMenuPositionTop(
    canvas,
    target,
    ltPoint.y,
    objectHeightonCanvas
  );

  // Get Current Menu Status
  if (target.objType === 'WBRectPanel') {
    store.dispatch(
      handleChangeMenuPosition({
        left,
        top: top - 70 - 20 * canvas.getZoom(),
      })
    );
  } else {
    store.dispatch(handleChangeMenuPosition({ left, top: top - 70 }));
  }

  setTimeout(() => {
    store.dispatch(handleWidgetMenuDisplay(true));
    store.dispatch(handleSetWidgetMenuList(menus));
  }, 10);

  // if (target.type && target.type !== 'activeSelection') {
  //   console.log('target.getWidgetMenuLength() of target', target);
  //   console.log('target.getWidgetMenuLength()', target.getWidgetMenuLength());
  //   store.dispatch(handleSetMenuWidth(target.getWidgetMenuLength()));
  // } //custom function
}
