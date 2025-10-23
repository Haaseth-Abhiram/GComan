import { Card } from '@/components/ui/card';
import { Shield, Zap, Headphones, TrendingUp, Award, Leaf } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every product undergoes rigorous testing and meets international quality standards.',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Efficient logistics network ensures timely delivery across Oman and the region.',
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: '24/7 technical support from our team of experienced chemical engineers.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation Driven',
      description: 'Continuous R&D investment to bring cutting-edge solutions to market.',
    },
    {
      icon: Award,
      title: 'Industry Leader',
      description: '10+ years of excellence with numerous industry awards and recognitions.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and sustainable chemical manufacturing.',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Industry Leaders Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the difference that comes from partnering with a trusted chemical solutions provider
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
