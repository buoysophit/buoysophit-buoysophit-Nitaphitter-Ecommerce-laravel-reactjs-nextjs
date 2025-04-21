export const ChevronRight: React.FC<React.SVGAttributes<{}>> = (props) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);


export const ChevronRightNew: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.849 5c0 .18-.069.358-.205.495l-4.3 4.3a.7.7 0 11-.99-.99L4.157 5 .354 1.196a.7.7 0 01.99-.99l4.3 4.299A.698.698 0 015.849 5z"
        fill="currentColor"
      />
    </svg>
  );
};