type GoldDividerProps = {
  className?: string;
  width?: string;
};

export function GoldDivider({
  className,
  width = "w-16"
}: GoldDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={["h-px bg-brand-gold", width, className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
