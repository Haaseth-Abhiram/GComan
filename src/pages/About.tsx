import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { CheckCircle2, Target, Eye, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About Us</h1>
            <p className="text-lg text-muted-foreground">
              Leading the chemical industry with excellence and innovation
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">Who We Are</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Global Chemicals LLC, we are a leading provider of specialty chemicals, dedicated to delivering
              high-quality products and innovative solutions to meet the diverse needs of our customers. With a strong
              reputation for reliability, excellence, and customer satisfaction, we strive to be your preferred partner
              in the chemical industry.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our comprehensive product portfolio includes specialty and commodity chemicals that cater to various
              industries worldwide. We combine technical expertise with exceptional service to ensure our clients
              receive the best solutions for their specific requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-lg border border-border animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to be a trusted global provider of specialty and commodity chemicals, delivering
                exceptional solutions that meet the diverse needs of our customers. We aim to achieve this by offering
                high-quality products, personalized service, and innovative solutions, while fostering sustainable
                practices and long-lasting partnerships.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-lg border border-border animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our vision is to be a leader in the chemical industry, recognized for our commitment to excellence,
                customer satisfaction, and environmental responsibility. We strive to continually expand our product
                portfolio, leveraging cutting-edge technologies and industry expertise to provide innovative solutions
                that drive our customers' success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">Our Core Values</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our commitment to excellence, sustainability, and customer satisfaction drives everything we do.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Quality Products',
                  description:
                    'We maintain the highest standards in every product we deliver, ensuring reliability and excellence.',
                },
                {
                  title: 'Innovation & Research',
                  description:
                    'Continuously developing new solutions through cutting-edge research and development initiatives.',
                },
                {
                  title: 'Environmental Sustainability',
                  description:
                    'Committed to sustainable practices that protect our environment for future generations.',
                },
                {
                  title: 'Customer-Centric Approach',
                  description:
                    'Your success is our priority. We listen, understand, and deliver tailored solutions.',
                },
                {
                  title: 'Health and Safety',
                  description:
                    'Ensuring the safety of our team, customers, and communities in all our operations.',
                },
                {
                  title: 'Ethical Business Practices',
                  description:
                    'Conducting business with integrity, transparency, and respect for all stakeholders.',
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-foreground text-lg">{value.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
