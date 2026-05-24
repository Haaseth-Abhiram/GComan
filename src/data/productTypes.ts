// Atom in a 2D molecule diagram. x/y are SVG viewBox coords (0..100 typical).
export interface MoleculeAtom {
  el: string;        // "Na", "O", "H", "Cl"…
  x: number;
  y: number;
}
export interface MoleculeBond {
  from: number;      // index into atoms[]
  to: number;
  order?: 1 | 2 | 3; // single, double, triple
  kind?: 'covalent' | 'ionic';
}
export interface MoleculeSpec {
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

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
    faqs?: { question: string; answer: string }[];

    // ─── Pilot fields (optional) — render only when present.
    // Curated 2D diagram for the chemistry hero. If absent, the hero falls
    // back to the static formula badge.
    molecule?: MoleculeSpec;
    // Safety & compliance
    hazard?: {
      ghs?: string[];                 // ["GHS05", "GHS07"]
      unNumber?: string;              // "1823"
      hazardClass?: string;           // "Class 8 — Corrosive"
      signalWord?: 'Danger' | 'Warning';
      storage?: string;
    };
    documents?: {
      sdsUrl?: string;                // omit until we host the PDF
      tdsUrl?: string;
      uoaUrl?: string;
    };
  };
}

export interface Category {
  id: string;
  name: string;
  icon: any;
}
