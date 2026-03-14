import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Award, Globe2, Package } from 'lucide-react';

const StatsSection = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    { icon: Award, value: 10, suffix: '+', label: t('home.statsYears'), accent: 'primary' },
    { icon: Package, value: 1000, suffix: '+', label: t('home.statsProducts'), accent: 'secondary' },
    { icon: Users, value: 200, suffix: '+', label: t('home.statsClients'), accent: 'accent' },
    { icon: Globe2, value: 98, suffix: '%', label: t('home.statsSatisfaction'), accent: 'tertiary' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const Counter = ({ end, suffix }: { end: number; suffix: string }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!isVisible) return;
      const duration = 1500;
      const steps = 40;
      const increment = end / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }, [isVisible, end]);

    return (
      <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold tabular-nums">
        {isVisible ? count : 0}{suffix}
      </span>
    );
  };

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-primary/90" />
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-3 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-white">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/75 font-medium text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
