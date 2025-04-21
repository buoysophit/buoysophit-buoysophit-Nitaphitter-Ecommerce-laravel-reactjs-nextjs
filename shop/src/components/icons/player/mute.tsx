export function Mute(props: React.SVGAttributes<{}>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="none"
        {...props}
      >
        <path
          fill="currentColor"
          d="M9.14 2.055a.54.54 0 0 0-.536.035L3.962 5.208H1.52a.51.51 0 0 0-.52.52v4.884c0 .294.225.52.52.52h2.442l4.642 3.117a.528.528 0 0 0 .727-.138.584.584 0 0 0 .087-.295V2.506a.5.5 0 0 0-.277-.45Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={0.8}
          d="m11.066 10.527 3.394-4M10.854 6.503l4 4"
        />
      </svg>
    );
  }