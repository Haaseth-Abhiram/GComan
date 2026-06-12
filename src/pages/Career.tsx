import { useState } from 'react';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BreadcrumbStructuredData, JobPostingStructuredData } from '@/components/StructuredData';
import WhatsAppButton from '@/components/WhatsAppButton';
import { trackFormSubmission } from '@/components/GoogleAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Heart,
  Users,
  TrendingUp,
  GraduationCap,
  Shield,
  Coffee,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { LocalizedLink } from '@/components/LocalizedLink';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  featured?: boolean;
}

// Validation schema - linkedIn is optional and only validated if provided
const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(8, "Phone number must be at least 8 digits").max(20, "Phone number must be less than 20 digits"),
  position: z.string().trim().min(1, "Please select a position"),
  experience: z.string().trim().min(1, "Please specify your years of experience"),
  coverLetter: z.string().trim().min(50, "Cover letter must be at least 50 characters").max(2000, "Cover letter must be less than 2000 characters"),
  linkedIn: z.string().optional().refine(
    (val) => !val || val.trim() === '' || /^https?:\/\/(www\.)?linkedin\.com\//.test(val),
    { message: "Please enter a valid LinkedIn URL" }
  ),
});

const Career = () => {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [viewingJob, setViewingJob] = useState<JobOpening | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
    linkedIn: ''
  });

  const jobOpenings: JobOpening[] = [
    {
      id: '1',
      title: 'Sales Manager',
      department: 'Sales & Marketing',
      location: 'Muscat, Oman',
      type: 'Full-time',
      experience: '5+ years',
      salary: 'Competitive',
      description: 'We are seeking an experienced Sales Manager to lead our sales team and drive business growth across Oman. As a Sales Manager at Global Chemicals LLC, you will be responsible for developing and implementing strategic sales plans, building long-term relationships with industrial clients, and achieving revenue targets. You will work closely with our technical team to provide customized chemical solutions to clients in oil & gas, water treatment, manufacturing, and construction industries. This role requires a strong understanding of the Omani industrial landscape, excellent leadership skills, and proven experience in B2B chemical sales. You will manage a team of sales representatives, oversee key accounts, negotiate contracts, and identify new business opportunities in emerging markets. The ideal candidate will have a track record of exceeding sales targets, strong negotiation skills, and the ability to build trust with decision-makers at major industrial companies.',
      requirements: [
        'Bachelor\'s degree in Business Administration, Chemistry, Chemical Engineering, or related field',
        'Minimum 5 years of proven experience in B2B sales, preferably in the chemical industry',
        'Strong knowledge of Oman\'s industrial sectors including oil & gas, manufacturing, and construction',
        'Excellent communication, presentation, and negotiation skills in both English and Arabic',
        'Demonstrated ability to lead and motivate a sales team',
        'Valid Oman driving license and willingness to travel within Oman',
        'Proficiency in CRM software and Microsoft Office Suite',
        'Strong analytical skills with ability to interpret sales data and market trends',
        'Proven track record of meeting or exceeding sales targets',
        'Understanding of chemical products, applications, and safety regulations is highly preferred'
      ],
      responsibilities: [
        'Develop and execute comprehensive sales strategies to achieve and exceed annual revenue targets',
        'Lead, coach, and manage the sales team to maximize performance and professional development',
        'Build and maintain strong relationships with key clients in oil & gas, manufacturing, water treatment, and construction sectors',
        'Identify and pursue new business opportunities through market research, networking, and client visits',
        'Prepare detailed sales forecasts, budgets, and reports for senior management',
        'Negotiate contracts, pricing, and terms with major clients while maintaining profitability',
        'Collaborate with technical team to develop customized chemical solutions for client needs',
        'Monitor competitor activities, market conditions, and industry trends',
        'Represent the company at industry events, trade shows, and client meetings',
        'Ensure customer satisfaction through regular follow-ups and addressing concerns promptly',
        'Maintain accurate records of sales activities, client interactions, and pipeline in CRM system'
      ],
      featured: true
    },
    {
      id: '2',
      title: 'Chemical Engineer',
      department: 'Technical',
      location: 'Muscat, Oman',
      type: 'Full-time',
      experience: '3-5 years',
      description: 'Global Chemicals LLC is looking for a talented Chemical Engineer to join our technical team and provide expert support to our clients across various industries. In this role, you will serve as the technical expert for our chemical products and solutions, working closely with clients to understand their process requirements and recommend optimal chemical applications. You will be responsible for conducting product demonstrations, troubleshooting application issues, developing customized formulations, and ensuring proper product usage. This position requires a solid foundation in chemical engineering principles, hands-on experience with industrial chemical processes, and excellent problem-solving skills. You will work with clients in water treatment plants, oil refineries, manufacturing facilities, and construction sites to optimize chemical performance and efficiency. The ideal candidate will have strong technical knowledge combined with excellent communication skills to explain complex chemical concepts to non-technical stakeholders. You will also support our sales team by providing technical presentations and participating in client meetings.',
      requirements: [
        'Bachelor\'s degree in Chemical Engineering from an accredited university (Master\'s degree is a plus)',
        '3-5 years of hands-on experience in chemical industry, preferably in application engineering or technical support',
        'Strong understanding of chemical processes in water treatment, oil & gas, or industrial applications',
        'Knowledge of chemical product formulations, mixing procedures, and safety protocols',
        'Proficiency in process simulation software and chemical analysis tools',
        'Excellent analytical and problem-solving skills with attention to detail',
        'Strong communication skills in English (Arabic is a plus) with ability to explain technical concepts clearly',
        'Experience in conducting laboratory tests, quality control, and product trials',
        'Familiarity with MSDS, chemical safety regulations, and environmental compliance',
        'Ability to work independently and as part of a multidisciplinary team',
        'Willingness to visit client sites and conduct field work when required'
      ],
      responsibilities: [
        'Provide technical support and consultation to clients on chemical product selection and application',
        'Conduct on-site assessments of client facilities to understand process requirements and challenges',
        'Develop customized chemical formulations and solutions tailored to specific client needs',
        'Perform laboratory testing, quality analysis, and product trials to ensure optimal performance',
        'Troubleshoot chemical application issues and recommend corrective actions',
        'Create comprehensive technical documentation including reports, specifications, and application guides',
        'Deliver technical presentations and training sessions to clients and internal sales team',
        'Collaborate with sales team during client meetings to provide technical expertise and support',
        'Monitor product performance at client sites and conduct regular follow-up visits',
        'Stay updated on industry trends, new chemical technologies, and best practices',
        'Ensure compliance with safety regulations, environmental standards, and quality requirements',
        'Maintain accurate records of technical activities, test results, and client interactions'
      ],
      featured: true
    },
    {
      id: '3',
      title: 'Proposal Engineer',
      department: 'Business Development',
      location: 'Muscat, Oman',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'We are seeking a detail-oriented Proposal Engineer to join our business development team and play a critical role in winning new projects and contracts. As a Proposal Engineer, you will be responsible for preparing comprehensive technical and commercial proposals for chemical supply tenders, RFPs, and client inquiries. You will work closely with sales, technical, and operations teams to develop competitive bids that showcase our capabilities and meet client specifications. This role requires strong technical writing skills, understanding of chemical products and applications, and ability to interpret tender documents accurately. You will be responsible for coordinating proposal development activities, ensuring compliance with tender requirements, conducting cost analysis, and meeting submission deadlines. The ideal candidate will have experience in proposal writing for the chemical industry, excellent attention to detail, and ability to manage multiple proposals simultaneously. You will play a key role in our growth by creating compelling proposals that win major contracts with government agencies, oil companies, and industrial clients.',
      requirements: [
        'Bachelor\'s degree in Chemical Engineering, Chemistry, Business Administration, or related field',
        '2-4 years of experience in proposal writing, tendering, or bid management, preferably in chemical industry',
        'Strong understanding of chemical products, specifications, and industrial applications',
        'Excellent technical writing and documentation skills in English (Arabic is a plus)',
        'Experience with government and corporate tender processes in Oman',
        'Proficiency in Microsoft Office (Word, Excel, PowerPoint) with advanced formatting skills',
        'Strong analytical skills with ability to interpret tender requirements and technical specifications',
        'Excellent attention to detail and ability to ensure proposal accuracy and completeness',
        'Good understanding of pricing, costing, and commercial terms in chemical supply contracts',
        'Ability to work under pressure and meet tight deadlines',
        'Strong coordination and communication skills to work with cross-functional teams'
      ],
      responsibilities: [
        'Review and analyze tender documents, RFPs, and EOIs to understand client requirements and evaluation criteria',
        'Coordinate with sales, technical, and operations teams to gather necessary information for proposals',
        'Prepare comprehensive technical and commercial proposals that highlight our capabilities and competitive advantages',
        'Develop detailed compliance matrices to ensure proposals meet all mandatory requirements',
        'Conduct cost analysis and pricing calculations in coordination with finance team',
        'Create professional proposal documents with proper formatting, branding, and presentation',
        'Prepare technical specifications, product datasheets, and supporting documentation',
        'Ensure proposals are submitted on time with all required documents and certifications',
        'Maintain a proposal database and tracking system for all submitted bids',
        'Conduct post-submission reviews and lessons learned to improve future proposals',
        'Stay updated on industry trends, competitor activities, and tender opportunities',
        'Coordinate with legal and compliance teams to ensure contract terms are acceptable'
      ],
      featured: true
    }
  ];

  const benefits = [
    {
      icon: GraduationCap,
      title: 'Learning & Development',
      description: 'Professional training and career advancement opportunities'
    },
    {
      icon: Clock,
      title: 'Work-Life Balance',
      description: 'Flexible working hours and paid time off'
    },
    {
      icon: Users,
      title: 'Team Culture',
      description: 'Collaborative environment with supportive colleagues'
    },
    {
      icon: Shield,
      title: 'Job Security',
      description: 'Stable employment with an established industry leader'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive"
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      applicationSchema.parse(formData);

      if (!selectedFile) {
        toast({
          title: "Resume required",
          description: "Please upload your resume/CV",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('coverLetter', formData.coverLetter);
      if (formData.linkedIn) {
        formDataToSend.append('linkedinUrl', formData.linkedIn);
      }
      formDataToSend.append('resume', selectedFile);

      // Submit to edge function - use hardcoded URL as fallback (publishable URL is safe)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yawbaqdywfrmuajaiptw.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2JhcWR5d2ZybXVhamFpcHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjY4MDksImV4cCI6MjA3NjgwMjgwOX0.jyujxGftg1hjI00bNDm_Oc0b6BuScduslylVgqgad9c';
      
      const response = await fetch(
        `${supabaseUrl}/functions/v1/submit-job-application`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      // Track successful form submission
      trackFormSubmission('career');

      toast({
        title: "Application submitted successfully!",
        description: "We'll review your application and get back to you soon.",
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        coverLetter: '',
        linkedIn: ''
      });
      setSelectedFile(null);
      setSelectedJob('');

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Submission failed",
          description: error instanceof Error ? error.message : "Please try again later",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Breadcrumb for SEO
  const breadcrumbItems = [
    { name: 'Home', url: 'https://gcoman.com/' },
    { name: 'Careers', url: 'https://gcoman.com/career' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Careers & Jobs | Join Our Team | Global Chemicals LLC"
        description="Join Global Chemicals LLC team in Oman. View open positions in our growing GCC export operations. ISO 9001 certified employer with opportunities in chemical sales, engineering & business development."
        keywords="chemical jobs Oman, careers Muscat, chemical engineer jobs, sales manager jobs Oman GCC, warehouse jobs, laboratory jobs, chemical industry careers Middle East"
        ogTitle="Careers at Global Chemicals LLC | Job Opportunities in Oman & GCC"
        ogDescription="Build your career with Oman's leading chemical supplier serving the GCC region. Competitive benefits, professional development, supportive culture. Apply today!"
        ogUrl="https://gcoman.com/career"
        canonical="https://gcoman.com/career"
      />

      {/* Structured Data for SEO */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {/* Add JobPosting schema for each open position */}
      {jobOpenings.map((job) => (
        <JobPostingStructuredData
          key={job.id}
          title={job.title}
          description={`${job.description} Requirements: ${job.requirements.join(', ')}`}
          datePosted="2025-01-01"
          validThrough="2026-12-31"
          employmentType={job.type === 'Full-time' ? 'FULL_TIME' : 'PART_TIME'}
          location={job.location}
        />
      ))}

      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-4" variant="secondary">Join Our Team</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Build Your Career With Us
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Join Global Chemicals LLC and be part of Oman's leading chemical solutions provider. 
              Grow your career in a dynamic, innovative environment.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join Global Chemicals LLC?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer more than just a job – we provide a platform for professional growth and success
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in logo-gradient-border relative" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                      <CardDescription>{benefit.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Current Job Openings</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore exciting career opportunities across various departments
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {jobOpenings.map((job, index) => (
                <Card 
                  key={job.id} 
                  className={`hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in logo-gradient-border relative ${job.featured ? 'logo-gradient-top' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {job.featured && (
                          <Badge className="mb-2" variant="default">Featured</Badge>
                        )}
                        <CardTitle className="text-xl sm:text-2xl mb-2">{job.title}</CardTitle>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {job.experience}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <Button 
                        variant="outline"
                        className="flex-1" 
                        onClick={() => setViewingJob(job)}
                      >
                        View Details
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={() => {
                          setSelectedJob(job.id);
                          setFormData(prev => ({ ...prev, position: job.title }));
                          document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Apply for a Position</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+968 9375 4388"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position Applied For *</Label>
                      <Input
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="Select from openings above"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience *</Label>
                      <Input
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="e.g., 5 years"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedIn">LinkedIn Profile (Optional)</Label>
                      <Input
                        id="linkedIn"
                        name="linkedIn"
                        type="url"
                        value={formData.linkedIn}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter *</Label>
                    <Textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      rows={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 50 characters, maximum 2000 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Upload Resume/CV *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        required
                      />
                      <label htmlFor="resume" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        {selectedFile ? (
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                        ) : (
                          <>
                            <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PDF or Word document (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto text-center border-2 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <Coffee className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Don't See the Right Position?
              </CardTitle>
              <CardDescription className="text-base md:text-lg">
                We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <LocalizedLink to="/contact">Contact HR Team</LocalizedLink>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://wa.me/96893754388">Chat on WhatsApp</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      {/* Job Details Dialog */}
      <Dialog open={!!viewingJob} onOpenChange={(open) => !open && setViewingJob(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
              {viewingJob?.title}
              {viewingJob?.featured && (
                <Badge variant="default" className="text-xs">Featured</Badge>
              )}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                {viewingJob?.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                {viewingJob?.type}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                {viewingJob?.experience}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">About the Role</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {viewingJob?.description}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {viewingJob?.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {viewingJob?.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setViewingJob(null)}
              className="w-full sm:flex-1"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setSelectedJob(viewingJob?.id || '');
                setFormData(prev => ({ ...prev, position: viewingJob?.title || '' }));
                setViewingJob(null);
                setTimeout(() => {
                  document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full sm:flex-1"
            >
              Apply for this Position
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Career;