import * as React from "react";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Highlight,
  HighlightItem,
} from "@/components/unlumen-ui/primitives/effects/highlight";

type Spring = {
  type: "spring";
  stiffness?: number;
  damping?: number;
  bounce: number;
};

type ContentRecord = {
  children: React.ReactNode;
  className?: string;
  highlightClassName?: string;
  innerClassName?: string;
};

type MotionNavigationMenuContextValue = {
  activeValue: string;
  direction: number;
  spring: Spring;
  viewport: boolean;
  viewportX: number | null;
  openValue: (value: string) => void;
  closeMenu: () => void;
  registerContent: (value: string, content: ContentRecord) => () => void;
  updateViewportPosition: () => void;
};

type MotionNavigationMenuItemContextValue = {
  value?: string;
};

const MotionNavigationMenuContext =
  React.createContext<MotionNavigationMenuContextValue | null>(null);

const MotionNavigationMenuItemContext =
  React.createContext<MotionNavigationMenuItemContextValue | null>(null);

const contentVariants = {
  initial: (direction: number) => ({ x: `${100 * direction}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: `${-100 * direction}%`, opacity: 0 }),
};

type MotionNavigationMenuProps = Omit<
  React.ComponentPropsWithRef<"nav">,
  "onValueChange"
> & {
  viewport?: boolean;
  viewportClassName?: string;
  springBounce?: number;
  springStiffness?: number;
  springDamping?: number;
  value?: string;
  onValueChange?: (value: string) => void;
};

function MotionNavigationMenu({
  className,
  children,
  viewport = true,
  viewportClassName,
  springBounce = 0,
  springStiffness = 350,
  springDamping = 32,
  value,
  onValueChange,
  onPointerLeave,
  onKeyDown,
  ref,
  ...props
}: MotionNavigationMenuProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const lastActiveValueRef = React.useRef(value ?? "");
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState("");
  const [direction, setDirection] = React.useState(1);
  const [viewportX, setViewportX] = React.useState<number | null>(null);
  const [contentByValue, setContentByValue] = React.useState<
    Record<string, ContentRecord>
  >({});

  const activeValue = value ?? internalValue;

  const spring = React.useMemo<Spring>(
    () => ({
      type: "spring" as const,
      bounce: springBounce,
      stiffness: springStiffness,
      damping: springDamping,
    }),
    [springBounce, springStiffness, springDamping],
  );

  const getItemValues = React.useCallback(() => {
    const root = rootRef.current;

    if (!root) {
      return [];
    }

    return Array.from(
      root.querySelectorAll<HTMLElement>(
        '[data-slot="navigation-menu-item"][data-value]',
      ),
      (item) => item.dataset.value ?? "",
    ).filter(Boolean);
  }, []);

  const updateViewportPosition = React.useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const activeTrigger = root.querySelector(
        '[data-slot="navigation-menu-trigger"][data-state="open"]',
      );

      if (!activeTrigger) {
        setViewportX(rootRect.width / 2);
        return;
      }

      const triggerRect = activeTrigger.getBoundingClientRect();
      const idealX = triggerRect.left - rootRect.left + triggerRect.width / 2;

      const measureEl = root.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-measure"]',
      );
      const viewportEl = root.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-viewport"]',
      );
      const contentWidth =
        (measureEl ? measureEl.offsetWidth : 0) ||
        (viewportEl ? viewportEl.offsetWidth : 0);
      const half = contentWidth / 2;

      if (contentWidth > 0) {
        // Find the nearest clipping ancestor to use as the boundary
        let boundary: DOMRect | null = null;
        let ancestor = root.parentElement;
        while (ancestor && ancestor !== document.body) {
          const style = window.getComputedStyle(ancestor);
          const overflow = style.overflow + style.overflowX;
          if (/hidden|clip|scroll|auto/.test(overflow)) {
            boundary = ancestor.getBoundingClientRect();
            break;
          }
          ancestor = ancestor.parentElement;
        }
        if (!boundary) {
          boundary = document.documentElement.getBoundingClientRect();
        }

        const margin = 8;
        const dropLeft = rootRect.left + idealX - half;
        const dropRight = rootRect.left + idealX + half;

        let adjustment = 0;
        if (dropLeft < boundary.left + margin) {
          adjustment = boundary.left + margin - dropLeft;
        } else if (dropRight > boundary.right - margin) {
          adjustment = boundary.right - margin - dropRight;
        }

        setViewportX(idealX + adjustment);
      } else {
        setViewportX(idealX);
      }
    });
  }, []);

  const setRootRef = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [ref],
  );

  const setActiveValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const openValue = React.useCallback(
    (nextValue: string) => {
      if (!nextValue || nextValue === lastActiveValueRef.current) {
        return;
      }

      const itemValues = getItemValues();
      const previousIndex = itemValues.indexOf(lastActiveValueRef.current);
      const nextIndex = itemValues.indexOf(nextValue);

      if (previousIndex !== -1 && nextIndex !== -1) {
        setDirection(nextIndex > previousIndex ? 1 : -1);
      }

      lastActiveValueRef.current = nextValue;
      setActiveValue(nextValue);
      updateViewportPosition();
    },
    [getItemValues, setActiveValue, updateViewportPosition],
  );

  const closeMenu = React.useCallback(() => {
    lastActiveValueRef.current = "";
    setActiveValue("");
    updateViewportPosition();
  }, [setActiveValue, updateViewportPosition]);

  const registerContent = React.useCallback(
    (value: string, content: ContentRecord) => {
      setContentByValue((current) => {
        const previous = current[value];

        if (
          previous?.children === content.children &&
          previous?.className === content.className &&
          previous?.innerClassName === content.innerClassName
        ) {
          return current;
        }

        return { ...current, [value]: content };
      });

      return () => {
        setContentByValue((current) => {
          if (!current[value]) {
            return current;
          }

          const next = { ...current };
          delete next[value];
          return next;
        });
      };
    },
    [],
  );

  React.useEffect(() => {
    if (value === undefined) {
      return;
    }

    if (!value) {
      lastActiveValueRef.current = "";
      return;
    }

    openValue(value);
  }, [openValue, value]);

  React.useLayoutEffect(() => {
    updateViewportPosition();
  }, [activeValue, updateViewportPosition]);

  React.useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || typeof ResizeObserver === "undefined") {
      return () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }

    const observer = new ResizeObserver(updateViewportPosition);
    observer.observe(root);

    return () => {
      observer.disconnect();

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [updateViewportPosition]);

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeMenu]);

  const contextValue = React.useMemo<MotionNavigationMenuContextValue>(
    () => ({
      activeValue,
      direction,
      spring,
      viewport,
      viewportX,
      openValue,
      closeMenu,
      registerContent,
      updateViewportPosition,
    }),
    [
      activeValue,
      closeMenu,
      direction,
      openValue,
      registerContent,
      spring,
      updateViewportPosition,
      viewport,
      viewportX,
    ],
  );

  return (
    <MotionNavigationMenuContext.Provider value={contextValue}>
      <nav
        ref={setRootRef}
        data-slot="navigation-menu"
        className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          closeMenu();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.key === "Escape") {
            closeMenu();
          }
        }}
        {...props}
      >
        {children}
        {viewport && (
          <MotionNavigationMenuViewport
            className={viewportClassName}
            contentByValue={contentByValue}
          />
        )}
      </nav>
    </MotionNavigationMenuContext.Provider>
  );
}

function MotionNavigationMenuList({
  className,
  highlightClassName,
  ...props
}: React.ComponentPropsWithRef<"ul"> & {
  highlightClassName?: string;
}) {
  const context = React.useContext(MotionNavigationMenuContext);

  return (
    <Highlight
      value={context?.activeValue || null}
      transition={context?.spring}
      className={highlightClassName}
      containerClassName="contents"
    >
      <ul
        data-slot="navigation-menu-list"
        className={cn(
          "group flex flex-1 list-none items-center justify-center gap-1",
          className,
        )}
        {...props}
      />
    </Highlight>
  );
}

function MotionNavigationMenuItem({
  className,
  value,
  ...props
}: React.ComponentPropsWithRef<"li"> & {
  value?: string;
}) {
  const itemContextValue = React.useMemo(() => ({ value }), [value]);

  return (
    <MotionNavigationMenuItemContext.Provider value={itemContextValue}>
      <HighlightItem value={value} className="relative">
        <li
          data-slot="navigation-menu-item"
          data-value={value}
          className={cn("relative", className)}
          {...props}
        />
      </HighlightItem>
    </MotionNavigationMenuItemContext.Provider>
  );
}

const motionNavigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium hover:text-accent-foreground focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground focus-visible:ring-ring/50 outline-none transition-colors focus-visible:ring-[3px] focus-visible:outline-1",
);

function MotionNavigationMenuTrigger({
  className,
  children,
  onPointerEnter,
  onFocus,
  onClick,
  ...props
}: React.ComponentPropsWithRef<"button">) {
  const context = React.useContext(MotionNavigationMenuContext);
  const itemContext = React.useContext(MotionNavigationMenuItemContext);
  const value = itemContext?.value;
  const isOpen = !!value && context?.activeValue === value;

  return (
    <button
      type="button"
      data-slot="navigation-menu-trigger"
      data-state={isOpen ? "open" : "closed"}
      aria-expanded={isOpen}
      className={cn(motionNavigationMenuTriggerStyle(), className)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);

        if (value) {
          context?.openValue(value);
        }
      }}
      onFocus={(event) => {
        onFocus?.(event);

        if (value) {
          context?.openValue(value);
        }
      }}
      onClick={(event) => {
        onClick?.(event);

        if (value) {
          if (isOpen) {
            context?.closeMenu();
          } else {
            context?.openValue(value);
          }
        }
      }}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </button>
  );
}

function MotionNavigationMenuContent({
  className,
  highlightClassName,
  innerClassName,
  children,
}: React.ComponentPropsWithRef<"div"> & {
  highlightClassName?: string;
  innerClassName?: string;
}) {
  const context = React.useContext(MotionNavigationMenuContext);
  const itemContext = React.useContext(MotionNavigationMenuItemContext);
  const value = itemContext?.value;
  const isOpen = !!value && context?.activeValue === value;

  React.useLayoutEffect(() => {
    if (!context || !value || !context.viewport) {
      return;
    }

    return context.registerContent(value, {
      children,
      className,
      highlightClassName,
      innerClassName,
    });
  }, [children, className, context, highlightClassName, innerClassName, value]);

  if (!context || !value || context.viewport) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-slot="navigation-menu-content"
          data-state="open"
          className={cn("absolute left-0 top-full z-50 pt-2", className)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={context.spring}
        >
          <MotionNavigationMenuContentInner
            highlightClassName={highlightClassName}
            innerClassName={innerClassName}
          >
            {children}
          </MotionNavigationMenuContentInner>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MotionNavigationMenuContentInner({
  highlightClassName,
  innerClassName,
  children,
}: {
  highlightClassName?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="navigation-menu-content-inner"
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg",
        innerClassName,
      )}
    >
      {highlightClassName && (
        <div
          className={cn("pointer-events-none absolute inset-0", highlightClassName)}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

function MotionNavigationMenuViewport({
  className,
  contentByValue,
}: React.ComponentPropsWithRef<"div"> & {
  contentByValue?: Record<string, ContentRecord>;
}) {
  const context = React.useContext(MotionNavigationMenuContext);
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [lastSize, setLastSize] = React.useState({ width: 0, height: 0 });
  const activeContent =
    context?.activeValue && contentByValue
      ? contentByValue[context.activeValue]
      : undefined;

  React.useLayoutEffect(() => {
    const node = measureRef.current;

    if (!node || !activeContent) {
      return;
    }

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      const nextSize = {
        width: rect.width,
        height: rect.height,
      };

      setSize(nextSize);

      if (nextSize.width > 0 || nextSize.height > 0) {
        setLastSize(nextSize);
      }

      context?.updateViewportPosition();
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, [activeContent, context]);

  const width = size.width > 0 ? size.width : lastSize.width;
  const height = size.height > 0 ? size.height : lastSize.height;

  return (
    <>
      <div
        data-slot="navigation-menu-viewport"
        className={cn(
          "pointer-events-none absolute left-0 top-full z-50 h-0 w-full",
          className,
        )}
      >
        <AnimatePresence>
          {activeContent && context?.activeValue && (
            <motion.div
              className="pointer-events-auto absolute top-0 overflow-hidden"
              initial={false}
              animate={{
                left: (context.viewportX ?? 0) - width / 2,
                width: width || "auto",
                height: height || "auto",
              }}
              exit={{ opacity: 0 }}
              transition={context.spring}
            >
              <AnimatePresence
                mode="popLayout"
                custom={context.direction}
                initial={false}
              >
                <motion.div
                  key={context.activeValue}
                  custom={context.direction}
                  variants={contentVariants}
                  initial="initial"
                  animate="active"
                  exit="exit"
                  transition={context.spring}
                  className="pt-2"
                >
                  <MotionNavigationMenuContentInner
                    highlightClassName={activeContent.highlightClassName}
                    innerClassName={cn(
                      activeContent.className,
                      activeContent.innerClassName,
                    )}
                  >
                    {activeContent.children}
                  </MotionNavigationMenuContentInner>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden node used to measure the active content's natural size */}
      <div
        ref={measureRef}
        data-slot="navigation-menu-measure"
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-full w-max"
      >
        {activeContent && (
          <MotionNavigationMenuContentInner
            innerClassName={cn(
              activeContent.className,
              activeContent.innerClassName,
            )}
          >
            {activeContent.children}
          </MotionNavigationMenuContentInner>
        )}
      </div>
    </>
  );
}

function MotionNavigationMenuLink({
  className,
  ...props
}: React.ComponentPropsWithRef<"a">) {
  return (
    <a
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-md p-3 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MotionNavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="navigation-menu-indicator"
      className={cn(
        "absolute top-full z-50 flex h-2 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </div>
  );
}

export {
  MotionNavigationMenu,
  MotionNavigationMenuList,
  MotionNavigationMenuItem,
  MotionNavigationMenuContent,
  MotionNavigationMenuTrigger,
  MotionNavigationMenuLink,
  MotionNavigationMenuViewport,
  MotionNavigationMenuIndicator,
  motionNavigationMenuTriggerStyle,
};

export default MotionNavigationMenu;
