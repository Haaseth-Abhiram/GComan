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
  };
}

export interface Category {
  id: string;
  name: string;
  icon: any;
}
