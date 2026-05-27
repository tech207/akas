import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

export function Container({
  as: Component = "div",
  children,
  className
}: ContainerProps) {
  return (
    <Component
      className={["mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}
