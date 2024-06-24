import { read, utils } from 'xlsx';
import { BaseAdapter } from './BaseAdapter';
import * as fabric from '../../../../../../fabric';

export class SpreadsheetAdapter extends BaseAdapter {
  handleCopy(data: any): Promise<any> {
    return Promise.resolve(data);
  }
  async handlePaste(data: any, canvas: any): Promise<any> {
    const matrix = await this.textToMatrixArray(data.content);
    const result = await this.placeStickyNotes(matrix, canvas);
    return result;
  }
  canHandle(sourceType: string): boolean {
    return sourceType === 'spreadsheet';
  }

  async convert(file: File): Promise<any> {
    const data = await file.arrayBuffer();
    const workbook = read(data);

    // Assuming we want to convert the first sheet to JSON
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    return this.transformToBoardXFormat(jsonData);
  }

  private transformToBoardXFormat(data: any[]): any {
    // Transform data to fit BoardX internal structures
    // Custom transformation logic here
    return data;
  }

  // A function to place sticky notes on the canvas based on the matrix array
  placeStickyNotes(matrixArray: any, canvas: any) {
    const noteWidth = 230;
    const noteHeight = 138;
    const centerOFViewPort = canvas.getVpCenter();
    const addedNotes: any = [];

    const margin = 20;
    let currentTop = margin + centerOFViewPort.y;

    matrixArray.forEach(async (row: any, rowIndex: number) => {
      let currentLeft = centerOFViewPort.x + margin;
      row.forEach(async (cell: any, colIndex: number) => {
        currentLeft += noteWidth + margin;
        const newNoteOption = {
          left: currentLeft,
          top: currentTop,
          originX: 'center',
          originY: 'center',
          text: cell,
          objType: 'XRectNotes',
          backgroundColor: 'yellow',
          id: Math.random().toString(36).substr(2, 9),
        };
        const newNote = await canvas.createWidgetAsync(newNoteOption);
        canvas.add(newNote);
        addedNotes.push(newNote);
      });
      currentTop += noteHeight + margin;
    });

    setTimeout(() => {
      const newSelection = new fabric.ActiveSelection(addedNotes, {
        canvas: canvas,
      });
      canvas.setActiveObject(newSelection);
      newSelection.setCoords();

      canvas.renderAll();
    }, 200);
    // Create a new active selection from the added notes
  }

  textToMatrixArray(text: string) {
    const rows = text.split('\n');
    const matrix: any = [];
    let currentRow: any = [];

    rows.forEach((row: any, rowIndex: number) => {
      const cells = row.split('\t');
      cells.forEach((cell: any, cellIndex: number) => {
        // This condition checks if the cell contains an opening quote without a closing one, indicating a multiline cell
        if (
          cell.startsWith('"') &&
          (!cell.endsWith('"') || cell.endsWith('"\\"'))
        ) {
          let multilineCell = cell;
          // Keep looking at the next rows until we find the closing quote
          for (let i = rowIndex + 1; i < rows.length; i++) {
            multilineCell += '\n' + rows[i];
            // If we find the closing quote, we stop
            if (rows[i].endsWith('"') && !rows[i].endsWith('"\\"')) {
              rowIndex = i;
              break;
            }
          }
          currentRow.push(
            multilineCell.replace(/(^"|"$)/g, '').replace(/\\n/g, '\n')
          );
        } else {
          currentRow.push(cell);
        }
      });
      matrix.push(currentRow);
      currentRow = [];
    });

    return matrix;
  }
}
