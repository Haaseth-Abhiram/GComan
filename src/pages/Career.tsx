import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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

// Validation schema
const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(8, "Phone number must be at least 8 digits").max(20, "Phone number must be less than 20 digits"),
  position: z.string().trim().min(1, "Please select a position"),
  experience: z.string().trim().min(1, "Please specify your years of experience"),
  coverLetter: z.string().trim().min(50, "Cover letter must be at least 50 characters").max(2000, "Cover letter must be less than 2000 characters"),
  linkedIn: z.string().trim().url("Invalid LinkedIn URL").optional().or(z.literal('')),
});

const Career = () => {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<string>('');
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
      description: 'Lead our sales team to drive growth and expand our market presence in the chemical industry.',
      requirements: [
        'Bachelor\'s degree in Business, Chemistry, or related field',
        '5+ years of experience in B2B sales, preferably in chemicals',
        'Strong understanding of the chemical industry in Oman',
        'Excellent communication and negotiation skills',
        'Valid Oman driving license'
      ],
      responsibilities: [
        'Develop and execute sales strategies to achieve revenue targets',
        'Build and maintain relationships with key clients',
        'Lead, mentor, and manage the sales team',
        'Identify new business opportunities and market trends',
        'Prepare sales reports and forecasts'
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
      description: 'Provide technical expertise and support to customers for chemical applications and solutions.',
      requirements: [
        'Bachelor\'s degree in Chemical Engineering',
        '3-5 years of industry experience',
        'Knowledge of industrial chemical processes',
        'Strong analytical and problem-solving skills',
        'Proficiency in English and Arabic'
      ],
      responsibilities: [
        'Provide technical support to customers',
        'Develop chemical formulations and solutions',
        'Conduct product testing and quality analysis',
        'Create technical documentation and reports',
        'Support sales team with technical presentations'
      ],
      featured: true
    },
    {
      id: '3',
      title: 'Warehouse Supervisor',
      department: 'Operations',
      location: 'Sohar, Oman',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Manage warehouse operations ensuring safe handling and storage of chemical products.',
      requirements: [
        'Diploma or Bachelor\'s degree',
        '2-4 years of warehouse management experience',
        'Knowledge of chemical storage safety regulations',
        'Strong organizational and leadership skills',
        'Forklift operation certification preferred'
      ],
      responsibilities: [
        'Oversee daily warehouse operations and staff',
        'Ensure compliance with safety regulations',
        'Manage inventory and stock levels',
        'Coordinate shipments and deliveries',
        'Maintain warehouse documentation and records'
      ]
    },
    {
      id: '4',
      title: 'Quality Control Analyst',
      department: 'Quality Assurance',
      location: 'Muscat, Oman',
      type: 'Full-time',
      experience: '1-3 years',
      description: 'Conduct quality testing and ensure products meet required standards and specifications.',
      requirements: [
        'Bachelor\'s degree in Chemistry or related field',
        '1-3 years of laboratory experience',
        'Familiarity with analytical instruments',
        'Attention to detail and accuracy',
        'ISO standards knowledge is a plus'
      ],
      responsibilities: [
        'Perform quality control tests on chemical products',
        'Document test results and maintain records',
        'Ensure compliance with quality standards',
        'Calibrate and maintain laboratory equipment',
        'Report quality issues and recommend corrective actions'
      ]
    },
    {
      id: '5',
      title: 'Customer Service Representative',
      department: 'Customer Support',
      location: 'Muscat, Oman',
      type: 'Full-time',
      experience: '1-2 years',
      description: 'Provide excellent customer service and support to clients regarding product inquiries and orders.',
      requirements: [
        'Bachelor\'s degree or equivalent',
        '1-2 years of customer service experience',
        'Excellent communication skills in English and Arabic',
        'Computer proficiency',
        'Customer-focused attitude'
      ],
      responsibilities: [
        'Handle customer inquiries via phone, email, and in-person',
        'Process orders and coordinate with logistics',
        'Maintain customer records and documentation',
        'Resolve customer complaints professionally',
        'Support sales team with customer communications'
      ]
    },
    {
      id: '6',
      title: 'Logistics Coordinator',
      department: 'Supply Chain',
      location: 'Muscat, Oman',
      type: 'Full-time',
      experience: '2-3 years',
      description: 'Coordinate logistics operations to ensure timely delivery of chemical products to customers.',
      requirements: [
        'Bachelor\'s degree in Logistics, Supply Chain, or related field',
        '2-3 years of logistics experience',
        'Knowledge of dangerous goods regulations',
        'Strong coordination and planning skills',
        'ERP system experience preferred'
      ],
      responsibilities: [
        'Plan and coordinate product deliveries',
        'Manage relationships with transport providers',
        'Ensure compliance with hazardous materials regulations',
        'Track shipments and resolve delivery issues',
        'Optimize logistics costs and efficiency'
      ]
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Salary',
      description: 'Attractive compensation packages with performance bonuses'
    },
    {
      icon: Heart,
      title: 'Health Insurance',
      description: 'Comprehensive medical coverage for you and your family'
    },
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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

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
          description: "Please try again later",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
                  <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
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
                  className={`hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in ${job.featured ? 'border-primary/50' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {job.featured && (
                          <Badge className="mb-2" variant="default">Featured</Badge>
                        )}
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-base mt-3">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                      {job.salary && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div>
                        <h4 className="font-semibold mb-2">Key Requirements:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {job.requirements.slice(0, 3).map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-4" 
                      onClick={() => {
                        setSelectedJob(job.id);
                        setFormData(prev => ({ ...prev, position: job.title }));
                        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Apply Now
                    </Button>
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
                <a href="/contact">Contact HR Team</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://wa.me/96893754388">Chat on WhatsApp</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Career;