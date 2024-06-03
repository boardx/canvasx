import { XShapeNotes } from './index';
import { shapeList } from './types';

// Mock the dependencies
jest.mock('../../../ClassRegistry');
jest.mock('../../../controls');
jest.mock('../../../env');

describe('XShapeNotes', () => {
  let xShapeNotes: XShapeNotes;
  let mockCanvas: any;

  beforeEach(() => {
    // Setup the mock for shapeList
    shapeList.length = 0;
    shapeList.push({
      name: 'testShape',
      path: 'M10 10 H 90 V 90 H 10 L 10 10',
      offsetX: 0,
      offsetY: 0,
      verticalAlign: 'middle',
      textAlign: 'center',
    });

    // Mock canvas
    mockCanvas = {
      uniformScaling: true,
      renderAll: jest.fn(),
      requestRenderAll: jest.fn(),
    };

    xShapeNotes = new XShapeNotes('Test Text', {
      shapeName: 'testShape',
      width: 200,
      height: 200,
      scaleX: 1,
      scaleY: 1,
      id: 'testId',
    });
    xShapeNotes.canvas = mockCanvas;
  });

  it('should initialize with correct properties', () => {
    expect(xShapeNotes.text).toBe('Test Text');
    expect(xShapeNotes.bgShape).toEqual(shapeList[0]);
    expect(xShapeNotes.width).toBe(200);
    expect(xShapeNotes.height).toBe(200);
    expect(xShapeNotes.id).toBe('testId');
    expect(xShapeNotes.verticalAlign).toBe('middle');
    expect(xShapeNotes.textAlign).toBe('center');
  });

  it('should handle scaling correctly', () => {
    const event = { transform: { target: { scaleX: 2, scaleY: 2 } } };
    xShapeNotes.scaleX = 2;
    xShapeNotes.scaleY = 2;
    xShapeNotes.handleScaling(event);
    expect(xShapeNotes.width).toBe(400);
    expect(xShapeNotes.height).toBe(400);
    expect(xShapeNotes.scaleX).toBe(1);
    expect(xShapeNotes.scaleY).toBe(1);
  });

  it('should handle modified event correctly', () => {
    xShapeNotes.handleModified();
    expect(xShapeNotes.canvas?.uniformScaling).toBe(false);
    expect(mockCanvas.renderAll).toHaveBeenCalled();
  });

  it('should return default values correctly', () => {
    const defaults = XShapeNotes.getDefaults();
    expect(defaults.controls).toBeDefined();
    // expect(defaults.cornerColor).toBe('white');
    // expect(defaults.cornerStrokeColor).toBe('gray');
  });

  //   it('should render background correctly', () => {
  //     const ctx = {
  //       save: jest.fn(),
  //       restore: jest.fn(),
  //       fillStyle: '',
  //       strokeStyle: '',
  //       stroke: jest.fn(),
  //       fill: jest.fn(),
  //     };

  //     xShapeNotes.backgroundColor = 'blue';
  //     xShapeNotes.width = 100;
  //     xShapeNotes.height = 100;

  //     xShapeNotes._renderBackground(ctx);
  //     expect(ctx.fillStyle).toBe('blue');
  //     expect(ctx.save).toHaveBeenCalled();
  //     expect(ctx.stroke).toHaveBeenCalled();
  //     expect(ctx.fill).toHaveBeenCalled();
  //     expect(ctx.restore).toHaveBeenCalled();
  //   });

  // Additional tests for other methods can be added here
});
