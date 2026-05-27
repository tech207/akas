import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-brand-ink/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-zh text-2xl font-semibold tracking-normal text-brand-ink md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl font-zh text-sm leading-6 text-brand-stone">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
