import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | Global Chemicals LLC</title>
        <meta name="description" content="Privacy policy for Global Chemicals LLC. Learn how we collect, use, and protect your personal information when you visit our website or use our services." />
        <meta name="keywords" content="privacy policy, data protection, Global Chemicals LLC, Oman" />
        {/* Noindex privacy page - thin legal content, not valuable for search */}
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Privacy Policy | Global Chemicals LLC" />
        <meta property="og:description" content="Privacy policy for Global Chemicals LLC. Learn how we collect, use, and protect your personal information." />
        <meta property="og:url" content="https://gcoman.com/privacy" />
        <meta property="og:image" content="https://gcoman.com/og-image.jpg" />
        <link rel="canonical" href="https://gcoman.com/privacy" />
      </Helmet>
      <Navigation />
      <WhatsAppButton />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
                Global Chemicals LLC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Personal Information</h3>
              <p className="text-muted-foreground mb-4">
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Name and contact details (email, phone number, address)</li>
                <li>Company information and job title</li>
                <li>Account credentials (username and password)</li>
                <li>Job application information (resume, cover letter)</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-muted-foreground mb-4">
                When you visit our website, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>IP address and browser type</li>
                <li>Operating system and device information</li>
                <li>Pages viewed and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing orders and managing customer relationships</li>
                <li>Sending newsletters, marketing materials, and updates</li>
                <li>Responding to inquiries and customer service requests</li>
                <li>Processing job applications and recruitment activities</li>
                <li>Analyzing usage patterns and optimizing user experience</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small files stored on your device that help us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve our services and content</li>
                <li>Provide personalized experiences</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                You can control cookie settings through your browser preferences. However, disabling cookies may limit your ability to use certain features of our website.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>With Consent:</strong> When you have given us permission to share your information</li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your information</li>
                <li>Object to or restrict processing of your information</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                To exercise these rights, please contact us at info@gcoman.com
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground mb-4">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
              <p className="text-muted-foreground mb-4">
                Your information may be transferred to and maintained on servers located outside of your country. By using our services, you consent to the transfer of information to countries outside your country of residence, which may have different data protection rules.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
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

export default Privacy;
