//**Import React */
import React, { useState } from 'react';


//**Import i18n */
import { useTranslation } from '../../services/i18n/client';

//** Import Redux toolkit
import { useDispatch, useSelector } from 'react-redux';
import store from '../../redux/store';
import { updateContextMenuStatus } from '../../redux/features/contextMenu.slice';
import { changeMode } from '../../redux/features/mode.slice';
// import { useCreateTemplateMutation } from '../../redux/TemplateApiSlice';

//** Import Mui
import { Divider } from '@mui/joy';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/joy/Typography';
import Popover from '@mui/material/Popover';
import Box from '@mui/joy/Box';
import TextField from '@mui/material/TextField';
import Switch from '@mui/joy/Switch';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/joy/Button';
//**Import Service */
import {
  UtilityService,
  FileService
} from '../../services';

//**Import Other */
import download from '../../lib/download';
import _ from 'lodash';
import { handleSetDropdownDisplayed } from '../../store/widgets';

const boardCategoryList = [
  'AI',
  'Featured',
  'Basics',
  'Workshop & Meeting',
  'Project Management',
  'Design Thinking',
  'Strategy & Planning',
  'Lean Manufacturing',
  'Storytelling',
  'Education',
  'Games'
];

const ContextMenu = () => {
  //init useHooks

  const dispatch = useDispatch();
  const { t } = useTranslation("context-menu");

  const orgId = useSelector((state) => state.org.orgInfo.orgId); //org
  const boardId = location.pathname.replace('/board/', '');

  const [saveTemplatePop, setSaveTemplatePop] = useState(false);
  const [templateName, setTemplateName] = useState(null);
  const [description, setDescription] = useState(null);
  const [shareToTeam, setShareToTeam] = useState(false);
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { menuList, position, open, currentObject } = useSelector((state) => state.contextMenu);

  const absolutePoint = useSelector(
    (state) => state.mode.absolutePoint
  );

  // const [createTemplate] = useCreateTemplateMutation();

  const handleClose = () => {
    dispatch(updateContextMenuStatus(false));
  };

  const handleLock = isLocked => {

    if (currentObject && currentObject.isActiveSelection()) {
      lockObject(currentObject, isLocked);
    }

    canvas.discardActiveObject();

    handleClose();

  };

  const handleUnlockAll = () => {

    canvas.discardActiveObject();

    const objects = canvas.getObjects().filter(obj => obj._id !== undefined && obj._id);

    for (const objas of objects) {

      const point0 = Boardx.Util.getPointOnCanvasInGroup(objas);

      const point3 = Boardx.Util.getOnePointOnCanvasInGroup(objas, {
        x: objas.left,
        y: objas.top
      });

      const scalex = objas.scaleX || 1.0;

      const scaley = objas.scaleY || 1.0;

      objas
        .set('lockMovementX', false)
        .set('lockMovementY', false)
        .set('locked', false)
        .set('lockScalingX', false)
        .set('lockScalingY', false)
        .set('lockSkewingX', false)
        .set('lockSkewingY', false)
        .set('lockRotation', false)
        .set('selectable', true)
        .set('editable', true)
        .set('left', (-point0.x + point3.x) / scalex)
        .set('top', (-point0.y + point3.y) / scaley)
        .setCoords();

      if (objas.isPanel || objas.obj_type === 'WBRectPanel') {
        objas.setLockedShadow(false);
      }

    }

    const sel = canvas.getActiveSelection();

    sel.add(...objects);

    canvas.setActiveObject(sel);

    canvas.requestRenderAll();

    sel.saveData('MODIFIED', [
      'left',
      'top',
      'locked',
      'lockMovementX',
      'lockMovementY',
      'selectable',
      'activeSelection',
      'editable',
      'lockScalingX',
      'lockScalingY',
      'lockSkewingX',
      'lockSkewingY',
      'lockRotation',
      'shadow'
    ]);

    handleClose();

  };

  const handleSelectAll = () => {

    canvas.discardActiveObject();

    canvas.selectAllWidgets();

    handleClose();

  };

  const lockObject = (obj, locked) => {
    const cursorLock =
      "data:image/svg+xml,%3Csvg width='10' height='13' viewBox='0 0 10 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.832 0.755L5 0.75C5.70029 0.749965 6.37421 1.01709 6.8843 1.49689C7.39439 1.97669 7.70222 2.63302 7.745 3.332L7.75 3.5V4H8.5C8.89782 4 9.27936 4.15804 9.56066 4.43934C9.84196 4.72064 10 5.10218 10 5.5V11.5C10 11.8978 9.84196 12.2794 9.56066 12.5607C9.27936 12.842 8.89782 13 8.5 13H1.5C1.10218 13 0.720644 12.842 0.43934 12.5607C0.158035 12.2794 0 11.8978 0 11.5V5.5C0 5.10218 0.158035 4.72064 0.43934 4.43934C0.720644 4.15804 1.10218 4 1.5 4H2.25V3.5C2.24997 2.79971 2.51709 2.12579 2.99689 1.6157C3.47669 1.10561 4.13302 0.797781 4.832 0.755L5 0.75L4.832 0.755ZM5 7.5C4.73478 7.5 4.48043 7.60536 4.29289 7.79289C4.10536 7.98043 4 8.23478 4 8.5C4 8.76522 4.10536 9.01957 4.29289 9.20711C4.48043 9.39464 4.73478 9.5 5 9.5C5.26522 9.5 5.51957 9.39464 5.70711 9.20711C5.89464 9.01957 6 8.76522 6 8.5C6 8.23478 5.89464 7.98043 5.70711 7.79289C5.51957 7.60536 5.26522 7.5 5 7.5ZM5.128 2.256L5 2.25C4.69054 2.24986 4.39203 2.36451 4.16223 2.57177C3.93244 2.77903 3.78769 3.06417 3.756 3.372L3.75 3.5V4H6.25V3.5C6.25014 3.19054 6.13549 2.89203 5.92823 2.66223C5.72097 2.43244 5.43583 2.28769 5.128 2.256L5 2.25L5.128 2.256Z' fill='%23232930'/%3E%3C/svg%3E";
    if (!obj) {
      return;
    }
    if (obj.isActiveSelection()) {
      for (const objas of obj._objects) {
        if (locked) {
          objas
            .set('lockMovementX', true)
            .set('lockMovementY', true)
            .set('locked', true)
            .set('lockScalingX', true)
            .set('lockScalingY', true)
            .set('lockSkewingX', true)
            .set('lockSkewingY', true)
            .set('lockRotation', true)
            // .set('selectable', false)
            .set('editable', false);
          if (objas.isPanel || objas.obj_type === 'WBRectPanel') {
            objas.setLockedShadow(true);
          }
        } else {
          objas
            .set('lockMovementX', false)
            .set('lockMovementY', false)
            .set('locked', false)
            .set('lockScalingX', false)
            .set('lockScalingY', false)
            .set('lockSkewingX', false)
            .set('lockSkewingY', false)
            .set('lockRotation', false)
            // .set('selectable', true)
            .set('editable', true);
          if (objas.isPanel || objas.obj_type === 'WBRectPanel') {
            objas.setLockedShadow(false);
          }
        }
      }

      if (locked) {
        obj.hoverCursor = `url("${cursorLock}") 0 0, auto`;
      } else {
        obj.hoverCursor = 'default';
      }
      obj.saveData('MODIFIED', [
        'locked',
        'lockMovementX',
        'lockMovementY',
        'selectable',
        'activeSelection',
        'editable',
        'lockScalingX',
        'lockScalingY',
        'lockSkewingX',
        'lockSkewingY',
        'lockRotation',
        'shadow'
      ]);
    } else if (locked) {
      obj
        .set('lockMovementX', true)
        .set('lockMovementY', true)
        .set('locked', true)
        .set('lockScalingX', true)
        .set('lockScalingY', true)
        .set('lockSkewingX', true)
        .set('lockSkewingY', true)
        .set('lockRotation', true)
        // .set('selectable', false)
        .set('editable', false);
      obj.hoverCursor = `url("${cursorLock}") 0 0, auto`;
      if (obj.isPanel || obj.obj_type === 'WBRectPanel') {
        obj.setLockedShadow(true);
        obj.saveData('MODIFIED', [
          'locked',
          'lockMovementX',
          'lockMovementY',
          'selectable',
          'activeSelection',
          'editable',
          'lockScalingX',
          'lockScalingY',
          'lockSkewingX',
          'lockSkewingY',
          'lockRotation',
          'shadow'
        ]);
      } else {
        obj.saveData('MODIFIED', [
          'locked',
          'lockMovementX',
          'lockMovementY',
          'selectable',
          'activeSelection',
          'editable',
          'lockScalingX',
          'lockScalingY',
          'lockSkewingX',
          'lockSkewingY',
          'lockRotation'
        ]);
      }
    } else {
      obj
        .set('lockMovementX', false)
        .set('lockMovementY', false)
        .set('locked', false)
        .set('lockScalingX', false)
        .set('lockScalingY', false)
        .set('lockSkewingX', false)
        .set('lockSkewingY', false)
        .set('lockRotation', false)
        // .set('selectable', true)
        .set('editable', true);
      obj.hoverCursor = 'default';
      if (obj.isPanel || obj.obj_type === 'WBRectPanel') {
        obj.setLockedShadow(false);
        obj.saveData('MODIFIED', [
          'locked',
          'lockMovementX',
          'lockMovementY',
          'selectable',
          'activeSelection',
          'editable',
          'lockScalingX',
          'lockScalingY',
          'lockSkewingX',
          'lockSkewingY',
          'lockRotation',
          'shadow'
        ]);
      } else {
        obj.saveData('MODIFIED', [
          'locked',
          'lockMovementX',
          'lockMovementY',
          'selectable',
          'activeSelection',
          'editable',
          'lockScalingX',
          'lockScalingY',
          'lockSkewingX',
          'lockSkewingY',
          'lockRotation'
        ]);
      }
    }
    canvas.requestRenderAll();
  };

  const handleOpenImage = () => {
    if (currentObject.src || !currentObject.isUploading) {
      window.open(currentObject.src.split('?')[0], 'blank');
    }
    handleClose();
  };

  const handleGroup = () => {

    if (currentObject.isActiveSelection()) {
      canvas.group(currentObject);
    }

    handleClose();

  };

  const handleUngroup = () => {
    canvas.ungroup(currentObject);
    handleClose();
  };

  const handelCopyAsImage = async () => {
    Boardx.Util.Msg.info(t('board.contextMenu.copyAsImageMessage'));

    if (!canvas.getActiveObject()) return;
    const dataUrl = canvas.getActiveObject().toDataURL();
    let blob = await Boardx.Util.dataURIToBlob(dataUrl);
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
    handleClose();
  };

  const handleCopyAsText = async () => {
    Boardx.Util.Msg.info(t('board.contextMenu.copyAsTextMessage'));

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    let text = '';

    const sortedObjects = activeObjects
      .filter(
        object =>
          object.obj_type === 'WBRectNotes' ||
          object.obj_type === 'WBCircleNotes' ||
          object.obj_type === 'WBShapeNotes' ||
          object.obj_type === 'WBText'
      )
      .sort((a, b) => {
        if (a.top < b.top) return -1;
        else if (a.top > b.top) return 1;
        else {
          if (a.left < b.left) return -1;
          else if (a.left > b.left) return 1;
          return 0;
        }
      });

    sortedObjects.forEach((object, index) => {
      text += object.text;
      if (index !== sortedObjects.length - 1) {
        text += '\n\n';
      }
    });
    await navigator.clipboard.writeText(text);
    handleClose();
  };

  const handleExportBoard = async () => {
    Boardx.Util.Msg.info(t('board.contextMenu.creatingPleaseWait'));
    handleClose();
    setTimeout(async () => {
      let thumbnail = await canvas.toDataURLContent(15);
      await download(thumbnail, store.getState().board.board.name);
      canvas.showBackgroundDots = true;

    }, 1000);

  };

  const handleExportSelectedArea = async () => {
    const dataUrl = canvas
      .getActiveObject()
      .toDataURL(15)
      .replace(/^data:image\/\w+;base64,/, 'data:image/jpg;base64,');
    const boardName = store.getState().board.board.name;

    await download(dataUrl, `${boardName} selected.jpg`);
    canvas.forEachObject(o => o.setCoords());
    canvas.requestRenderAll();
    Boardx.Util.Msg.info(t('board.contextMenu.exportSelectedAreaImg'));
    handleClose();
  };

  const handleBringForward = () => {
    if (currentObject) {
      setTimeout(() => {
        currentObject.bringObjForward();
      }, 0);
    }
    handleClose();
  };
  const handleBringToFront = () => {
    if (currentObject) {
      currentObject.bringObjToFront();
    }
    handleClose();
  };
  const handleSendBackward = () => {
    if (currentObject) {
      setTimeout(() => {
        currentObject.sendObjBackwards();
      }, 0);
    }
    handleClose();
  };
  const handleSendToBack = () => {
    if (currentObject) {
      currentObject.sendObjToBack();
    }
    handleClose();
  };

  const handleCopy = () => {
    document.execCommand('copy');
    handleClose();
  };

  const handlePaste = () => {
    if (navigator.userAgent.match(/Macintosh/)) {
      Boardx.Util.Msg.info(t('board.contextMenu.pastviaMacShortcut'));
    } else {
      Boardx.Util.Msg.info(t('board.contextMenu.pastviaWinShortcut'));
    }
    handleClose();
  };

  const handleCut = () => {
    document.execCommand('cut');
    handleClose();
  };

  const handleBlur = e => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = e => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const handleEdit = () => {
    handleClose();
    if (currentObject && currentObject.isEditing) return;

    if (currentObject && currentObject.enterEditing) {
      currentObject.isEditing = false;
      currentObject.dirty = true;
      currentObject.enterEditing();
      canvas.requestRenderAll();
    }
  };

  const handleDelete = () => {
    if (currentObject) {
      if (currentObject.isPanel) {
        canvas.deleteBindingPanel(currentObject);
      } else {
        canvas.removeWidget(currentObject);
      }
    }
    handleClose();
  };

  const handleSwitchPanelType = isPanel => {
    if (currentObject) {
      currentObject.set('isPanel', isPanel);
    }
    if (currentObject.isActiveSelection()) {
      _.each(currentObject._objects, obj => {
        obj.set('isPanel', isPanel);
      });
    }
    currentObject.saveData('MODIFIED', ['isPanel']);
    handleClose();
  };

  const handleDuplicate = () => {

    // todo: this will be select duplicate to bottom or right place.
    const direction = 'right';
    canvas.duplicateWidget(direction);

    handleClose();
  };
  const handleCloseTemplatePop = () => {
    setSaveTemplatePop(false);
    setDescription(null);
    setTemplateName(null);
    setSelectedCategoryList([]);
    setShareToTeam(false);
    dispatch(changeMode('default'));
  };
  const handleShareToTeam = (event) => {
    setShareToTeam(event.target.checked);
  };
  //保存所选区域到模板
  const handleOpenSaveTemplate = () => {
    setSaveTemplatePop(true);
    dispatch(updateContextMenuStatus(false));
    // dispatch(changeMode('createTemplate'));
  };
  const getWidgetIds = objs => {
    let arr = [];
    if (objs && objs.length > 0) {
      objs.map(item => {
        arr.push(item._id);
      });
    }
    return arr;
  };

  const handleSaveTemplate = async () => {
    setLoading(true);
    let objects = null;
    let onlyMe = shareToTeam ? 2 : 1;
    if (canvas.getActiveObject()) {


      if (canvas.getActiveObject() && canvas.getActiveObject()._objects) {
        //选中多个objects
        objects = canvas.getActiveObject()._objects;
      }
      if (
        canvas.getActiveObject() &&
        !canvas.getActiveObject()._objects &&
        canvas.getActiveObject()._id
      ) {
        //选中多个objects
        objects = canvas.getActiveObject();
      }
    }
    //if (!objects) {
    //未选中指定objects，选择整个board内容作为template
    // const data = {
    //boardId: boardId,
    //boardName: templateName,
    //onlyMe: onlyMe,
    //orgId: orgId,
    //description: description,
    //thumbnail: thumbnail
    //}
    //WidgetService.getInstance().createTemplate(data, 'allBoard', (error, result) => {
    //handleCloseTemplatePop();
    //Boardx.Util.Msg.info(t('board.contextMenu.createdTemplate'));

    //});
    //}
    //else {
    let key;
    //选中指定objects作为template widgets
    const widgetIds = getWidgetIds(objects);
    //封面设置
    canvas.showBackgroundDots = false;
    canvas.backgroundColor = "#fff";
    canvas.requestRenderAll();
    const imageData = canvas.getActiveObject().toDataURL(8)
    const bolb = Boardx.Util.dataURIToBlob(imageData);
    if (!bolb.name) {
      let fileName = Date.now();
      bolb.name = fileName + '.png'
    };
    let board = store.getState().board.board;
    let r2UploadPath =
      UtilityService.getInstance().getr2UploadPath(board);
    key = await FileService.getInstance().uploadFileToR2inBoard(r2UploadPath, bolb, {
      progress(e) {

      }
    });
    const thumbnail = key;
    const data = {
      boardId: boardId,
      boardName: templateName,
      onlyMe: onlyMe,
      orgId: orgId,
      widget: widgetIds,
      description: description,
      thumbnail: thumbnail,
      tags: selectedCategoryList
    };

    await createTemplate({ data: data, type: 'onlyWidgets' });
    setLoading(false);
    handleCloseTemplatePop();
    Boardx.Util.Msg.info(t('board.contextMenu.createdTemplate'));

  };

  const handleSetTemplateName = e => {
    e.preventDefault();
    e.stopPropagation();
    setTemplateName(e.target.value);
  };

  const handleSetTemplateDes = e => {
    e.preventDefault();
    e.stopPropagation();
    setDescription(e.target.value);
  };

  const templateNameHeader = {
    width: '100%',
    textAlign: 'left',
    padding: '24px 32px 0 32px'
  };

  const templateNameTitle = {

    fontSize: '16px',
    width: '360px',
    marginBottom: '24px'
  };

  return (
    <Box>
      <Menu
        anchorPosition={{ top: absolutePoint.y, left: absolutePoint.x }}
        anchorReference="anchorPosition"
        id="contextMenu"
        keepMounted
        onBlur={handleBlur}
        onClose={handleClose}
        onFocus={handleFocus}
        open={open}
      >
        {menuList.includes('Lock') ? (
          <MenuItem onClick={() => handleLock(true)} selected={false}>
            {t('board.contextMenu.lock')}
          </MenuItem>
        ) : null}
        {menuList.includes('Lock All') ? (
          <MenuItem onClick={() => handleLock(true)} selected={false}>
            {t('board.contextMenu.lockAll')}
          </MenuItem>
        ) : null}
        {menuList.includes('Select All') ? (
          <MenuItem onClick={() => handleSelectAll()} selected={false}>
            {t('board.contextMenu.selectAll')}
          </MenuItem>
        ) : null}
        {menuList.includes('Unlock') ? (
          <MenuItem onClick={() => handleLock(false)} selected={false}>
            {t('board.contextMenu.unlock')}
          </MenuItem>
        ) : null}
        {menuList.includes('Unlock All') ? (
          <MenuItem onClick={() => handleUnlockAll()} selected={false}>
            {t('board.contextMenu.unlockAll')}
          </MenuItem>
        ) : null}
        {menuList.includes('Select All') && menuList.includes('Unlock All') ? (
          <Divider />
        ) : null}
        {menuList.includes('Open image') ? (
          <MenuItem onClick={handleOpenImage}>
            {t('board.contextMenu.openImage')}
          </MenuItem>
        ) : null}
        {menuList.includes('Group') ? (
          <MenuItem onClick={handleGroup}>
            {t('board.contextMenu.group')}
          </MenuItem>
        ) : null}
        {menuList.includes('Ungroup') ? (
          <MenuItem onClick={handleUngroup}>
            {t('board.contextMenu.ungroup')}
          </MenuItem>
        ) : null}
        {menuList.includes('Export board') ? (
          <MenuItem onClick={handleExportBoard}>
            {t('board.contextMenu.exportBoard')}
          </MenuItem>
        ) : null}
        {menuList.includes('Exporting selected area') ? (
          <MenuItem onClick={handleExportSelectedArea}>
            {t('board.contextMenu.exportSelectedArea')}
          </MenuItem>
        ) : null}
        {/* {menuList.includes('Create share back') ? (
          <MenuItem onClick={handleCreateShareBack}>
            {t('board.contextMenu.createShareback')}
          </MenuItem>
        ) : null} */}
        {menuList.includes('Create share back') &&
          (menuList.includes('Lock') || menuList.includes('Lock All')) ? (
          <Divider />
        ) : null}
        {menuList.includes('Bring forward') ? (
          <MenuItem onClick={handleBringForward}>
            {t('board.contextMenu.bringForward')}
          </MenuItem>
        ) : null}
        {menuList.includes('Bring to front') ? (
          <MenuItem onClick={handleBringToFront}>
            {t('board.contextMenu.bringtoFront')}
          </MenuItem>
        ) : null}
        {menuList.includes('Send backward') ? (
          <MenuItem onClick={handleSendBackward}>
            {t('board.contextMenu.sendBackward')}
          </MenuItem>
        ) : null}
        {menuList.includes('Send to back') ? (
          <MenuItem onClick={handleSendToBack}>
            {t('board.contextMenu.sendtoBack')}
          </MenuItem>
        ) : null}
        {menuList.includes('Send to back') &&
          (menuList.includes('Lock') || menuList.includes('Lock All')) ? (
          <Divider />
        ) : null}
        {menuList.includes('Duplicate') ? (
          <MenuItem onClick={handleDuplicate}>
            {t('board.duplicate')}
          </MenuItem>
        ) : null}
        {menuList.includes('Copy') ? (
          <MenuItem onClick={handleCopy}>{t('board.copy')}</MenuItem>
        ) : null}
        {menuList.includes('Copy as image') ? (
          <MenuItem onClick={handelCopyAsImage}>
            {t('board.contextMenu.copyAsImage')}
          </MenuItem>
        ) : null}
        {menuList.includes('Copy As Text') ? (
          <MenuItem onClick={handleCopyAsText}>
            {t('board.contextMenu.copyAsText')}
          </MenuItem>
        ) : null}
        {menuList.includes('Paste') ? (
          <MenuItem onClick={handlePaste}>{t('board.paste')}</MenuItem>
        ) : null}
        {menuList.includes('Cut') ? (
          <MenuItem onClick={handleCut}>{t('board.cut')}</MenuItem>
        ) : null}
        {menuList.includes('Edit') ? (
          <MenuItem onClick={handleEdit}>{t('board.edit')}</MenuItem>
        ) : null}
        {menuList.includes('Delete') ? (
          <MenuItem onClick={handleDelete}>{t('board.delete')}</MenuItem>
        ) : null}
        {menuList.includes('Switch to panel') ? (
          <MenuItem onClick={() => handleSwitchPanelType(true)}>
            {t('board.contextMenu.switchtoPanel')}
          </MenuItem>
        ) : null}
        {menuList.includes('Switch to non-panel') ? (
          <MenuItem onClick={() => handleSwitchPanelType(false)}>
            {t('board.contextMenu.switchtoNonPanel')}
          </MenuItem>
        ) : null}
        {menuList.includes('Save as template') ? (
          <MenuItem onClick={() => handleOpenSaveTemplate()}>
            {t('board.contextMenu.saveAsTemplate')}
          </MenuItem>
        ) : null}
      </Menu>
      {/* <ShareBackUI /> */}

      <Popover
        anchorPosition={{ top: absolutePoint.y, left: absolutePoint.x }}
        anchorReference="anchorPosition"
        id="templatePop"
        onClose={handleCloseTemplatePop}
        open={saveTemplatePop}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '32px 32px 0 32px',
          justifyContent: 'space-between',
          width: '480px'
        }}>
          <Typography sx={{

            fontSize: '28px'
          }}>
            {t('board.contextMenu.saveAsTemplate')}
          </Typography>
          <svg
            onClick={handleCloseTemplatePop}

            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3 0.709971C12.91 0.319971 12.28 0.319971 11.89 0.709971L7 5.58997L2.11 0.699971C1.72 0.309971 1.09 0.309971 0.700001 0.699971C0.310001 1.08997 0.310001 1.71997 0.700001 2.10997L5.59 6.99997L0.700001 11.89C0.310001 12.28 0.310001 12.91 0.700001 13.3C1.09 13.69 1.72 13.69 2.11 13.3L7 8.40997L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L8.41 6.99997L13.3 2.10997C13.68 1.72997 13.68 1.08997 13.3 0.709971Z"
              fill="#232930"
            />
          </svg>
        </Box>
        <Box sx={templateNameHeader}>
          <Typography sx={templateNameTitle}>
            {t('board.contextMenu.saveAsTemplate')}
          </Typography>
          <TextField
            id="templateNameInput"
            style={{
              height: '40px',
              fontSize: '12px',
              width: '320px'
            }}
            type="text"
            onChange={handleSetTemplateName}
          />
        </Box>
        <Box
          sx={templateNameHeader}
          style={{ marginTop: '24px' }}
        >
          <Typography sx={templateNameTitle}>
            {t('board.contextMenu.templateDescription')}
          </Typography>
          <TextField
            id="templateDesInput"
            style={{
              fontSize: '12px',
              width: '320px'
            }}
            multiline={true}
            rows={4}
            type="text"
            onChange={handleSetTemplateDes}
          />
        </Box>
        <Box
          sx={templateNameHeader}
          style={{ marginTop: '24px' }}
        >
          <Typography sx={templateNameTitle}>
            {t('components.board.setCategory')}
          </Typography>
          <Autocomplete
            id="tags-outlined"
            multiple
            options={boardCategoryList.map(option => option)}
            getOptionLabel={option => option}
            filterSelectedOptions
            onChange={(event, value) => {
              setSelectedCategoryList(value);
            }}
            value={selectedCategoryList}
            sx={{
              '.autocompleteRoot': {
                width: '450px'
              },
              '.autocompleteInputRoot': {
                minHeight: '45px',
                padding: '0px !important'
              },

              '.autocompleteInput': { paddingLeft: '15px !important' },


              '.autocompleteEndAdornment': { top: 'unset !important' }
            }}
            classes={{
              root: 'autocompleteRoot',
              inputRoot: 'autocompleteInputRoot',
              input: 'autocompleteInput',
              focused: 'autocompleteFocused',
              endAdornment: 'autocompleteEndAdornment'
            }}
            renderInput={params => (
              <TextField
                onBlur={event => {
                  if (event.target.value.trim() !== '') {
                    setSelectedCategoryList([
                      ...selectedCategoryList,
                      event.target.value
                    ]);
                  }
                }}
                {...params}
                placeholder="Category"
              />
            )}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '32px 32px 0 32px'
          }}
          style={{ marginTop: '24px' }}
        >
          <Switch checked={shareToTeam} onChange={handleShareToTeam} />
          <Typography sx={{

            fontSize: '16px'
          }}>
            {t('board.contextMenu.shareTemplate')}
          </Typography>
        </Box>
        <Box sx={{
          textAlign: 'right',
          padding: '32px 32px 32px 0px', marginTop: '24px'
        }}>
          <Button
            loading={loading}
            onClick={handleSaveTemplate}
            sx={{ fontSize: '12px' }}
            variant="solid"
            size="sm"
          >
            {t('board.contextMenu.createTemplate')}
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default ContextMenu;
