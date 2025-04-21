import cn from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

type ScrollbarProps = {
  options?: any;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const Scrollbar: React.FC<ScrollbarProps> = ({
  options,
  children,
  style,
  className,
  ...props
}) => {
  return (
    <OverlayScrollbarsComponent
      options={{
        scrollbars: { autoHide: 'scroll' },
        ...(options ? options : {}),
      }}
      className={cn('os-theme-thin', className)}
      style={style}
      defer
      {...props}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
};

export default Scrollbar;
