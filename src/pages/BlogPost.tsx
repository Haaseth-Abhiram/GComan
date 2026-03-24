import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SEO } from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { blogPosts } from './Blog';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = blogPosts.find((p) => p.id === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been moved.</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = post.icon;
  const canonicalUrl = `https://gcoman.com/blog/${post.id}`;
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
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-32 pb-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <Button
              variant="ghost"
              onClick={() => navigate('/blog')}
              className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
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

            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
              {post.excerpt}
            </p>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-8">
              <Icon className="w-8 h-8 text-primary" />
            </div>

            <div className="prose prose-lg max-w-none text-foreground">
              {post.content.split('\n').map((paragraph, i) => (
                paragraph.trim() ? <p key={i} className="mb-4 leading-relaxed text-foreground/90">{paragraph}</p> : null
              ))}
            </div>

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
                  <Link to="/contact">Request a Quote</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/products">Browse Products</Link>
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
                    <Link
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
                    </Link>
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
