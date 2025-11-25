export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  image?: string;
  details?: {
    formula?: string;
    fullDescription?: string;
    applications?: string[];
    casNumber?: string;
    alternativeNames?: string[]; // For SEO - different search terms
    technicalSpecs?: string[];
    seoKeywords?: string[]; // Target keywords for this product
    longDescription?: string; // Extended SEO-optimized description
  };
}

export interface Category {
  id: string;
  name: string;
  icon: any;
}
