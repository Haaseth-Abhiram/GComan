import * as React from "react";
import { motion, type Transition } from "framer-motion";

import { cn } from "@/lib/utils";

type HighlightContextValue = {
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  className?: string;
  transition?: Transition;
  hover?: boolean;
  id: string;
};

const HighlightContext = React.createContext<HighlightContextValue | null>(null);

export function useHighlight() {
  return React.useContext(HighlightContext);
}

type HighlightProps = {
  children: React.ReactNode;
  /** Classes for the moving highlight pill (e.g. "bg-accent rounded-lg"). */
  className?: string;
  /** Classes for the wrapping container. */
  containerClassName?: string;
  /** Controlled active item value. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** When true (and uncontrolled), hovering a HighlightItem activates it. */
  hover?: boolean;
  transition?: Transition;
};

export function Highlight({
  children,
  className,
  containerClassName,
  value,
  defaultValue = null,
  onValueChange,
  hover = false,
  transition = { type: "spring", stiffness: 350, damping: 32 },
}: HighlightProps) {
  const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;
  const id = React.useId();

  const setActiveValue = React.useCallback(
    (next: string | null) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const contextValue = React.useMemo<HighlightContextValue>(
    () => ({ activeValue, setActiveValue, className, transition, hover, id }),
    [activeValue, setActiveValue, className, transition, hover, id],
  );

  return (
    <HighlightContext.Provider value={contextValue}>
      <div
        data-slot="highlight"
        className={cn("relative", containerClassName)}
        onPointerLeave={() => {
          if (hover && !isControlled) setActiveValue(null);
        }}
      >
        {children}
      </div>
    </HighlightContext.Provider>
  );
}

type HighlightItemProps = React.ComponentPropsWithRef<"div"> & {
  value?: string;
};

export function HighlightItem({
  value,
  className,
  children,
  onPointerEnter,
  ...props
}: HighlightItemProps) {
  const context = React.useContext(HighlightContext);
  const isActive = !!value && context?.activeValue === value;

  return (
    <div
      data-slot="highlight-item"
      data-value={value}
      className={cn("relative", className)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (context?.hover && value) context.setActiveValue(value);
      }}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId={`highlight-${context?.id}`}
          data-slot="highlight-active"
          className={cn("absolute inset-0 rounded-md bg-accent", context?.className)}
          transition={context?.transition}
        />
      )}
      {children}
    </div>
  );
}
