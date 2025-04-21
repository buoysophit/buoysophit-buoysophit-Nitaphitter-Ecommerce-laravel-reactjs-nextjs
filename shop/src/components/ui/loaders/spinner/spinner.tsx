import styles from "./spinner.module.css";
import cn from "classnames";

interface Props {
  className?: string;
  text?: string;
  showText?: boolean;
  simple?: boolean;
}

const Spinner = (props: Props) => {
  const {
    className = "w-6 h-6",
    showText = true,
    text = "Loading...",
    simple,
  } = props;
  return (
    <>
      {simple ? (
        <div className={cn(className, styles.simple_loading)} />
      ) : (
        <div
          className={cn(
            "w-full flex flex-col items-center justify-center",
            className
          )}
          style={{ height: "calc(100vh - 200px)" }}
        >
          <div className={styles.loading} />

          {showText && (
            <h3 className="text-lg font-semibold text-body italic">{text}</h3>
          )}
        </div>
      )}
    </>
  );
};

interface SpinnerPops {
  className?: string;
}

export const SpinnerLoader = (props: SpinnerPops) => {
  const { className } = props;
  return (
    <span
      className={cn(
        'inline-flex h-5 w-5 animate-spin rounded-full border-2 border-t-2 border-transparent border-t-accent',
        className
      )}
    />
  );
};


export default Spinner;
