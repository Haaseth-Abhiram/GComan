import { Helmet } from 'react-helmet-async';

// =====================================================
// PRODUCT STRUCTURED DATA
// =====================================================
interface ProductStructuredDataProps {
  product: {
    id: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    details?: {
      formula?: string;
      fullDescription?: string;
      applications?: string[];
      casNumber?: string;
      alternativeNames?: string[];
    };
  };
  url?: string;
}

export const ProductStructuredData = ({ product, url }: ProductStructuredDataProps) => {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "category": product.category,
    "image": product.image || "https://gcoman.com/og-image.jpg",
    ...(url && { "url": url }),
    "brand": {
      "@type": "Brand",
      "name": "Global Chemicals LLC"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Global Chemicals LLC",
      "url": "https://gcoman.com",
      "logo": "https://gcoman.com/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "OM",
        "addressRegion": "Muscat"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+968-93754388",
        "contactType": "sales",
        "areaServed": "OM",
        "availableLanguage": ["en", "ar"]
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "OMR",
      "url": url || "https://gcoman.com/contact",
      "seller": {
        "@type": "Organization",
        "name": "Global Chemicals LLC",
        "url": "https://gcoman.com"
      },
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "OMR",
        "price": "Contact for Quote"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "OM"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          }
        }
      }
    },
    ...(product.details?.alternativeNames && {
      "alternateName": product.details.alternativeNames
    }),
    ...(product.details?.casNumber && {
      "productID": product.details.casNumber,
      "identifier": product.details.casNumber
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// ARTICLE STRUCTURED DATA (for Blog posts)
// =====================================================
interface ArticleStructuredDataProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  category?: string;
}

export const ArticleStructuredData = ({
  title,
  description,
  url,
  image,
  author,
  publishedDate,
  modifiedDate,
  category
}: ArticleStructuredDataProps) => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url,
    "image": image || "https://gcoman.com/og-image.jpg",
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Global Chemicals LLC",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gcoman.com/logo.png"
      }
    },
    "datePublished": publishedDate,
    ...(modifiedDate && { "dateModified": modifiedDate }),
    ...(category && { "articleSection": category }),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// BLOG LISTING STRUCTURED DATA
// =====================================================
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
}

interface BlogListingStructuredDataProps {
  posts: BlogPost[];
  baseUrl?: string;
}

export const BlogListingStructuredData = ({
  posts,
  baseUrl = "https://gcoman.com/blog"
}: BlogListingStructuredDataProps) => {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Global Chemicals LLC Blog",
    "description": "Expert insights, industry news, and technical guidance for chemical applications across Oman's key sectors",
    "url": baseUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Global Chemicals LLC",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gcoman.com/logo.png"
      }
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "articleSection": post.category
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(blogSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// REVIEW/TESTIMONIAL STRUCTURED DATA
// =====================================================
interface Review {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished?: string;
  company?: string;
}

interface ReviewStructuredDataProps {
  reviews: Review[];
  itemReviewed?: {
    name: string;
    type: 'Organization' | 'Product' | 'Service';
  };
}

export const ReviewStructuredData = ({
  reviews,
  itemReviewed = { name: "Global Chemicals LLC", type: "Organization" }
}: ReviewStructuredDataProps) => {
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": itemReviewed.type,
    "name": itemReviewed.name,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating.toFixed(1),
      "bestRating": "5",
      "worstRating": "1",
      "reviewCount": reviews.length
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.reviewBody,
      ...(review.datePublished && { "datePublished": review.datePublished }),
      ...(review.company && {
        "publisher": {
          "@type": "Organization",
          "name": review.company
        }
      })
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(reviewSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// FAQ STRUCTURED DATA
// =====================================================
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
}

export const FAQStructuredData = ({ faqs }: FAQStructuredDataProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// HOWTO STRUCTURED DATA (for guides/resources)
// =====================================================
interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToStructuredDataProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format, e.g., "PT30M"
  image?: string;
}

export const HowToStructuredData = ({
  name,
  description,
  steps,
  totalTime,
  image
}: HowToStructuredDataProps) => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(totalTime && { "totalTime": totalTime }),
    ...(image && { "image": image }),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// JOB POSTING STRUCTURED DATA (for Careers page)
// =====================================================
interface JobPostingProps {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN';
  salary?: {
    value: number;
    currency: string;
    unitText: 'MONTH' | 'YEAR' | 'HOUR';
  };
  location?: string;
}

export const JobPostingStructuredData = ({
  title,
  description,
  datePosted,
  validThrough,
  employmentType,
  salary,
  location = "Muscat, Oman"
}: JobPostingProps) => {
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": title,
    "description": description,
    "datePosted": datePosted,
    ...(validThrough && { "validThrough": validThrough }),
    "employmentType": employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Global Chemicals LLC",
      "sameAs": "https://gcoman.com",
      "logo": "https://gcoman.com/logo.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office-3, Building Number 1737, Near Oman LNG",
        "addressLocality": location.split(',')[0]?.trim() || "Muscat",
        "addressRegion": "Muscat Governorate",
        "addressCountry": "OM"
      }
    },
    ...(salary && {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": salary.currency,
        "value": {
          "@type": "QuantitativeValue",
          "value": salary.value,
          "unitText": salary.unitText
        }
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jobSchema)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbStructuredDataProps {
  items: {
    name: string;
    url: string;
  }[];
}

export const BreadcrumbStructuredData = ({ items }: BreadcrumbStructuredDataProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// LOCAL BUSINESS STRUCTURED DATA (Critical for Oman SEO)
// =====================================================
export const LocalBusinessStructuredData = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ChemicalSupplier",
    "@id": "https://gcoman.com/#organization",
    "name": "Global Chemicals LLC",
    "alternateName": ["Global Chemicals Oman", "GCOMAN", "Global Chemicals Muscat"],
    "description": "Leading industrial and specialty chemical supplier in Oman. Providing water treatment chemicals, industrial lubricants, laboratory chemicals, and oilfield chemicals to industries across Muscat, Sohar, Duqm, and Salalah.",
    "url": "https://gcoman.com",
    "telephone": "+968-93754388",
    "email": "sales@gcoman.com",
    "logo": "https://gcoman.com/logo.png",
    "image": "https://gcoman.com/og-image.jpg",
    "priceRange": "$$",
    "currenciesAccepted": "OMR",
    "paymentAccepted": ["Cash", "Bank Transfer", "Credit Card"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office-3, Building Number 1737, Near Oman LNG",
      "addressLocality": "Muscat",
      "addressRegion": "Muscat Governorate",
      "postalCode": "100",
      "addressCountry": "OM"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "23.5880",
      "longitude": "58.3829"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": "Muscat",
        "sameAs": "https://en.wikipedia.org/wiki/Muscat,_Oman"
      },
      {
        "@type": "City",
        "name": "Sohar",
        "sameAs": "https://en.wikipedia.org/wiki/Sohar"
      },
      {
        "@type": "City",
        "name": "Duqm",
        "sameAs": "https://en.wikipedia.org/wiki/Duqm"
      },
      {
        "@type": "City",
        "name": "Salalah",
        "sameAs": "https://en.wikipedia.org/wiki/Salalah"
      },
      {
        "@type": "Place",
        "name": "Rusayl Industrial Area"
      },
      {
        "@type": "Place",
        "name": "Sohar Industrial Estate"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Chemical Products Catalog",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Water Treatment Chemicals Supply" }},
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Industrial Lubricants Supply" }},
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Laboratory Chemicals Supply" }},
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Oilfield Chemicals Supply" }},
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Swimming Pool Chemicals Supply" }}
      ]
    },
    "sameAs": [
      "https://www.linkedin.com/company/global-chemicals-llc",
      "https://www.facebook.com/globalchemicalsoman"
    ],
    "knowsAbout": [
      "Water Treatment",
      "Industrial Chemicals",
      "Laboratory Reagents",
      "Oilfield Chemicals",
      "Desalination Chemicals",
      "Swimming Pool Chemicals"
    ],
    "slogan": "Your Trusted Chemical Partner in Oman"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

interface OrganizationStructuredDataProps {
  includeService?: boolean;
}

export const OrganizationStructuredData = ({ includeService = false }: OrganizationStructuredDataProps) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Global Chemicals LLC",
    "alternateName": "Global Chemicals Oman",
    "url": "https://gcoman.com",
    "logo": "https://gcoman.com/logo.png",
    "description": "Leading chemical supplier in Oman providing water treatment chemicals, industrial lubricants, laboratory chemicals, and specialty chemicals for oil & gas, manufacturing, and industrial sectors.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "OM",
      "addressRegion": "Muscat",
      "addressLocality": "Muscat"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Muscat"
      },
      {
        "@type": "City",
        "name": "Sohar"
      },
      {
        "@type": "City",
        "name": "Duqm"
      },
      {
        "@type": "City",
        "name": "Salalah"
      },
      {
        "@type": "Place",
        "name": "Rusayl Industrial Area"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+968-93754388",
      "contactType": "sales",
      "areaServed": "OM",
      "availableLanguage": ["en", "ar"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/global-chemicals-llc",
      "https://www.facebook.com/globalchemicalsoman"
    ]
  };

  const serviceSchema = includeService ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Chemical Supply and Distribution",
    "provider": {
      "@type": "Organization",
      "name": "Global Chemicals LLC"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Oman"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Chemical Products",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Water Treatment Chemicals",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Poly Aluminium Chloride (PAC) Supply"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Caustic Soda Supply"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Calcium Hypochlorite Supply"
              }
            }
          ]
        }
      ]
    }
  } : null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {serviceSchema && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}
    </Helmet>
  );
};
