import React from 'react';
import { styled } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/joy/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  width: any;
  height: any;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, width, height, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ width, height }}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

export function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const AntTabs = styled(Tabs)`
  border-bottom: 1px solid #e8e8e8;

  & .MuiTabs-indicator {
    background-color: #f21d6b;
  }
`;

export const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)`
  text-transform: none;
  min-width: 72px;
  font-weight: ${(props) => 400 };
  margin-right: ${(props) => props.theme.spacing(4)}px;
  color: rgba(0, 0, 0, 0.85);

  &:hover {
    color: #f21d6b;
    opacity: 1;
  }

  &.Mui-selected {
    color: #f21d6b;
    font-weight: ${(props) => 500};
  }

  &:focus {
    color: #f21d6b;
  }
`;

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

interface StyledTabProps {
  label: string;
}
