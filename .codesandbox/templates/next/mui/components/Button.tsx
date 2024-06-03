import { styled } from '@mui/system';
import Button from '@mui/joy/Button';


const newh6= {
   
  fontFamily: 'sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 16,
  lineHeight: '24px'
};

const shape={
  borderRadius: 4,
  border: 0,
  // border
  newborder: '1px solid #7b61ff',
  // disable border
  disborder: '1px solid rgba(0, 0, 0, 0.32)'
};

export default styled(Button)(({ theme }) => ({
 
  borderRadius: 9,
  width: 'auto',
  border: 0,
   
  height: 48,
  padding: '0 30px',
  boxShadow: 'none',
  
  sizeSmall: {
    height: theme.palette.button.smallHeight,
    borderRadius: theme.palette.button.smallRadius,
    padding: theme.palette.button.smallPadding,
    fontFamily:  newh6.fontFamily,
    fontStyle:  newh6.fontStyle,
    fontWeight:  newh6.fontWeight,
    fontSize:  newh6.fontSize,
    lineHeight:  newh6.lineHeight,
  },
  sizeMedium: {
    height: theme.palette.button.mediumHeight,
    borderRadius: theme.palette.button.mediumRadius,
    padding: theme.palette.button.mediumPadding,
    fontFamily: newh6.fontFamily,
    fontStyle: newh6.fontStyle,
    fontWeight: newh6.fontWeight,
    fontSize: newh6.fontSize,
    lineHeight: newh6.lineHeight,
  },
  sizeLarge: {
    height: theme.palette.button.largeHeight,
    borderRadius: theme.palette.button.largeRadius,
    padding: theme.palette.button.largePadding,
    fontFamily: newh6.fontFamily,
    fontStyle: newh6.fontStyle,
    fontWeight: newh6.fontWeight,
    fontSize: newh6.fontSize,
    lineHeight: newh6.lineHeight,
  },
  
  containedPrimary: {
    boxShadow: 'none',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    '&.Mui-disabled': {
      background: theme.palette.primary.inactive,
      color: theme.palette.primary.textDefault,
    },
    '&:hover': {
      background: '#D50953',
      boxShadow: 'none',
    },
    background: theme.palette.primary.default,
    color: theme.palette.primary.textDefault,
  
    display: 'flex',
  },
  containedSecondary: {
    boxShadow: 'none',
    flexDirection: 'row',
    justifyContent: 'center',
    background: theme.palette.primary.hover,
    color: theme.palette.primary.textDefault,
    display: 'flex',
    '&.Mui-disabled': {
      background: theme.palette.primary.inactive,
      color: theme.palette.primary.textDefault,
    },
    '&:hover': {
      background: '#D50953',
      boxShadow: 'none',
    },
  },
  
  textPrimary: {
    background: theme.palette.primary.textDefault,
    color: theme.palette.primary.default,
  
    display: 'flex',
  
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  
    boxSizing: 'border-box',
    '&.Mui-disabled': {
      color: theme.palette.primary.inactive,
    },
    '&:hover': {
      color: '#D21D6B',
   
    },
  },
  textSecondary: {
    border: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.primary.textDefault,
    color: theme.palette.primary.hover,
    display: 'flex',
    '&.Mui-disabled': {
      color: theme.palette.primary.inactive,
    },
    '&:hover': {
      color: '#D21D6B',
      background: '#FFF',
    },
  },
  
  outlinedPrimary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    background: theme.palette.primary.textDefault,
    color: theme.palette.primary.default,
    border: shape.border,
    '&.Mui-disabled': {
      color: theme.palette.primary.inactive,
      border: shape.disborder,
    },
    '&:hover': {
      background: '#FFE6EF',
      border: shape.border,
    },
  },
  
  outlinedSecondary: {
    boxShadow: 'none',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    background: theme.palette.primary.textDefault,
    color: theme.palette.primary.hover,
    display: 'flex',
    border: shape.border,
    '&.Mui-disabled': {
      color: theme.palette.primary.inactive,
      border: shape.disborder,
    },
    '&:hover': {
      background: '#FFE6EF',
      border: shape.border,
    },
  },
}));