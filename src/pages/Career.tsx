import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Career = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Careers</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Join our team of chemical industry experts
            </p>
            <div className="bg-card p-12 rounded-lg border border-border">
              <p className="text-muted-foreground">
                Careers page coming soon. Check back for exciting opportunities to join Global Chemicals LLC.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Career;
