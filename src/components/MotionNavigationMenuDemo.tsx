import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuItem,
  MotionNavigationMenuLink,
  MotionNavigationMenuList,
  MotionNavigationMenuTrigger,
} from "@/components/ui/motion-navigation-menu";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  ChartNoAxesColumn,
  type LucideIcon,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";

interface MotionNavigationMenuDemoProps {
  viewport?: boolean;
  springBounce?: number;
  springStiffness?: number;
  springDamping?: number;
}

const PRODUCTS = [
  { title: "Analytics", desc: "Live funnels, cohorts, and retention." },
  { title: "Automation", desc: "Trigger workflows from events." },
  { title: "Insights", desc: "AI recommendations for next steps." },
  { title: "Reports", desc: "Share snapshots with stakeholders." },
];

const SOLUTIONS: { title: string; desc: string; icon: LucideIcon }[] = [
  {
    title: "Startups",
    desc: "Launch dashboards without building infra.",
    icon: Rocket,
  },
  {
    title: "Agencies",
    desc: "Manage every client workspace from one view.",
    icon: Users,
  },
  {
    title: "Enterprise",
    desc: "SAML, audit logs, SLAs, and permissions.",
    icon: Building2,
  },
];

const RESOURCES = [
  { title: "Documentation", desc: "Guides and API reference." },
  { title: "Changelog", desc: "What shipped this month." },
  { title: "Blog", desc: "Engineering and product notes." },
];

const highlightClassName = "dark:bg-accent bg-foreground/[0.06] rounded-lg";

export function MotionNavigationMenuDemo({
  viewport,
  springBounce,
  springStiffness,
  springDamping,
}: MotionNavigationMenuDemoProps) {
  return (
    <MotionNavigationMenu
      viewport={viewport}
      springBounce={springBounce}
      springStiffness={springStiffness}
      springDamping={springDamping}
    >
      <MotionNavigationMenuList highlightClassName={highlightClassName}>
        <MotionNavigationMenuItem value="products">
          <MotionNavigationMenuTrigger>Products</MotionNavigationMenuTrigger>
          <MotionNavigationMenuContent innerClassName="w-[540px]">
            <div className="grid grid-cols-[200px_1fr] gap-3 p-4">
              <a
                href="#"
                className="group flex flex-col justify-between rounded-lg bg-muted p-4 transition-colors hover:bg-muted/70"
              >
                <ChartNoAxesColumn className="size-6 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Command center</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Monitor product growth, workflow health, and team output.
                  </p>
                </div>
              </a>

              <div className="grid grid-cols-2 gap-1">
                {PRODUCTS.map((product) => (
                  <MotionNavigationMenuLink key={product.title} href="#">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      {product.title}
                      <ArrowUpRight className="size-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {product.desc}
                    </p>
                  </MotionNavigationMenuLink>
                ))}
              </div>
            </div>
          </MotionNavigationMenuContent>
        </MotionNavigationMenuItem>

        <MotionNavigationMenuItem value="solutions">
          <MotionNavigationMenuTrigger>Solutions</MotionNavigationMenuTrigger>
          <MotionNavigationMenuContent innerClassName="w-[480px]">
            <div className="p-4">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Built for teams
              </p>
              <div className="grid gap-1">
                {SOLUTIONS.map((solution) => (
                  <MotionNavigationMenuLink
                    key={solution.title}
                    href="#"
                    className="flex-row items-center gap-3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                      <solution.icon className="size-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        For {solution.title.toLowerCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {solution.desc}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-primary">
                      View
                    </span>
                  </MotionNavigationMenuLink>
                ))}
              </div>
            </div>
          </MotionNavigationMenuContent>
        </MotionNavigationMenuItem>

        <MotionNavigationMenuItem value="resources">
          <MotionNavigationMenuTrigger>Resources</MotionNavigationMenuTrigger>
          <MotionNavigationMenuContent innerClassName="w-[420px]">
            <div className="grid gap-3 p-4">
              <div className="grid gap-1">
                {RESOURCES.map((resource) => (
                  <MotionNavigationMenuLink
                    key={resource.title}
                    href="#"
                    className="flex-row items-center gap-3"
                  >
                    <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {resource.desc}
                      </p>
                    </div>
                  </MotionNavigationMenuLink>
                ))}
              </div>

              <div className="rounded-lg bg-muted p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold">
                  <Sparkles className="size-3.5 text-primary" />
                  New release
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore the latest workflow templates and API improvements.
                </p>
                <a
                  href="#"
                  className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                >
                  Read changelog
                </a>
              </div>
            </div>
          </MotionNavigationMenuContent>
        </MotionNavigationMenuItem>

        <MotionNavigationMenuItem value="pricing">
          <MotionNavigationMenuLink
            href="#"
            className="inline-flex h-9 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium hover:bg-transparent"
          >
            Pricing
          </MotionNavigationMenuLink>
        </MotionNavigationMenuItem>
      </MotionNavigationMenuList>
    </MotionNavigationMenu>
  );
}

export default MotionNavigationMenuDemo;
