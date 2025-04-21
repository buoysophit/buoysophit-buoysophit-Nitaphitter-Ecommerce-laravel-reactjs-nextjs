import React, {
  MutableRefObject,
  createContext,
  useContext,
  useEffect,
} from 'react';
import {
  ReferenceType,
  Strategy,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';

interface BackToTopProps {
  refs: {
    reference: MutableRefObject<ReferenceType | null>;
    floating: MutableRefObject<HTMLElement | null>;
    setReference: (node: ReferenceType | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };
  x: number;
  y: number;
  strategy: Strategy;
}

// Create a custom context
export const BackToTopContext = createContext<BackToTopProps | undefined>(
  undefined,
);

// Create a custom context provider component
export const BackToTopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { x, y, strategy, update, refs } = useFloating({
    strategy: 'fixed',
    placement: 'left',
    middleware: [offset(30), flip(), shift()],
  });

  // This one is for recalculating the position of the floating element if no space is left on the given placement
  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  return (
    <BackToTopContext.Provider value={{ refs, x, y, strategy }}>
      {children}
    </BackToTopContext.Provider>
  );
};

// Create a custom hook that consumes the back to top context
export const useBackToTop = () => {
  const backToTop = useContext(BackToTopContext);
  if (backToTop === undefined) {
    throw new Error(`useBackToTop must be used within a BackToTopProvider`);
  }
  return backToTop;
};
