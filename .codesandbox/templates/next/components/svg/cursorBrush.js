export const getCursorBrush = (color) => {
  // const cursorBrush = `data:image/svg+xml,%3Csvg width='18' height='20' viewBox='0 0 18 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M18 14.66C18 14.41 17.9 14.15 17.71 13.96L15.88 12.13L12.13 15.88L13.96 17.71C14.35 18.1 14.98 18.1 15.37 17.71L17.71 15.37C17.91 15.17 18 14.92 18 14.66ZM11.98 11.06L11.06 11.98L2 2.92V2H2.92L11.98 11.06ZM3.75 0L14.81 11.06L11.06 14.81L0 3.75V0L3.75 0Z' style='fill:${color}'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.98 11.06L11.06 11.98L2.00001 2.92V2H2.92001L11.98 11.06Z' style='fill:white'/%3E%3C/svg%3E`;
  // SVG data URL
  const cursorBrush =
    "data:image/svg+xml;base64," +
    btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
`);
  return cursorBrush;
};
