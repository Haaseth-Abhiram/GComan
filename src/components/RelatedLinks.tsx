import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface RelatedLink {
  title: string;
  href: string;
  description?: string;
}

interface RelatedLinksProps {
  title?: string;
  links: RelatedLink[];
  variant?: 'default' | 'compact' | 'cards';
}

/**
 * RelatedLinks Component for Internal Linking SEO
 *
 * This component helps with:
 * - Internal link building for better SEO
 * - Related content discovery
 * - Improved site navigation
 * - Lower bounce rates
 */
export const RelatedLinks = ({
  title = 'Related Pages',
  links,
  variant = 'default'
}: RelatedLinksProps) => {
  if (links.length === 0) return null;

  if (variant === 'compact') {
    return (
      <nav aria-label="Related pages" className="py-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {title}
        </h3>
        <ul className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                to={link.href}
                className="inline-flex items-center px-3 py-1.5 text-sm bg-muted hover:bg-primary/10 rounded-full transition-colors"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  if (variant === 'cards') {
    return (
      <nav aria-label="Related pages" className="py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="group p-4 border rounded-lg hover:border-primary/50 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              {link.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {link.description}
                </p>
              )}
              <span className="inline-flex items-center text-sm text-primary mt-2 group-hover:translate-x-1 transition-transform">
                Learn more <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  // Default variant
  return (
    <nav aria-label="Related pages" className="py-6 border-t">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.href}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div>
                <span className="font-medium group-hover:text-primary transition-colors">
                  {link.title}
                </span>
                {link.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {link.description}
                  </p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Pre-defined link collections for common use cases
export const productCategoryLinks: RelatedLink[] = [
  { title: 'Water Treatment Chemicals', href: '/products?category=water-treatment', description: 'PAC, chlorine, and treatment solutions' },
  { title: 'Industrial Lubricants', href: '/products?category=lubricants', description: 'Shell, Mobil, and Castrol products' },
  { title: 'Laboratory Chemicals', href: '/products?category=laboratory', description: 'AR grade and HPLC solvents' },
  { title: 'Oil & Gas Chemicals', href: '/products?category=oil-gas', description: 'Drilling and production chemicals' },
];

export const industryLinks: RelatedLink[] = [
  { title: 'Water Treatment Industry', href: '/industries#water-treatment', description: 'Municipal and industrial water solutions' },
  { title: 'Oil & Gas Sector', href: '/industries#oil-gas', description: 'Chemicals for exploration and production' },
  { title: 'Manufacturing', href: '/industries#manufacturing', description: 'Industrial process chemicals' },
  { title: 'Food & Beverage', href: '/industries#food-beverage', description: 'Food grade chemicals and sanitizers' },
];

export const resourceLinks: RelatedLink[] = [
  { title: 'Product Catalogs', href: '/resources', description: 'Download our comprehensive catalogs' },
  { title: 'Safety Data Sheets', href: '/resources', description: 'SDS for all products' },
  { title: 'Technical Support', href: '/contact', description: 'Get expert assistance' },
];

export const companyLinks: RelatedLink[] = [
  { title: 'About Us', href: '/about', description: 'Learn about Global Chemicals LLC' },
  { title: 'Our Customers', href: '/customers', description: 'See who trusts us' },
  { title: 'Career Opportunities', href: '/career', description: 'Join our team' },
  { title: 'Contact Us', href: '/contact', description: 'Get in touch' },
];

export default RelatedLinks;
