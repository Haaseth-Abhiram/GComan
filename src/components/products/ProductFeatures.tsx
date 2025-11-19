export const ProductFeatures = () => {
  const features = [
    {
      title: 'Comprehensive Range',
      description: 'Wide selection of specialty and commodity chemicals for all your industrial needs.',
    },
    {
      title: 'Quality Assured',
      description: 'Every product meets stringent quality standards and undergoes rigorous testing procedures.',
    },
    {
      title: 'Expert Support',
      description: 'Technical support and guidance from our team of experienced chemical industry professionals.',
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">Why Choose Our Products</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We continuously strive to expand our product offerings, staying at the forefront of industry trends and
            innovations.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-card rounded-lg border border-border animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
