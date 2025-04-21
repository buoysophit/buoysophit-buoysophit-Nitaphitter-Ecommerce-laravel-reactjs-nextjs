export function Fullscreen(props: React.SVGAttributes<{}>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        {...props}
      >
        <path
          fill="currentColor"
          d="M3 10H1v5h5v-2H3v-3ZM1 6h2V3h3V1H1v5Zm12 7h-3v2h5v-5h-2v3ZM10 1v2h3v3h2V1h-5Z"
        />
      </svg>
    );
  }