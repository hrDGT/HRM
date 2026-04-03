export const FadeIn = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 ease-out fill-mode-forward ${className}`}
  >
    {children}
  </div>
);
