import { Shield, Award, CheckCircle2, Leaf, FileCheck, Lock } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    { icon: Shield, label: 'ISO 9001 Certified' },
    { icon: FileCheck, label: 'FDA Approved' },
    { icon: Leaf, label: 'Eco-Friendly' },
    { icon: CheckCircle2, label: 'Quality Assured' },
    { icon: Lock, label: 'Safe & Secure' },
    { icon: Award, label: 'Industry Leader' },
  ];

  return (
    <div className="py-12 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-6 font-medium">
          CERTIFIED & TRUSTED BY INDUSTRY STANDARDS
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-all">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center max-w-[80px]">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
