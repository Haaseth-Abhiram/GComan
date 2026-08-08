import gcIcon from "@/assets/gc-icon.webp";

export const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-4">
      <img
        src={gcIcon}
        alt="Loading Global Chemicals website"
        width={64}
        height={64}
        className="h-16 w-16 animate-pulse"
      />
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);
