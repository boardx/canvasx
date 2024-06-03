import { experimental_extendTheme as materialExtendTheme } from '@mui/material/styles';

const materialTheme = materialExtendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#F6649A',
          100: '#F6649A',
          200: '#F6649A',
          300: '#F6649A',
          400: '#F6649A',
          500: '#F21C6B',
          600: '#CA1762',
          700: '#CA1762',
          800: '#CA1762',
          900: '#CA1762',
          A100: '#82b1ff',
          A200: '#448aff',
          A400: '#2979ff',
          A700: '#2962ff',
          main: '#F21D6B',
          light: '#005000',
          dark: '#F21D6B',
          contrastText: '#FFFFFF',
        },
        grey: {
          50: '#fafafa',
          500: '#636B74',
          900: '#f0f0f0',
        },
        // action:{"selectedOpacity":200},
      },
    },
    dark: {
      palette: {
        primary: {
          50: '#F6649A',
          100: '#F6649A',
          200: '#F6649A',
          300: '#F6649A',
          400: '#F6649A',
          500: '#F21C6B',
          600: '#CA1762',
          700: '#CA1762',
          800: '#CA1762',
          900: '#CA1762',
          A100: '#82b1ff',
          A200: '#448aff',
          A400: '#2979ff',
          A700: '#2962ff',
          main: '#F21D6B',
          light: '#0000C3',
          dark: '#F21D6B',
          contrastText: '#FFFFFF',
        },
        grey: {
          50: '#fafafa',
          500: '#636B74',
          900: '#f0f0f0',
        },
        //action:{ "selectedOpacity":200},
      },
    },
  },
});

export default materialTheme;
