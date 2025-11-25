import { Helmet } from 'react-helmet-async';

interface ProductStructuredDataProps {
  product: {
    id: string;
    title: string;
    description: string;
    category: string;
    details?: {
      formula?: string;
      fullDescription?: string;
      applications?: string[];
      casNumber?: string;
      alternativeNames?: string[];
    };
  };
}

export const ProductStructuredData = ({ product }: ProductStructuredDataProps) => {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "category": product.category,
    "manufacturer": {
      "@type": "Organization",
      "name": "Global Chemicals LLC",
      "url": "https://www.gcoman.com",
      "logo": "https://www.gcoman.com/logo.png",
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
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "OMR",
      "seller": {
        "@type": "Organization",
        "name": "Global Chemicals LLC"
      }
    },
    ...(product.details?.alternativeNames && {
      "alternateName": product.details.alternativeNames
    }),
    ...(product.details?.casNumber && {
      "productID": product.details.casNumber
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

interface OrganizationStructuredDataProps {
  includeService?: boolean;
}

export const OrganizationStructuredData = ({ includeService = false }: OrganizationStructuredDataProps) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Global Chemicals LLC",
    "alternateName": "Global Chemicals Oman",
    "url": "https://www.gcoman.com",
    "logo": "https://www.gcoman.com/logo.png",
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
                "@type": "Product",
                "name": "Poly Aluminium Chloride (PAC)"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Caustic Soda"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Calcium Hypochlorite"
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
