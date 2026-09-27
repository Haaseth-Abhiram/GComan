import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface FAQEntry {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQEntry[];
  /** Section heading. Defaults to the phrase users and crawlers both expect. */
  heading?: string;
  className?: string;
}

/**
 * Visible FAQ accordion, paired with <FAQStructuredData /> on the same page.
 *
 * Why this component exists: Google's structured-data policy requires FAQPage
 * content to be visible on the page. A 2026-09-27 audit of dist/ found five
 * pages (/about, /certifications, /contact, /customers, /industries) shipping
 * 26 Q&A pairs as JSON-LD only, with the text nowhere in the rendered DOM —
 * every one of them called <FAQStructuredData /> without rendering the array.
 * Rendering both from a single shared component keeps them in lockstep.
 *
 * AccordionContent is forceMount'd upstream (see ui/accordion.tsx), so answer
 * text is present in the prerendered HTML even while collapsed — the same
 * crawlability fix product and blog pages rely on.
 */
export const FAQSection = ({ faqs, heading = 'Frequently Asked Questions', className }: FAQSectionProps) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={className ?? 'py-16 bg-slate-50/70 border-t border-border/40'}>
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">{heading}</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
