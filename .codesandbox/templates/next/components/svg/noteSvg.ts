const noteSvg =
  "data:image/svg+xml,%3Csvg width='16' height='16' stroke='var(--joy-palette-text-icon)' viewBox='0 0 16 16' fill='yellow' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.6863 0H0.313719C0.1405 0 0 0.1405 0 0.313719V15.6863C0 15.8595 0.1405 16 0.313719 16H11.5815C11.7548 16 16 11.6732 16 11.5V0.313719C16 0.1405 15.8595 0 15.6863 0ZM13.8977 13.5L12.0252 15.3726L15.3725 12.0252L13.8977 13.5ZM11.5815 14.9288V11.5815H14.9288L11.5815 14.9288ZM15.3726 10.954H11.2677C11.0945 10.954 10.954 11.0945 10.954 11.2677V15.3725H0.627437V0.627437H15.3725L15.3726 10.954Z' fill='%23232930'/%3E%3C/svg%3E";

const stickyNoteSvg =
  '%3Csvg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M42 0H0V37L5 42H42V0Z" fill="%23ff0000" /%3E%3Cpath d="M0 37H5V42L0 37Z" fill="%23000000" /%3E%3Cpath d="M0 37H5V42L0 37Z" fill="yellow" fillOpacity="0.2" /%3E%3C/svg%3E';

const Rectangle = (color) => {
  const svgIcon = `<svg
      width="34"
      height="24"
      viewBox="0 0 34 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M34 0H0V19.9999L4.04762 23.9999H34V0Z" fill="${color}" />
      <path d="M0 19.9999H4.04762V23.9999L0 19.9999Z" fill="${color}" />
      <g>
        <path d="M0 20H3.99998V24L0 20Z" fill="#9FA6AD" />
      </g>
    </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svgIcon)}`;
};

const Circle = (color) => {
  const svgIcon = ` <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 12C24 18.6274 18.6274 24 12 24L0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z"
        fill="${color}"
      />
      <path d="M12 24C12 17.3726 6.62742 12 0 12L12 24Z" fill="#9FA6AD" />
    </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svgIcon)}`;
};

const Square = (color) => {
  const svgIcon = `<svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 0H0V19L5 24H24V0Z" fill="${color}" />
      <path d="M0 19H3.42857L5 24L0 19Z" fill="${color}" />
      <g>
        <path d="M0 19H5V24L0 19Z" fill="#9FA6AD" />
      </g>
    </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svgIcon)}`;
};

//导出所有svg
export { noteSvg, stickyNoteSvg, Rectangle, Circle, Square };
