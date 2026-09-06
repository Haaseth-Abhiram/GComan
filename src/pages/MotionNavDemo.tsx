import MotionNavigationMenuDemo from "@/components/MotionNavigationMenuDemo";

/**
 * Internal preview page for the MotionNavigationMenu component.
 * Deliberately NOT in sitemap.xml — dev-only, like /dev/chemistry-playground.
 */
const MotionNavDemo = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-center rounded-xl border border-border bg-card py-6 shadow-sm">
          <MotionNavigationMenuDemo />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Internal preview of the motion navigation menu component (framer-motion
          + spring viewport). Hover or focus the triggers.
        </p>
      </div>
    </div>
  );
};

export default MotionNavDemo;
