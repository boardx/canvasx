export const shapeList = [
  {
    name: 'rect',
    path: 'M-50,-50L50,-50 50,50 -50,50z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
    textMaxHeight: 50,
  },
  {
    name: 'diamond',
    path: 'm-50,0 l50,-50 50,50 -50,50 -50,-50z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'roundedRect',
    path: 'M-50,-35 Q-50,-50 -35,-50 L35,-50 Q50,-50 50,-35 L50,35 Q50,50 35,50 L-35,50 Q-50,50 -50,35 Z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'circle',
    path: 'M-50,0a50,50 0 1,0 100,0a50,50 0 1,0 -100,0',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'hexagon',
    path: 'm-43.476 -25.4636 l 43.476 -24.5364 l 43.7551 25.2641 l 0 50.5157 l -43.7551 24.2202 l -43.7551 -25.2654 l 0 -50.5157 z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'triangle',
    path: 'm-50,50l50,-100l50,100l-100,0z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'bottom',
    textAlign: 'center',
  },
  {
    name: 'parallelogramIcon',
    path: 'm-50,50l20,-100l80,0l-20,100l-80,0z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'star',
    path: 'm-50,-10l38,0l12,-38l12,38l38,0l-30,23l12,38l-30,-24l-30,24l12,-38l-30,-23z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'cross',
    path: 'm-50,-15l33,0l0,-33l34,0l0,33l33,0l0,34l-33,0l0,33l-34,0l0,-33l-33,0l0,-34z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'leftsideRightTriangle',
    path: 'm50,50l-100,0l0,-100l100,100z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'bottom',
    textAlign: 'left',
    textMaxHeight: 50,
  },
  {
    name: 'rightsideRightTriangle',
    path: 'm-50,50l100,0l0,-100l-100,100z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'bottom',
    textAlign: 'right',
    textMaxHeight: 50,
  },
  {
    name: 'topsideSemicircleCircle',
    path: 'm50,25l-100,-0.00205c3.5,-27.5 25,-48 50,-48c25,0 46.5,20.5 50,48z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'topLeftQuarterCircle',
    path: 'm-50,50c7,-55 47,-96 97,-97l0,65l0,32l-97,-0.00392z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'constellationRect',
    path: 'm20,0l25,23l0,24l-100,0l0,-100l100,0l0,23l-25,24l-0.15,0.14l0.15,0.14l-0.00001,0z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  {
    name: 'constellationRound',
    path: 'm20,1c0.002,0.002 0.004,0.004 0.01,0.001c0.007,0.01 0.015,0.02 0.02,0.03l0,0l0.001,0.0004l0.005,0.003l0.04,0.03l0.3,0.2l2.5,2l20,15c-7,15 -23,26 -42,26c-25,0 -45,-20 -45,-45c0,-25 20,-45 45,-45c19,0 35,10 42,25c-11,9 -17,14 -20,16c-1.5,1 -2,1.5 -2.5,2c-0.2,0.15 -0.3,0.2 -0.35,0.3c-0.02,0.02 -0.04,0.04 -0.05,0.06c-0.006,0.01 -0.02,0.03 -0.03,0.06c-0.005,0.015 -0.02,0.04 -0.03,0.07c-0.005,0.015 -0.01,0.04 -0.007,0.07c0.002,0.02 0.007,0.04 0.015,0.06c0.003,0.006 0.006,0.012 0.009,0.018c0.003,0.004 0.006,0.009 0.009,0.014c0.003,0.005 0.009,0.01 0.01,0.015c0.004,0.005 0.01,0.015 0.012,0.017z',
    offsetX: 0,
    offsetY: 0,
    verticalAlign: 'middle',
    textAlign: 'center',
  },
];
export type shapeType =
  | 'rect'
  | 'diamond'
  | 'roundedRect'
  | 'circle'
  | 'hexagon'
  | 'triangle'
  | 'parallelogramIcon'
  | 'star'
  | 'cross'
  | 'leftsideRightTriangle'
  | 'rightsideRightTriangle'
  | 'topsideSemicircleCircle'
  | 'topLeftQuarterCircle'
  | 'constellationRect'
  | 'constellationRound';
