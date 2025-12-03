import gcomanLogo from "@/assets/gcoman-logo.png";

export const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <img 
      src={gcomanLogo} 
      alt="Loading..." 
      className="h-16 w-16 animate-spin"
    />
  </div>
);
