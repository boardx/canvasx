import React from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';


export default ({ ...props }) => {

  return <StyledPopover {...props} {...{ 
    
    paper: css.popupPaper 
    
    }} 
/* 
[`& .${classes.popupPaper}`]: {
    marginTop: '8px',
    boxShadow: 'var(--joy-shadow-md)',
  }
  
  */
  >
  </StyledPopover>;
};
