import { combineReducers } from '@reduxjs/toolkit'
import draw from './draw'
import stickNote from './stickNote'
import line from './line'
import shape from './shape'

const widget = combineReducers({
  stickNote,
  shape,
  draw,
  line
})

export default widget