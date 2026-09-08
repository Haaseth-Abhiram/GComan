import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { ArticleStructuredData, BreadcrumbStructuredData, FAQStructuredData, HowToStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, Tag, ChevronRight } from 'lucide-react';
import { LocalizedLink } from '@/components/LocalizedLink';
import { blogPosts } from './Blog';
import { ArticleTOC, type TOCHeading } from '@/components/ArticleTOC';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';

/* Article bodies are plain text: paragraphs separated by blank lines, with
   section headings stored as bare short lines. Promote those to real <h2>s so
   each article has an outline and anchor targets instead of 40 flat <p>s.
   A heading is short, spans a single sentence, and carries no terminal
   punctuation (question marks are common and intentional). */
const isHeadingLine = (text: string) =>
  text.length <= 100 && !/[.,;:]$/.test(text) && !text.includes('. ');

const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const post = blogPosts.find((p) => p.id === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title="Article Not Found | Global Chemicals LLC"
          description="The blog article you're looking for doesn't exist or has been moved."
          noIndex
          canonical="https://gcoman.com/blog"
        />
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been moved.</p>
          <Button asChild>
            <LocalizedLink to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </LocalizedLink>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = post.icon;
  const canonicalUrl = `https://gcoman.com/blog/${post.id}`;
  // Derived from the same heuristic that renders the <h2>s, so the TOC can
  // never list a heading the article doesn't actually have.
  const headings: TOCHeading[] = post.content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && isHeadingLine(l))
    .map((text) => ({ id: slugifyHeading(text), text }));
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${post.title} | Global Chemicals LLC`}
        description={post.excerpt}
        keywords={post.tags.join(', ')}
        ogTitle={post.title}
        ogDescription={post.excerpt}
        ogUrl={canonicalUrl}
        ogType="article"
        canonical={canonicalUrl}
        author={post.author}
        publishedTime={post.date}
        modifiedTime={post.date}
        articleSection={post.category}
        articleTags={post.tags}
      />
      <ArticleStructuredData
        title={post.title}
        description={post.excerpt}
        url={canonicalUrl}
        author={post.author}
        publishedDate={post.date}
        modifiedDate={post.date}
        category={post.category}
        keywords={post.tags}
        about={[post.category, 'Oman', 'Chemical Industry', 'GCC']}
      />
      {post.faqs && post.faqs.length > 0 && (
        <FAQStructuredData faqs={post.faqs} />
      )}
      {post.howTo && (
        <HowToStructuredData
          name={post.howTo.name}
          description={post.howTo.description}
          totalTime={post.howTo.totalTime}
          supply={post.howTo.supply}
          steps={post.howTo.steps}
        />
      )}
      <SpeakableStructuredData
        url={canonicalUrl}
        cssSelector={["h1", "h2", ".article-excerpt", ".prose"]}
      />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://gcoman.com/' },
        { name: 'Blog', url: 'https://gcoman.com/blog' },
        { name: post.title, url: canonicalUrl },
      ]} />
      <Navigation />
      <ReadingProgress />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-32 pb-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <Button
              asChild
              variant="ghost"
              className="mb-6 ltr:-ml-2 rtl:-mr-2 text-muted-foreground hover:text-foreground"
            >
              <LocalizedLink to="/blog">
                <ArrowLeft className="ltr:mr-2 rtl:ml-2 h-4 w-4 rtl:rotate-180" />
                Back to Blog
              </LocalizedLink>
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>

            <p className="article-excerpt text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
              {post.excerpt}
            </p>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl lg:max-w-6xl">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
              <div className="min-w-0 lg:max-w-3xl">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <ShareButtons url={canonicalUrl} title={post.title} />
                </div>

                <ArticleTOC headings={headings} variant="inline" />

                <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground">
                  {post.content.split('\n').map((line, i) => {
                    const text = line.trim();
                    if (!text) return null;
                    return isHeadingLine(text) ? (
                      <h2 key={i} id={slugifyHeading(text)} className="scroll-mt-28">
                        {text}
                      </h2>
                    ) : (
                      <p key={i}>{text}</p>
                    );
                  })}
                </div>

                {/* Author / review credibility — E-E-A-T signal and a trust cue
                    right where the reader finishes the technical argument. */}
                <div className="mt-10 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-muted/30 p-5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">
                      Reviewed by our applications engineering team · ISO 9001:2015 · JSRS registered
                    </p>
                  </div>
                </div>
              </div>

              <aside className="hidden lg:block">
                <ArticleTOC headings={headings} variant="rail" />
              </aside>
            </div>

            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {post.faqs.map((faq, index) => (
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
            )}

            {post.relatedLocations && post.relatedLocations.length > 0 && (
              <div className="mt-10">
                <p className="text-sm font-medium text-muted-foreground mb-3">We supply to:</p>
                <div className="flex flex-wrap gap-2">
                  {post.relatedLocations.map((loc) => (
                    <Button key={loc.slug} variant="outline" size="sm" asChild>
                      <LocalizedLink to={`/chemicals/${loc.slug}`}>
                        {loc.label}
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </LocalizedLink>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Need Chemical Solutions for Your Business?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Global Chemicals LLC supplies industrial, laboratory, and specialty chemicals across Oman and the GCC region — UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain.
                Contact us for pricing, technical specifications, and fast delivery.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <LocalizedLink to="/contact">Request a Quote</LocalizedLink>
                </Button>
                <Button variant="outline" asChild>
                  <LocalizedLink to="/products">Browse Products</LocalizedLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="space-y-4">
                {relatedPosts.map((related) => {
                  const RelatedIcon = related.icon;
                  return (
                    <LocalizedLink
                      key={related.id}
                      to={`/blog/${related.id}`}
                      className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border hover:border-primary/40 hover:shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <RelatedIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">{related.title}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{related.excerpt}</p>
                        <p className="text-xs text-muted-foreground mt-1">{related.readTime}</p>
                      </div>
                    </LocalizedLink>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
