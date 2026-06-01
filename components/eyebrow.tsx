export function Eyebrow({ children }: { children: HTMLElement }) {
  return (
    <div>
      <span class="inline-flex items-center gap-3 text-sm font-sans text-white/60">
        <span class="w-8 h-px bg-white/30" />
        {children}
      </span>
    </div>
  );
}
