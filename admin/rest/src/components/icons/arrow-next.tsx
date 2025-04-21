export const ArrowNext = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="20"
      {...props}
    >
      <path
        d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  );
};

export const ArrowNextNew: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.599 9.085l-5 5.833a1.665 1.665 0 01-2.35.18 1.667 1.667 0 01-.181-2.35l2.642-3.081H1.667a1.667 1.667 0 010-3.334H14.71l-2.642-3.082a1.667 1.667 0 012.53-2.17l5 5.834a1.667 1.667 0 010 2.17z"
        fill="currentColor"
      />
    </svg>
  );
};