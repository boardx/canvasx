

/* eslint-disable no-dupe-keys */
import { experimental_extendTheme as extendMaterialTheme, } from '@mui/material/styles';
import { extend } from 'jquery';


let theme = extendMaterialTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#F6649A",
          100: "#F6649A",
          200: "#F6649A",
          300: "#F6649A",
          400: "#F6649A",
          500: "#F21C6B",
          600: "#CA1762",
          700: "#CA1762",
          800: "#CA1762",
          900: "#CA1762",
          A100: "#82b1ff",
          A200: "#448aff",
          A400: "#2979ff",
          A700: "#2962ff",
          main: "#F21D6B",
          light: "#0050C3",
          dark: "#F21D6B",
          contrastText: "#FFFFFF",

          // default



        },
      },
    },
    dark: {
      palette: {
        primary: {
          50: "#F6649A",
          100: "#F6649A",
          200: "#F6649A",
          300: "#F6649A",
          400: "#F6649A",
          500: "#F21C6B",
          600: "#CA1762",
          700: "#CA1762",
          800: "#CA1762",
          900: "#CA1762",
          A100: "#82b1ff",
          A200: "#448aff",
          A400: "#2979ff",
          A700: "#2962ff",
          main: "#F21D6B",
          light: "#0050C3",
          dark: "#F21D6B",
          contrastText: "#FFFFFF",


        },
      },
    },
  },
  components: {
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
    },
  }
})
 

// comppose the global override
theme = extendMaterialTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple!
      },
    },
  },
});

// comppose the component Button
theme = extendMaterialTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // backgroundColor: '#f21d6b',
          borderRadius: 4,
          textTransform: 'capitalize',
          width: 'auto',
          border: 0,
           
          height: 36,
          // padding: '0 30px',
          boxShadow: 'none',
          '&.Mui-disabled': {
            border: '0px',
            // color: theme.palette.primary.inactive,
          },
          '&:hover': {
            background: '#F21D6B',
            boxShadow: 'none',
          },
        },
        textPrimary: {
          background: 'var(--joy-palette-background-surface)',
          // color: theme.palette.primary.default,

          display: 'flex',

          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',

          boxSizing: 'border-box',
          '&.Mui-disabled': {
            // color: theme.palette.primary.inactive,
          },
          '&:hover': {
            color: '#F21D6B',
            background: '#FFF',
          },
        },
      },

      defaultProps: {
        size: 'small',
      },
    },
  },
});

// AvatarGroup
theme = extendMaterialTheme({
  components: {
    MuiAvatarGroup: {
      styleOverrides: {
        root: {},
        avatar: {
          fontSize: 12,
          width: '24px',
          height: '24px',
          sizes: '24px',
        },
      },
    },
  },
});

// MuiSvgIcon
theme = extendMaterialTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: '24px',
          height: '24px',
        },
      },
    },
  },
});

// AppBar
theme = extendMaterialTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          // minHeight: 50,
        },
      },
    },
  },
});

// Dialog
theme = extendMaterialTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: 'var(--joy-shadow-md)',
          borderRadius: '8px',
        },
      },
    },
  },
});

// IconButton
theme = extendMaterialTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'rgba(0,0,0,0.54)',
          width: '44px',
          height: '44px',
          textAlign: 'center',
          // lineHeight: '40px',
          borderRadius: 0,
          '&:hover': {
            color: '#0050C3',
            background: 'rgba(0,0,0,0)',
          },
        },
      },
    },
  },
});

// Link
theme = extendMaterialTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            // color: 'rgba(0, 0, 0, 0.32)',
            color: '#F21D6B',
          },
          '&:hover': {
            // color: '#F21D6B',
            background: '#FFF',
          },
        },
      },
    },
  },
});

// Paper

theme = extendMaterialTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {},
      },
    },
  },
});

// Popover
theme = extendMaterialTheme({
  components: {
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: 'var(--joy-shadow-md)',
          borderRadius: '8px',
          overflow: 'hidden',
        },
      },
    },
  },
});

// Popper
theme = extendMaterialTheme({
  components: {
    MuiPopper: {
      // styleOverrides: {
      //   paper: {
      //     boxShadow: 'var(--joy-shadow-md)',
      //     borderRadius: '4px',
      //     background: 'white',
      //     zIndex: 0,
      //   },
      // },
    },
  },
});

// Textfield
theme = extendMaterialTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '2px',
          // color: theme.palette.secondary.main,
          margin: 'dense',
          '&:focus': {
            // color: theme.palette.secondary.main,
          },
        },
      },
      defaultProps: {
        color: 'secondary',
      },
    },
  },
});

// TottleButton
theme = extendMaterialTheme({
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 0,
          '&:hover': {
            color: '#F21D6B',
            // opacity: 1,
            background: 'rgba(0,0,0,0)',
          },
          '&.Mui-selected': {
            color: '#F21D6B',
            // opacity: 1,
            background: 'rgba(0,0,0,0)',
          },
          '&.Mui-selected:hover': {
            // opacity: 1,
            background: 'rgba(0,0,0,0)',
          },
        },
      },
    },
  },
});

//set the menu item to disableRipple true
theme = extendMaterialTheme({
  components: {
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

//CardMedia
// theme = extendMaterialTheme({
//   components: {
//     MuiCardMedia: {
//       styleOverrides: {
//         root: {
//           backgroundColor: '#F21D6B',
//         }
//       }
//     }
//   }
// })

/*
theme = extendMaterialTheme({
  components:{
    XXXXModule:{
      styleOverrides:{

      }
    }
  }
});
*/
export default theme;
