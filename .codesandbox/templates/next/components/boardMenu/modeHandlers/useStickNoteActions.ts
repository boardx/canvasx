//**Fabric */

//**Redux store */
import store from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { changeMode } from '../../../redux/features/mode.slice';
import {
  getStickNoteOptions,
  updateStickyNoteMenuBarOpenStatus,
} from '../../../redux/features/widget/stickNote';
import { handleSetMenuFontWeight } from '../../../redux/features/widgets.slice';

//**Services */
import { WidgetService } from '../../../services';

//**Utils */
import useCommonActions from './useCommonActions';
import { stickyNoteSvg } from '../../svg/noteSvg';
import { BoardService } from '../../../services';
import { XCircleNotes } from '../../../../../../fabric';
import { XRectNotes } from '../../../../../../fabric';

const cursorNote = stickyNoteSvg;

const useStickNoteActions = () => {
  const canvas: any = BoardService.getInstance().getBoard();
  // retrieve common actions
  const { handleCommonBefore, handleCommonAfter } = useCommonActions();

  // hook to allow dispatching actions
  const dispatch = useDispatch();

  // action handler for actions that occur before a sticky note is handled
  const handleStickNoteBefore = () => {
    // handles common actions that need to be taken before the main action
    handleCommonBefore();
    if (!canvas) return;

    // setting custom cursors for the canvas when hovering and default
    canvas.hoverCursor = `url("${cursorNote}") 0 0, auto`;

    canvas.defaultCursor = `url("${cursorNote}") 0 0, auto`;

    // disabling selection on the canvas
    canvas.selection = false;

    // forcing canvas to re-render
    canvas.requestRenderAll();
  };

  // action handler for actions that occur after a sticky note is handled
  const handleStickNoteAfter = () => {
    console.log('stick note after');

    // handle common actions that occur after the main action
    handleCommonAfter();
  };

  // action handler for mouseup event on a sticky note
  const handleStickNoteMouseUp = (e: any) => {
    // retrieving noteType and backgroundColor from the store
    const noteType = store.getState().widget.stickNote.noteType;

    const backgroundColor = store.getState().widget.stickNote.backgroundColor;

    // getting options for the sticky note based on noteType and backgroundColor
    const options = getStickNoteOptions(
      noteType,
      backgroundColor,
      e.scenePoint
    );

    // creating the widget
    const widget: any =
      options.noteType === 'circle'
        ? new XCircleNotes('', options)
        : new XRectNotes('', options);

    // add the created widget to canvas and setting it as the active object
    canvas.add(widget);

    canvas.setActiveObject(widget);

    // forcing re-render of the canvas
    canvas.requestRenderAll();

    // check if the note was created by AI or user
    if (widget.lastEditedBy === 'AI') {
      widget.author = 'AI';
    }

    // set the menu font-weight to normal (400)
    store.dispatch(handleSetMenuFontWeight('400'));

    // inserting widget into the database
    WidgetService.getInstance().insertWidget(widget.getObject());

    // // pushing a new state to the canvas
    // canvas.pushNewState([
    //   {
    //     targetId: widget.id,
    //     activeselection: true,
    //     newState: widget.getObject(),
    //     action: 'ADDED',
    //   },
    // ]);

    // changes the mode to 'default' and closes the sticky note menu bar
    dispatch(changeMode('default'));

    dispatch(updateStickyNoteMenuBarOpenStatus(false));
  };

  return {
    handleStickNoteAfter,
    handleStickNoteBefore,
    handleStickNoteMouseUp,
  };
};

export default useStickNoteActions;
