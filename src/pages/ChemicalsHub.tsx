import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SEO } from '@/components/SEO';
import { BreadcrumbStructuredData, ItemListStructuredData } from '@/components/StructuredData';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { locationIndex, allLocations } from '@/data/locationIndex';
import { MapPin, Truck, ArrowRight, Ship, Clock } from 'lucide-react';

// Hub for the /chemicals/:location cluster. Before this page existed the
// cluster had no parent: location breadcrumbs jumped Home -> "Chemicals Dubai"
// with no middle rung, and /chemicals itself fell through to the SPA shell
// (a 200 soft-404). The hub consolidates the 22 city pages, gives the
// breadcrumb its missing level, and targets "chemical supplier GCC /
// Middle East delivery" queries the individual city pages are too narrow for.
const ChemicalsHub = () => {
  const canonical = 'https://gcoman.com/chemicals';

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemical Delivery Locations | Oman, GCC & Middle East"
        description="Industrial chemical supply from Muscat to 22 cities across Oman, UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Iraq, Jordan and Egypt. Same-day delivery in Muscat; scheduled road, sea and air freight across the GCC."
        keywords="chemical supplier GCC, chemical delivery Middle East, industrial chemicals Oman, chemical exporter Muscat, GCC chemical logistics"
        ogUrl={canonical}
        canonical={canonical}
      />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: 'https://gcoman.com/' },
          { name: 'Delivery Locations', url: canonical },
        ]}
      />
      <ItemListStructuredData
        name="Chemical Delivery Locations — Global Chemicals LLC"
        description="Cities and industrial zones served by Global Chemicals LLC across Oman, the GCC and the wider Middle East."
        url={canonical}
        items={allLocations.map((l) => ({
          id: l.slug,
          title: `Chemical Supplier ${l.city}`,
          url: `https://gcoman.com/chemicals/${l.slug}`,
        }))}
      />

      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-32 pb-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground">Delivery Locations</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-3xl">
              Chemical Supply Across Oman, the GCC &amp; the Middle East
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Global Chemicals LLC ships industrial, water-treatment, oilfield, food-grade and laboratory
              chemicals from our Muscat warehouse to {allLocations.length} cities in {locationIndex.length} countries.
              Every lane below runs on a scheduled freight service — same-day trucks inside Muscat, cross-border
              road freight into the UAE and Saudi Arabia, and sea freight via the Ports of Sohar and Duqm for
              Red Sea and Egyptian destinations.
            </p>
          </div>
        </section>

        {/* How delivery works */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 mb-4">
              <Card className="p-6">
                <Truck className="w-8 h-8 text-primary mb-3" aria-hidden="true" />
                <h2 className="font-semibold text-lg mb-2">Road freight — Oman &amp; GCC</h2>
                <p className="text-sm text-muted-foreground">
                  Daily dispatch inside Oman and scheduled cross-border trucking into the UAE, Saudi Arabia,
                  Qatar, Kuwait and Bahrain under GCC customs transit. Fujairah is our fastest export lane at
                  2–4 hours from Muscat.
                </p>
              </Card>
              <Card className="p-6">
                <Ship className="w-8 h-8 text-primary mb-3" aria-hidden="true" />
                <h2 className="font-semibold text-lg mb-2">Sea freight — Red Sea &amp; Egypt</h2>
                <p className="text-sm text-muted-foreground">
                  Container and IBC shipments from the Ports of Sohar and Duqm to Jeddah, Yanbu and Alexandria —
                  the economical route for bulk caustic soda, PAC and hypochlorite orders.
                </p>
              </Card>
              <Card className="p-6">
                <Clock className="w-8 h-8 text-primary mb-3" aria-hidden="true" />
                <h2 className="font-semibold text-lg mb-2">Documentation included</h2>
                <p className="text-sm text-muted-foreground">
                  Every consignment ships with CoA, SDS and packing list; hazardous classes move under ADR-compliant
                  transport with trained drivers. ISO 9001:2015, JSRS and ICV credentials cover cross-border supply.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Country groups */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            {locationIndex.map((group) => {
              // Country-level hub pages exist for the GCC export markets;
              // their headings link through. Other countries are plain
              // headings until they earn a hub of their own.
              const countryHub: Record<string, string> = {
                'United Arab Emirates': '/chemicals/uae',
                'Saudi Arabia': '/chemicals/saudi-arabia',
                'Qatar': '/chemicals/qatar',
                'Kuwait': '/chemicals/kuwait',
              };
              const hubPath = countryHub[group.country];
              return (
              <div key={group.country} className="mb-10">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
                  {hubPath ? (
                    <Link to={hubPath} className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                      {group.country}
                    </Link>
                  ) : (
                    group.country
                  )}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.locations.map((loc) => (
                    <Link
                      key={loc.slug}
                      to={`/chemicals/${loc.slug}`}
                      className="group block rounded-lg border border-border bg-card p-5 hover:border-primary hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {loc.city}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 rtl:rotate-180 transition-all" aria-hidden="true" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{loc.region}</p>
                      <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                        <Truck className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                        {loc.deliveryTime}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Don&apos;t see your city?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              These are our scheduled lanes — we quote ad-hoc deliveries anywhere in the GCC and wider Middle East.
              Send us the product, quantity and destination and we&apos;ll confirm lead time and freight cost within
              one business day.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Request a delivery quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products">Browse 270+ products</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ChemicalsHub;
