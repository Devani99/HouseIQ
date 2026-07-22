import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-gradient-hero opacity-80 pointer-events-none" />
      <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-gradient-brand opacity-20 blur-3xl animate-pulse-glow" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
            {eyebrow}
          </div>
        )}
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl animate-fade-up">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg animate-fade-up">{description}</p>}
        {children && <div className="mt-6 animate-fade-up">{children}</div>}
      </div>
    </section>
  );
}
