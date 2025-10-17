// FadeInItem.tsx
interface FadeInItemProps {
  children: React.ReactNode;
  delay?: number;
}

export default function FadeInItem({ children, delay = 0 }: FadeInItemProps) {
  return (
    <div
      style={{
        animationDelay: `${delay}ms`,
      }}
      className="opacity-0 animate-fade-in-right"
    >
      {children}
    </div>
  );
}
