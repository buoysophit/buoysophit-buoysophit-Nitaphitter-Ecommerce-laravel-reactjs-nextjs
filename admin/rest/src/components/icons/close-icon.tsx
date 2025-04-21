export const CloseIcon: React.FC<React.SVGAttributes<{}>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const CloseIconNew: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.466 8.013l6.23-6.23A1.035 1.035 0 1014.23.316L8 6.547 1.77.317A1.036 1.036 0 10.304 1.782l6.23 6.23-6.23 6.23A1.035 1.035 0 101.77 15.71L8 9.479l6.23 6.23a1.034 1.034 0 001.466 0 1.035 1.035 0 000-1.466l-6.23-6.23z"
        fill="currentColor"
      />
    </svg>
  );
};