import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Supports = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">Customer Support</h1>
            <p className="text-lg text-muted-foreground mb-12 text-center">
              We're here to help with any questions or concerns
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  icon: Phone,
                  title: 'Phone Support',
                  content: '+1 (234) 567-890',
                  link: 'tel:+1234567890',
                },
                {
                  icon: Mail,
                  title: 'Email Support',
                  content: 'support@gcoman.com',
                  link: 'mailto:support@gcoman.com',
                },
                {
                  icon: MapPin,
                  title: 'Office Location',
                  content: '123 Chemical Street, Industrial Zone',
                  link: null,
                },
                {
                  icon: Clock,
                  title: 'Business Hours',
                  content: 'Mon-Fri: 8:00 AM - 6:00 PM',
                  link: null,
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                        {item.link ? (
                          <a href={item.link} className="text-muted-foreground hover:text-primary transition-colors">
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{item.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-card p-8 rounded-lg border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Need Technical Support?</h2>
              <p className="text-muted-foreground mb-6">
                Our team of highly skilled professionals offers extensive technical expertise and support. Whether you
                need assistance in product selection, application guidance, or troubleshooting, our knowledgeable staff
                is always ready to provide prompt and reliable support.
              </p>
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all">
                Contact Technical Team
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Supports;
