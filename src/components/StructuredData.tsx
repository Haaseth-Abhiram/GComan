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
      wikiUrl?: string;
    };
  };
  url?: string;
}

export const ProductStructuredData = ({ product, url }: ProductStructuredDataProps) => {
  // TODO(images): backfill `image` on every product JSON in src/data/products/*.
  // Today most products have no image and we fall back to the site logo, which
  // means Google sees the same image for every product — bad for image search
  // and for Product rich result eligibility.
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "category": product.category,
    "image": product.image || "https://gcoman.com/logo.png",
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
        "areaServed": ["OM", "AE", "SA", "QA", "KW", "BH"],
        "availableLanguage": ["en", "ar"]
      }
    },
    // Price-on-application: pricing is not published, so the Product is emitted
    // without an `offers` block. An Offer with no price still triggered GSC's
    // Product Snippets validator with "missing lowPrice"; dropping it removes
    // the validator error while keeping the page indexed normally (no rich
    // Product card in SERP, but no error either).
    ...(product.details?.alternativeNames && {
      "alternateName": product.details.alternativeNames
    }),
    ...(product.details?.casNumber && {
      "productID": product.details.casNumber,
      "identifier": product.details.casNumber,
      "additionalType": "https://schema.org/ChemicalSubstance"
    }),
    ...(product.details?.wikiUrl && {
      "sameAs": [product.details.wikiUrl]
    })
  };

  return (
    <Helmet defer={false}>
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
  keywords?: string[];
  about?: string[];
}

export const ArticleStructuredData = ({
  title,
  description,
  url,
  image,
  author,
  publishedDate,
  modifiedDate,
  category,
  keywords,
  about
}: ArticleStructuredDataProps) => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": url,
    "image": image || "https://gcoman.com/images/og-default.png",
    "author": {
      "@type": "Person",
      "name": author,
      "knowsAbout": ["Industrial Chemicals", "Water Treatment", "Oilfield Chemicals", "Chemical Safety", "GCC Industry"],
      "worksFor": {
        "@type": "Organization",
        "name": "Global Chemicals LLC",
        "url": "https://gcoman.com"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Global Chemicals LLC",
      "@id": "https://gcoman.com/#organization",
      "logo": { "@type": "ImageObject", "url": "https://gcoman.com/logo.png" }
    },
    "datePublished": publishedDate,
    ...(modifiedDate && { "dateModified": modifiedDate }),
    ...(category && { "articleSection": category }),
    ...(keywords && keywords.length > 0 && { "keywords": keywords.join(", ") }),
    ...(about && about.length > 0 && {
      "about": about.map(topic => ({ "@type": "Thing", "name": topic }))
    }),
    "inLanguage": "en",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <Helmet defer={false}>
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
    "description": "Expert insights, industry news, and technical guidance for chemical applications across Oman and the Middle East",
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
    <Helmet defer={false}>
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
  // Only mount this for genuine third-party reviews of a product/service —
  // self-serving Organization reviews violate Google's review-snippet policy.
  if (reviews.length === 0) return null; // empty array would emit NaN aggregateRating
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
    <Helmet defer={false}>
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
    <Helmet defer={false}>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
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
        "postalCode": "111",
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
    <Helmet defer={false}>
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
    <Helmet defer={false}>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// HOWTO STRUCTURED DATA (Google AI Overviews #2 signal)
// =====================================================
interface HowToStep {
  name: string;
  text: string;
}

interface HowToStructuredDataProps {
  name: string;
  description: string;
  totalTime?: string;    // ISO 8601 e.g. "PT30M"
  supply?: string[];
  steps: HowToStep[];
}

export const HowToStructuredData = ({ name, description, totalTime, supply, steps }: HowToStructuredDataProps) => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(totalTime && { "totalTime": totalTime }),
    ...(supply && supply.length > 0 && {
      "supply": supply.map(s => ({ "@type": "HowToSupply", "name": s }))
    }),
    "step": steps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.name,
      "text": step.text
    }))
  };

  return (
    <Helmet defer={false}>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// ITEMLIST STRUCTURED DATA (product category pages)
// Helps AI engines understand catalogue structure and
// enumerate products within a category in rich results.
// =====================================================
interface ItemListItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  image?: string;
}

interface ItemListStructuredDataProps {
  name: string;
  description: string;
  url: string;
  items: ItemListItem[];
}

export const ItemListStructuredData = ({ name, description, url, items }: ItemListStructuredDataProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "description": description,
    "url": url,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.title,
      "url": item.url,
      ...(item.description && { "description": item.description }),
      ...(item.image && {
        "image": {
          "@type": "ImageObject",
          "url": item.image
        }
      })
    }))
  };

  return (
    <Helmet defer={false}>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// SPEAKABLE STRUCTURED DATA (Google Assistant / voice AI)
// =====================================================
interface SpeakableStructuredDataProps {
  url: string;
  cssSelector?: string[];
}

export const SpeakableStructuredData = ({ url, cssSelector }: SpeakableStructuredDataProps) => {
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": url,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": cssSelector || ["h1", "h2", ".speakable"]
    }
  };

  return (
    <Helmet defer={false}>
      <script type="application/ld+json">
        {JSON.stringify(speakableSchema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// CONTACT PAGE STRUCTURED DATA
// =====================================================
export const ContactPageStructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://gcoman.com/contact#contactpage",
    "url": "https://gcoman.com/contact",
    "name": "Contact Global Chemicals LLC — Request a Quote",
    "description": "Contact Global Chemicals LLC for chemical supply inquiries, quotations, and technical support across Oman, UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain. Phone, email, WhatsApp, and online form.",
    "inLanguage": "en",
    "mainEntity": {
      "@type": "Organization",
      "@id": "https://gcoman.com/#organization",
      "name": "Global Chemicals LLC",
      "telephone": "+968-93754388",
      "email": "info@gcoman.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office-3, Building Number 1737, Near Oman LNG",
        "addressLocality": "Muscat",
        "addressRegion": "Muscat Governorate",
        "postalCode": "111",
        "addressCountry": "OM"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "08:00",
          "closes": "18:00"
        }
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+968-93754388",
          "contactType": "sales",
          "areaServed": ["OM", "AE", "SA", "QA", "KW", "BH"],
          "availableLanguage": ["en", "ar"]
        },
        {
          "@type": "ContactPoint",
          "email": "sales@gcoman.com",
          "contactType": "sales"
        },
        {
          "@type": "ContactPoint",
          "email": "support@gcoman.com",
          "contactType": "technical support"
        }
      ]
    }
  };

  return (
    <Helmet defer={false}>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// =====================================================
// SERVICE STRUCTURED DATA (top chemical services)
// =====================================================
export const ServiceStructuredData = () => {
  const services = [
    {
      name: "Water Treatment Chemical Supply in Oman & GCC",
      description: "Supply of PAC, caustic soda, calcium hypochlorite, sodium hypochlorite, antiscalants, and coagulants for municipal, industrial, and desalination plants across Oman, UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain.",
      serviceType: "Water Treatment Chemicals Supply",
      areaServed: ["Oman", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain"],
      url: "https://gcoman.com/products/water-treatment"
    },
    {
      name: "Oilfield & Refinery Chemical Supply",
      description: "JSRS-certified supply of corrosion inhibitors, scale inhibitors, demulsifiers, H2S scavengers, biocides, and drilling chemicals for PDO, OQ, and international operators in Oman.",
      serviceType: "Oilfield Chemicals Supply",
      areaServed: ["Oman"],
      url: "https://gcoman.com/products/oilfield"
    },
    {
      name: "Industrial Lubricants Distribution — Shell, Mobil, Castrol",
      description: "Authorized distribution of Shell, Mobil, and Castrol industrial lubricants including hydraulic oils, gear oils, compressor oils, and greases for manufacturing, heavy industry, and oil & gas across Oman and the GCC.",
      serviceType: "Industrial Lubricants Distribution",
      areaServed: ["Oman", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain"],
      url: "https://gcoman.com/products/lubricants"
    },
    {
      name: "Laboratory Chemical Supply in Oman",
      description: "Supply of AR grade reagents, HPLC solvents, analytical standards, biochemicals, and lab consumables for research, quality control, and educational laboratories across Oman.",
      serviceType: "Laboratory Chemicals Supply",
      areaServed: ["Oman"],
      url: "https://gcoman.com/products/lab-chemicals"
    },
    {
      name: "Food Grade Chemical Supply",
      description: "Supply of food-grade NaOH (E524), citric acid, phosphoric acid, sodium hypochlorite, and HACCP-compliant CIP chemicals for food & beverage manufacturers in Oman and the GCC.",
      serviceType: "Food Grade Chemicals Supply",
      areaServed: ["Oman", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain"],
      url: "https://gcoman.com/products/food-beverage"
    }
  ];

  const schema = services.map(svc => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": svc.name,
    "description": svc.description,
    "serviceType": svc.serviceType,
    "url": svc.url,
    "provider": {
      "@type": "Organization",
      "@id": "https://gcoman.com/#organization",
      "name": "Global Chemicals LLC"
    },
    "areaServed": svc.areaServed.map(c => ({ "@type": "Country", "name": c })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": svc.name,
      "url": svc.url
    }
  }));

  return (
    <Helmet defer={false}>
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

