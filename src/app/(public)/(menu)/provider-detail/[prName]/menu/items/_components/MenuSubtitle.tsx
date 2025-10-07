export default function MenuSubtitle({ title }: { title: string }) {
  return (
    <div className="w-full px-2 pt-4 select-none relative flex items-center gap-3">
      <div
        className={
          "flex-shrink-0 rounded-full w-1.5 h-8 bg-primary/30 dark:bg-card"
        }
      />

      <h2
        className={
          "alexandria text-sm font-extrabold tracking-tight leading-tight dark:text-primary"
        }
        style={{ lineHeight: 1 }}
      >
        {title}
      </h2>

      <span
        className={
          "inline-block flex-grow h-1.5 rounded-full bg-primary/30 dark:bg-card translate-y-[2px]"
        }
        aria-hidden
      />
    </div>
  );
}
