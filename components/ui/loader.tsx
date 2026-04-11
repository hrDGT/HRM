import { Loader2 } from "lucide-react";

export function DashboardLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-main-bg/50"></div>
        <Loader2
          className="size-14 animate-spin text-primary relative z-10"
          strokeWidth={2.5}
        />
      </div>

      <p className="text-lg font-medium text-secondary-text animate-pulse">
        Loading...
      </p>
    </div>
  );
}
