import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Shield, Award, CheckCircle2, FileCheck, Globe, Users, Leaf, TrendingUp } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { BreadcrumbStructuredData, FAQStructuredData } from '@/components/StructuredData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Certifications', url: 'https://gcoman.com/certifications' }
];

const certificationFAQs = [
  {
    question: "Is Global Chemicals LLC JSRS registered for Oman oil & gas supply?",
    answer: "Yes. Global Chemicals LLC is a registered supplier in the Joint Supplier Registration System (JSRS), Oman's mandatory pre-qualification system for oil and gas sector procurement. Our JSRS registration qualifies us to supply chemicals directly to PDO, OQ, Oxy, Shell, BP, and their approved contractors operating in Oman."
  },
  {
    question: "What ISO certification does Global Chemicals LLC hold?",
    answer: "Global Chemicals LLC holds ISO 9001:2015 certification for Quality Management Systems, certified since 2020. This international standard confirms that our chemical supply processes, documentation, and customer service meet globally recognised quality benchmarks. Copies of our ISO certificate are available on request."
  },
  {
    question: "What is ICV certification and does Global Chemicals LLC have it?",
    answer: "ICV (In-Country Value) is Oman's national economic policy requiring oil & gas suppliers to demonstrate contribution to the local economy through employment, training, and local procurement. Global Chemicals LLC is ICV certified (since 2021), certified by the Ministry of Commerce & Industry. Our ICV score confirms compliance with Omanization targets and local spending commitments required for government and energy sector contracts."
  },
  {
    question: "Can Global Chemicals LLC supply chemicals to PDO-approved projects?",
    answer: "Yes. As a JSRS-registered, ISO 9001:2015 certified, and ICV-compliant supplier, Global Chemicals LLC is pre-qualified to supply chemicals to PDO (Petroleum Development Oman) and its approved contractors. We regularly supply oilfield chemicals, water treatment chemicals, and specialty products to PDO project sites across South Oman, including Marmul, Nimr, and Qarn Alam."
  },
  {
    question: "Does Global Chemicals LLC provide Safety Data Sheets (SDS) with all products?",
    answer: "Yes. All products supplied by Global Chemicals LLC are accompanied by current Safety Data Sheets (SDS/MSDS) compliant with the GHS (Globally Harmonised System) format. SDS documents are available in English and, where available, Arabic. We also provide Certificates of Analysis (CoA) and Technical Data Sheets (TDS) on request for all products."
  },
  {
    question: "Is Global Chemicals LLC compliant with Oman environmental regulations?",
    answer: "Yes. Global Chemicals LLC operates in full compliance with Oman's Environmental Protection Law (Royal Decree 114/2001 and subsequent amendments) and follows international environmental standards for chemical storage, handling, transportation, and waste disposal. We hold environmental compliance certification from the Environment Authority of the Sultanate of Oman."
  }
];

const Certifications = () => {
  const { t } = useTranslation();

  const certifications = [
    {
      icon: Shield,
      title: 'ISO 9001:2015 Certified',
      titleAr: 'شهادة ISO 9001:2015',
      description: 'Quality Management System certification ensuring consistent delivery of high-quality chemical products and services to our customers across Oman.',
      descriptionAr: 'شهادة نظام إدارة الجودة التي تضمن التسليم المتسق لمنتجات وخدمات كيميائية عالية الجودة لعملائنا في جميع أنحاء عُمان.',
      certifiedSince: '2020',
      verifiedBy: 'ISO International Standards Organization',
      benefits: [
        'Consistent product quality and reliability',
        'Continuous improvement processes',
        'Customer satisfaction focus',
        'Documented quality procedures',
        'Regular audits and compliance checks'
      ],
      benefitsAr: [
        'جودة وموثوقية منتجات متسقة',
        'عمليات التحسين المستمر',
        'التركيز على رضا العملاء',
        'إجراءات الجودة الموثقة',
        'عمليات التدقيق والامتثال المنتظمة'
      ]
    },
    {
      icon: FileCheck,
      title: 'JSRS Registered Supplier',
      titleAr: 'مورد مسجل في JSRS',
      description: 'Registered with Joint Supplier Registration System (JSRS) for Oman\'s Oil & Gas sector, approved to supply chemicals to major operators including PDO, Oxy, Shell, and BP.',
      descriptionAr: 'مسجل في نظام تسجيل الموردين المشترك (JSRS) لقطاع النفط والغاز في عُمان، ومعتمد لتوريد المواد الكيميائية للمشغلين الرئيسيين بما في ذلك PDO وOxy وShell وBP.',
      certifiedSince: '2019',
      verifiedBy: 'JSRS Oman Oil & Gas Portal',
      benefits: [
        'Pre-qualified for oil & gas projects',
        'Approved supplier for PDO, Oxy, Shell, BP',
        'Compliance with international HSE standards',
        'Fast-track procurement for qualified operators',
        'Regular safety and quality audits'
      ],
      benefitsAr: [
        'مؤهل مسبقاً لمشاريع النفط والغاز',
        'مورد معتمد لـ PDO وOxy وShell وBP',
        'الامتثال لمعايير الصحة والسلامة والبيئة الدولية',
        'المشتريات السريعة للمشغلين المؤهلين',
        'عمليات تدقيق السلامة والجودة المنتظمة'
      ]
    },
    {
      icon: TrendingUp,
      title: 'ICV Compliant',
      titleAr: 'متوافق مع ICV',
      description: 'In-Country Value (ICV) certified, contributing to Oman\'s economic diversification by creating local jobs, using local suppliers, and investing in Omani workforce development.',
      descriptionAr: 'معتمد من القيمة المحلية المضافة (ICV)، مما يساهم في التنويع الاقتصادي لعُمان من خلال خلق فرص عمل محلية واستخدام الموردين المحليين والاستثمار في تطوير القوى العاملة العُمانية.',
      certifiedSince: '2021',
      verifiedBy: 'Oman Ministry of Commerce & Industry',
      benefits: [
        'Support for Oman Vision 2040',
        'Local workforce employment (70%+ Omanization)',
        'Partnership with Omani suppliers',
        'Investment in local training and development',
        'Contribution to national economic growth'
      ],
      benefitsAr: [
        'دعم رؤية عُمان 2040',
        'توظيف القوى العاملة المحلية (تعمين أكثر من 70%)',
        'شراكة مع الموردين العُمانيين',
        'الاستثمار في التدريب والتطوير المحلي',
        'المساهمة في النمو الاقتصادي الوطني'
      ]
    },
    {
      icon: Leaf,
      title: 'Environmental Compliance',
      titleAr: 'الامتثال البيئي',
      description: 'Full compliance with Oman Environmental Protection Law and international environmental standards for chemical storage, handling, and transportation.',
      descriptionAr: 'الامتثال الكامل لقانون حماية البيئة في عُمان والمعايير البيئية الدولية لتخزين ومناولة ونقل المواد الكيميائية.',
      certifiedSince: '2018',
      verifiedBy: 'Environment Authority - Sultanate of Oman',
      benefits: [
        'Safe chemical storage facilities',
        'Proper waste management procedures',
        'Environmental impact assessments',
        'Sustainable chemical handling practices',
        'Regular environmental audits'
      ],
      benefitsAr: [
        'مرافق تخزين آمنة للمواد الكيميائية',
        'إجراءات إدارة النفايات السليمة',
        'تقييمات الأثر البيئي',
        'ممارسات التعامل المستدام مع المواد الكيميائية',
        'عمليات التدقيق البيئي المنتظمة'
      ]
    },
    {
      icon: Users,
      title: 'Health & Safety Standards',
      titleAr: 'معايير الصحة والسلامة',
      description: 'Compliance with Oman Occupational Safety & Health regulations and international chemical safety standards (OSHA, REACH, GHS).',
      descriptionAr: 'الامتثال للوائح السلامة والصحة المهنية في عُمان والمعايير الدولية لسلامة المواد الكيميائية (OSHA وREACH وGHS).',
      certifiedSince: '2018',
      verifiedBy: 'Ministry of Labour - Sultanate of Oman',
      benefits: [
        'Comprehensive Safety Data Sheets (SDS)',
        'Employee safety training programs',
        'PPE compliance and provision',
        'Chemical handling certifications',
        'Emergency response procedures'
      ],
      benefitsAr: [
        'صحائف بيانات السلامة الشاملة (SDS)',
        'برامج تدريب السلامة للموظفين',
        'الامتثال وتوفير معدات الحماية الشخصية',
        'شهادات التعامل مع المواد الكيميائية',
        'إجراءات الاستجابة للطوارئ'
      ]
    },
    {
      icon: Globe,
      title: 'International Standards',
      titleAr: 'المعايير الدولية',
      description: 'Adherence to international chemical industry standards including REACH (EU), GHS (Globally Harmonized System), and OSHA requirements.',
      descriptionAr: 'الالتزام بمعايير صناعة المواد الكيميائية الدولية بما في ذلك REACH (الاتحاد الأوروبي) وGHS (النظام المنسق عالمياً) ومتطلبات OSHA.',
      certifiedSince: '2019',
      verifiedBy: 'International Chemical Standards Bodies',
      benefits: [
        'REACH compliance for EU chemical regulations',
        'GHS-compliant labeling and documentation',
        'OSHA-aligned safety procedures',
        'International quality benchmarks',
        'Global best practices implementation'
      ],
      benefitsAr: [
        'الامتثال لـ REACH للوائح الكيماويات في الاتحاد الأوروبي',
        'وضع العلامات والتوثيق المتوافق مع GHS',
        'إجراءات السلامة المتوافقة مع OSHA',
        'معايير الجودة الدولية',
        'تنفيذ أفضل الممارسات العالمية'
      ]
    }
  ];

  const whyItMatters = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      titleAr: 'ضمان الجودة',
      description: 'Our certifications guarantee that every chemical product meets strict quality and safety standards.',
      descriptionAr: 'تضمن شهاداتنا أن كل منتج كيميائي يلبي معايير الجودة والسلامة الصارمة.'
    },
    {
      icon: CheckCircle2,
      title: 'Regulatory Compliance',
      titleAr: 'الامتثال التنظيمي',
      description: 'Full compliance with Oman and international regulations, reducing your procurement risks.',
      descriptionAr: 'الامتثال الكامل للوائح عُمان والدولية، مما يقلل من مخاطر المشتريات الخاصة بك.'
    },
    {
      icon: Award,
      title: 'Trusted Supplier',
      titleAr: 'مورد موثوق',
      description: 'Vetted and approved by Oman\'s major oil & gas operators and industrial companies.',
      descriptionAr: 'تم فحصه والموافقة عليه من قبل مشغلي النفط والغاز الرئيسيين والشركات الصناعية في عُمان.'
    },
    {
      icon: Leaf,
      title: 'Environmental Responsibility',
      titleAr: 'المسؤولية البيئية',
      description: 'Committed to sustainable practices and environmental protection in all our operations.',
      descriptionAr: 'ملتزمون بالممارسات المستدامة وحماية البيئة في جميع عملياتنا.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Certifications | JSRS, ISO 9001:2015, ICV | Global Chemicals LLC"
        description="Global Chemicals LLC is ISO 9001:2015 certified, JSRS registered for Oman oil & gas sector, and ICV compliant. Trusted chemical supplier serving Oman & GCC countries — UAE, Saudi Arabia, Qatar, Kuwait, Bahrain."
        keywords="JSRS Oman, ISO 9001 chemical supplier GCC, ICV certified Oman, JSRS registered chemicals, oil gas chemicals Middle East, certified chemical supplier Muscat Dubai, ISO certified distributor Oman UAE, JSRS PDO supplier, environmental compliance chemicals GCC"
        ogTitle="JSRS & ISO Certified Chemical Supplier | Oman & GCC | Global Chemicals"
        ogDescription="ISO 9001:2015 certified, JSRS registered for oil & gas sector, ICV compliant. Trusted by PDO, Oxy, Shell, BP. Exporting chemicals to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain."
        ogUrl="https://gcoman.com/certifications"
        canonical="https://gcoman.com/certifications"
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <FAQStructuredData faqs={certificationFAQs} />
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <Badge variant="outline" className="mb-4 text-primary border-primary/50">
                Certified Excellence
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                Certifications & Compliance
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6">
                ISO 9001:2015 | JSRS Registered | ICV Compliant
              </p>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                Global Chemicals LLC holds the most respected certifications in the chemical industry. Our commitment to quality, safety, and compliance makes us the trusted partner for oil &amp; gas, manufacturing, and industrial sectors across Oman and the GCC region — UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain.
              </p>
            </div>
          </div>
        </section>

        {/* Certifications Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Certifications</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Recognized and verified by national and international regulatory bodies
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {certifications.map((cert, index) => {
                  const Icon = cert.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow logo-gradient-border logo-gradient-top relative">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {cert.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Certified since {cert.certifiedSince}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {cert.description}
                      </p>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          Verified by: <span className="text-primary">{cert.verifiedBy}</span>
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Key Benefits:</p>
                        <ul className="space-y-1">
                          {cert.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Our Certifications Matter</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Peace of mind for your chemical procurement needs
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyItMatters.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow logo-gradient-border relative">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* JSRS Registration Details */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 logo-gradient-border logo-gradient-top relative">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      JSRS Approved Supplier for Oman Oil & Gas
                    </h2>
                    <p className="text-muted-foreground">
                      Pre-qualified to supply chemicals to Oman's leading energy companies
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Approved Operators:</h3>
                    <ul className="space-y-2">
                      {['Petroleum Development Oman (PDO)', 'Occidental of Oman (Oxy)', 'Shell Development Oman', 'BP Oman', 'Oman LNG', 'ORPIC (Oman Oil Refineries)'].map((operator, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>{operator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Chemical Categories:</h3>
                    <ul className="space-y-2">
                      {['Oilfield Production Chemicals', 'Water Treatment Chemicals', 'Industrial Lubricants', 'Specialty Chemicals', 'Laboratory Reagents', 'Drilling Fluids Additives'].map((category, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>{category}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm text-foreground">
                    <strong className="text-primary">Note for Procurement Officers:</strong> Our JSRS registration means faster approval processes, pre-vetted quality standards, and compliance with all oil & gas sector requirements. Request our JSRS certificate number for your vendor qualification process.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work with a Certified Supplier?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Contact our team for certification documentation, compliance certificates, or vendor registration support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Request Certificates
                </a>
                <a
                  href="tel:+96893754388"
                  className="inline-flex items-center justify-center px-8 py-3 bg-background border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold"
                >
                  Call: +968 93754388
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Certifications;
