import { Shield, Award, CheckCircle2, Globe2, Clock } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    { icon: Shield, label: 'ISO 9001:2015', gradient: 'from-primary/15 to-accent/10' },
    { icon: Award, label: 'JSRS Certified', gradient: 'from-accent/15 to-primary/5' },
    { icon: CheckCircle2, label: 'ICV Compliant', gradient: 'from-secondary/15 to-secondary/5' },
    { icon: Globe2, label: 'GCC Export Ready', gradient: 'from-tertiary/15 to-tertiary/5' },
    { icon: Clock, label: 'Same-Day Muscat', gradient: 'from-primary/15 to-secondary/10' },
  ];

  return (
    <div className="py-10 bg-gradient-to-r from-muted/50 via-background to-muted/50 border-y border-border/50">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs text-muted-foreground mb-8 font-semibold tracking-[0.2em] uppercase">
          Certified & Trusted by Industry Standards
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2.5 group cursor-default animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 shadow-sm logo-gradient-border`}>
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center max-w-[90px] leading-tight">
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
