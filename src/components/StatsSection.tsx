import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Award, Globe2, Package } from 'lucide-react';

const StatsSection = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    { icon: Award, value: 10, suffix: '+', label: t('home.statsYears'), accent: 'primary' },
    { icon: Package, value: 263, suffix: '+', label: t('home.statsProducts'), accent: 'secondary' },
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
      const duration = 1800;
      let raf: number;
      let start: number | null = null;
      const tick = (now: number) => {
        if (start === null) start = now;
        const progress = Math.min((now - start) / duration, 1);
        // easeOutExpo — fast start, gentle settle
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.round(eased * end));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
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
      {/* Dot-grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)',
        }}
      />
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group text-center space-y-3 animate-fade-in rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md px-4 py-8 transition-all duration-300 hover:bg-white/[0.10] hover:border-white/25 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover:scale-110">
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
