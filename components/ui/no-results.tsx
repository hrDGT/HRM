import { Button } from "@/components/ui/button";

interface NoResultsProps {
  onReset?: () => void;
}

export function NoResults({ onReset }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-10 text-center">
      <h3 className="text-2xl text-main-text mb-2">No results found</h3>
      <p className="text-base text-secondary-text mb-6">
        Try another search, check the spelling or use a broader term
      </p>

      {onReset && (
        <Button
          variant="ghost"
          onClick={onReset}
          className="uppercase text-secondary-text hover:underline text-sm font-medium tracking-wide"
        >
          Reset Search
        </Button>
      )}
    </div>
  );
}
