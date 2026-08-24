import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet defer={false}>
        <title>Terms of Service | Global Chemicals LLC</title>
        <meta name="description" content="Terms and conditions for Global Chemicals LLC. Review our service terms, user responsibilities, and legal agreements for using our website and services." />
        <meta name="keywords" content="terms of service, terms and conditions, Global Chemicals LLC, legal, Oman" />
        {/* Noindex terms page - thin legal content, not valuable for search */}
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Terms of Service | Global Chemicals LLC" />
        <meta property="og:description" content="Terms and conditions for Global Chemicals LLC. Review our service terms and legal agreements." />
        <meta property="og:url" content="https://gcoman.com/terms" />
        <meta property="og:image" content="https://gcoman.com/images/og-default.png" />
        <link rel="canonical" href="https://gcoman.com/terms" />
      </Helmet>
      <Navigation />
      <WhatsAppButton />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-muted-foreground text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-slate max-w-none">
            
            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to Global Chemicals LLC. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our services.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Use of Services</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Eligibility</h3>
              <p className="text-muted-foreground mb-4">
                You must be at least 18 years old to use our services. By using our services, you represent and warrant that you meet this age requirement.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Account Registration</h3>
              <p className="text-muted-foreground mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Prohibited Activities</h3>
              <p className="text-muted-foreground mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Using the services for any illegal purpose</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Interfering with the proper functioning of the services</li>
                <li>Impersonating any person or entity</li>
                <li>Transmitting viruses or malicious code</li>
                <li>Collecting user information without consent</li>
                <li>Using automated systems to access the services</li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Products and Services</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Product Information</h3>
              <p className="text-muted-foreground mb-4">
                We strive to provide accurate product information, including descriptions, specifications, and technical data. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, or error-free. All sales are conducted through direct business inquiry and quotation process.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Quotation Process</h3>
              <p className="text-muted-foreground mb-4">
                All pricing is provided through customized quotations based on business requirements. We reserve the right to modify product availability and specifications at any time. Quotations are valid for the period specified in the quote document and are subject to product availability and market conditions.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Business Inquiries and Purchase Terms</h3>
              <p className="text-muted-foreground mb-4">
                By submitting a business inquiry or quotation request, you initiate a consultation process for potential bulk orders. We serve B2B clients exclusively. All purchase terms, including volume requirements, delivery schedules, and payment terms, are established through direct negotiation and formal purchase agreements. We reserve the right to decline any business inquiry based on product availability, order volume requirements, or business compatibility.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content on our website, including text, graphics, logos, images, and software, is the property of Global Chemicals LLC or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">5. User Content</h2>
              <p className="text-muted-foreground mb-4">
                You may be able to submit content to our website, such as reviews, comments, or job applications. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content. You represent that you have all necessary rights to grant this license.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Disclaimers</h2>
              <p className="text-muted-foreground mb-4">
                Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>The services will be uninterrupted, timely, or error-free</li>
                <li>The results obtained from using the services will be accurate or reliable</li>
                <li>The quality of products or services will meet your expectations</li>
                <li>Any errors in the services will be corrected</li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law, Global Chemicals LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of our services.
              </p>
              <p className="text-muted-foreground mb-4">
                Our total liability for any claims related to the services shall not exceed the amount you paid to us for the services in the twelve (12) months preceding the claim.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                You agree to indemnify, defend, and hold harmless Global Chemicals LLC, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the services or violation of these Terms.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Delivery Terms</h2>
              <p className="text-muted-foreground mb-4">
                Delivery terms, schedules, and logistics are specified in individual purchase agreements and quotations. All deliveries are subject to product availability and agreed-upon commercial terms. We are not responsible for delays caused by customs clearance, transportation providers, force majeure events, or other circumstances beyond our reasonable control. Title and risk of loss transfer according to the agreed Incoterms specified in each purchase agreement.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Product Returns and Technical Support</h2>
              <p className="text-muted-foreground mb-4">
                Returns, if applicable, are subject to the specific terms outlined in your purchase agreement and the nature of the chemical products supplied. Due to the specialized nature of industrial chemicals, most products have special handling requirements and regulatory restrictions that may limit return eligibility. Any return requests must be initiated within the timeframe specified in your purchase agreement. Please contact our technical support team to discuss product concerns or technical inquiries. Our team provides ongoing technical consultation and support for proper product application and usage.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the Sultanate of Oman, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Muscat, Oman.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the services after such changes constitutes your acceptance of the new Terms.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
              <p className="text-muted-foreground mb-4">
                We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the services will immediately cease.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Global Chemicals LLC</strong></p>
                <p><strong>Email:</strong> info@gcoman.com</p>
                <p><strong>Phone:</strong> +968 93754388</p>
                <p><strong>Address:</strong> Office-3, Building Number 1737, Near Oman LNG, Ghala, Muscat, Sultanate of Oman</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
