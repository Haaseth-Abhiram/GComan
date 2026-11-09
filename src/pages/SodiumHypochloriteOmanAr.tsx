import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, Mail, MessageCircle, Truck, ThermometerSun } from 'lucide-react';
import hubAr from '@/i18n/locales/hub-pages-ar.json';

/**
 * Arabic sodium hypochlorite hub — /ar/chemical-supplier/sodium-hypochlorite-oman
 * (2026-11-09, MASTER-PLAN P10.15).
 *
 * Why: sodium hypochlorite is the second product by revenue (Zoho Books, 12
 * months to 2026-11-08), mostly to the UAE and Bahrain, where procurement and
 * AI answers are bilingual, and Arabic buyers search "هيبوكلوريت الصوديوم" and
 * "كلور سائل". The /ar render of the English hub was noindex by design (Arabic
 * SEO model, CLAUDE.md), so that demand had no Arabic page. This is a full
 * Arabic body; its meta lives in hub-pages-ar.json, which makes the /ar URL
 * indexable through scripts/sync-ar-sitemap.mjs.
 *
 * Content rule: every fact restates SodiumHypochloriteOman.tsx, the
 * hypochlorite product JSON (strengths, packs) and the NitricAcidCountry.tsx
 * UAE / Bahrain lanes. Nothing new is claimed and no price is published.
 * Product links go to the /ar product twins, which are indexable.
 */

const URL_EN = 'https://gcoman.com/chemical-supplier/sodium-hypochlorite-oman';
const URL_AR = 'https://gcoman.com/ar/chemical-supplier/sodium-hypochlorite-oman';
const meta = hubAr.hubPages['sodium-hypochlorite-oman'];

const WHATSAPP_AR =
  'https://wa.me/96892772305?text=' +
  encodeURIComponent(
    'استفسار عن هيبوكلوريت الصوديوم (gcoman.com). الدرجة: معالجة المياه / مبيضات / مسابح / غذائية ___. الكمية: ___. التعبئة: 25 لتر / 200 لتر / IBC ___. مدينة التسليم: ___. الشركة: ___'
  );

const grades = [
  { name: 'معالجة مياه الشرب والصرف (البلديات)', strength: '12–15%', use: 'تطهير مياه الشرب والصرف الصحي ومياه التبريد', packs: 'براميل، حاويات IBC، وبالجملة', link: '/ar/products/water-treatment/sodium-hypochlorite' },
  { name: 'صناعة المبيضات ومنتجات التنظيف', strength: '12–15% (120–150 غ/لتر)', use: 'مادة خام للمبيض المنزلي والصناعي بعد التخفيف', packs: 'عبوات 25 لتر، براميل 200 لتر، حاويات IBC سعة 1,000 لتر', link: '/ar/products/soap-detergent/sodium-hypochlorite-12-15-soap' },
  { name: 'المسابح', strength: '12–15%', use: 'كلورة المسابح والمعالجة الصدمية وأجهزة التغذية الآلية', packs: 'عبوات 25 و60 و200 لتر، حاويات IBC سعة 1,000 لتر', link: '/ar/products/swimming-pool/sodium-hypo-chlorite-12-15' },
  { name: 'الدرجة الغذائية', strength: '5–12.5%', use: 'تطهير الأسطح والمعدات الملامسة للأغذية وغسل الخضروات', packs: 'عبوات 25 و60 و200 لتر', link: '/ar/products/food-beverage/sodium-hypochlorite-food' },
  { name: 'كلور سائل جاهز للمسابح الصغيرة', strength: '10–12%', use: 'المسابح الصغيرة والجرعات اليدوية', packs: 'عبوات 5 و20 و25 لتر', link: '/ar/products/swimming-pool/chlorine-liquid-pool' },
];

const delivery = [
  { place: 'مسقط', lead: 'في نفس اليوم' },
  { place: 'صحار', lead: 'في اليوم التالي' },
  { place: 'صلالة والدقم', lead: 'خلال يومين إلى ثلاثة أيام' },
  { place: 'الفجيرة والساحل الشرقي للإمارات', lead: 'في نفس اليوم أو اليوم التالي براً' },
  { place: 'أبوظبي ودبي والشارقة', lead: '3–5 أيام عمل' },
  { place: 'البحرين (المنامة وسترة ومدينة سلمان الصناعية)', lead: '3–5 أيام عمل عبر جسر الملك فهد' },
];

const faqs = [
  {
    question: 'أين أشتري هيبوكلوريت الصوديوم في عُمان؟',
    answer:
      'من جلوبال كيميكالز ذ.م.م، التي تورّد هيبوكلوريت الصوديوم (NaOCl، رقم CAS ‏7681-52-9) من مخزونها في مسقط بدرجات معالجة المياه، والدرجة الغذائية، ودرجة صناعة المبيضات 12–15%، ودرجة المسابح، في عبوات من 5 و25 لتراً حتى براميل 200 لتر وحاويات IBC سعة 1,000 لتر وبالجملة. أرسل الدرجة والكمية ومدينة التسليم للحصول على عرض سعر.',
  },
  {
    question: 'ما تركيز هيبوكلوريت الصوديوم المناسب لي؟',
    answer:
      'لتطهير المياه والصرف الصحي وصناعة المبيضات والمسابح التجارية، تعطي درجات 12–15% أكبر كمية من الكلور الفعّال في كل لتر يُسلَّم. ولتطهير الأسطح والمعدات الملامسة للأغذية استخدم الدرجة الغذائية مخففة بالتركيز الذي يحدده إجراء التطهير لديك. أما الكلور السائل الجاهز 10–12% فيناسب المسابح الصغيرة والجرعات اليدوية.',
  },
  {
    question: 'كيف يُخزَّن هيبوكلوريت الصوديوم في حرارة الخليج؟',
    answer:
      'يفقد هيبوكلوريت الصوديوم تركيزه مع الوقت، وبسرعة أكبر في الحرارة والضوء. تحتفظ درجة 12–15% بقوتها نحو ثلاثة إلى ستة أشهر عند 15–20 درجة مئوية، وتفقد جزءاً ملحوظاً منها خلال أسابيع في حر الصيف. لذلك خزّنه في الظل أو داخل المبنى، وأبقِ العبوات مغلقة، واطلب كميات تستهلكها خلال أسابيع لا أشهر.',
  },
  {
    question: 'ما المواد التي لا يجوز خلطها مع هيبوكلوريت الصوديوم؟',
    answer:
      'لا تخلطه أبداً مع الأحماض، بما فيها المنظفات الحمضية ومزيلات الترسبات، لأن ذلك يطلق غاز الكلور. ولا تخلطه مع الأمونيا أو مركبات الأمونيوم، فهي تكوّن الكلورامينات السامة. افصله عنها في التخزين، واشطف المعدات بين منتج وآخر.',
  },
  {
    question: 'هل توردون هيبوكلوريت الصوديوم إلى الإمارات والبحرين؟',
    answer:
      'نعم. تصل الشحنات إلى أبوظبي ودبي والشارقة خلال 3–5 أيام عمل، وإلى الفجيرة والساحل الشرقي في نفس اليوم أو اليوم التالي براً، وإلى البحرين خلال 3–5 أيام عمل عبر جسر الملك فهد. ترافق كل شحنة شهادة تحليل تبيّن الكلور المتاح عند الإرسال، وصحيفة بيانات سلامة بالإنجليزية والعربية، وفاتورة تجارية برمز النظام المنسق، وشهادة منشأ خليجية.',
  },
  {
    question: 'ما الفرق بين هيبوكلوريت الصوديوم وهيبوكلوريت الكالسيوم؟',
    answer:
      'هيبوكلوريت الصوديوم سائل (الكلور السائل) بتركيز 12–15% كلور متاح، يُضخ بمضخات الجرعات ويناسب محطات المياه والمسابح الكبيرة وصناعة المبيضات. أما هيبوكلوريت الكالسيوم فمادة صلبة (حبيبات) بتركيز 65–70% كلور متاح، تُستخدم للمعالجة الصدمية للمسابح، وتُنقل كمادة مؤكسدة (UN 1748، الفئة 5.1) ولا تُخلط أو تُخزَّن أبداً مع أقراص TCCA.',
  },
];

const breadcrumbItems = [
  { name: 'الرئيسية', url: 'https://gcoman.com/' },
  { name: 'موردو الكيماويات في عُمان', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'مورد هيبوكلوريت الصوديوم في عُمان', url: URL_AR },
];

const SodiumHypochloriteOmanAr = () => (
  <div className="min-h-screen bg-background" dir="rtl" lang="ar">
    <SEO
      title="Sodium Hypochlorite Supplier Oman | NaOCl 10–15%, All Grades"
      description="Sodium hypochlorite (NaOCl) from Muscat stock: municipal, food, 12–15% bleach and pool grades. 25 L to 1,000 L IBC and bulk, delivery across Oman and GCC."
      arTitle={meta.metaTitle}
      arDescription={meta.metaDescription}
      ogUrl={URL_EN}
      canonical={URL_EN}
    />
    <FAQStructuredData faqs={faqs} />
    <BreadcrumbStructuredData items={breadcrumbItems} />
    <SpeakableStructuredData url={URL_AR} cssSelector={['h1', 'h2', '.speakable']} />
    <Navigation />

    <main id="main-content">
      <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 text-sm px-4 py-1.5">مخزون في مسقط • من 25 لتراً إلى الصهاريج • ISO 9001:2015 • JSRS</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              مورد هيبوكلوريت الصوديوم (الكلور السائل) في عُمان
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed speakable">
              هيبوكلوريت الصوديوم (NaOCl، رقم CAS ‏7681-52-9) هو المعروف تجارياً بالكلور السائل، ويُستخدم في تطهير مياه الشرب والصرف الصحي
              والمسابح، وتطهير معدات تصنيع الأغذية، وكمادة خام للمبيض المنزلي والصناعي. تورّده جلوبال كيميكالز ذ.م.م من
              مخزونها في مسقط بدرجات معالجة المياه والدرجة الغذائية وصناعة المبيضات 12–15% والمسابح، من عبوات 25 لتراً إلى
              حاويات IBC سعة 1,000 لتر وبالجملة، في عُمان ودول الخليج.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'hypo_ar_whatsapp')}>
                <a href={WHATSAPP_AR} target="_blank" rel="noopener noreferrer nofollow">
                  <MessageCircle className="w-5 h-5" /> استفسار عبر واتساب
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <a href="tel:+96892772305">
                  <Phone className="w-5 h-5" /> <span dir="ltr">+968 9277 2305</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">ما درجات هيبوكلوريت الصوديوم المتوفرة؟</h2>
          <p className="text-muted-foreground mb-6">التركيز بالكلور المتاح. لكل درجة صفحتها بالمواصفات الكاملة.</p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">الدرجة</th>
                  <th className="px-4 py-2 font-semibold">الكلور المتاح</th>
                  <th className="px-4 py-2 font-semibold">الاستخدام</th>
                  <th className="px-4 py-2 font-semibold">التعبئة</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.link} className="border-t border-border align-top">
                    <td className="px-4 py-2">
                      <Link to={g.link} className="text-primary hover:underline font-medium">{g.name}</Link>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">{g.strength}</td>
                    <td className="px-4 py-2 text-muted-foreground">{g.use}</td>
                    <td className="px-4 py-2 text-muted-foreground">{g.packs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            يُنقل هيبوكلوريت الصوديوم برقم الأمم المتحدة UN 1791 (الفئة 8، مادة أكّالة) في عبوات HDPE معتمدة من الأمم المتحدة بأغطية تنفيس،
            بعيداً عن الشمس المباشرة. الجدول الكامل بالإنجليزية على{' '}
            <Link to="/chemical-supplier/sodium-hypochlorite-oman" className="text-primary hover:underline">صفحة هيبوكلوريت الصوديوم</Link>.
          </p>
        </div>
      </section>

      <section className="py-14 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <ThermometerSun className="w-6 h-6 text-primary" /> كيف تحافظ على تركيز الكلور السائل في حرارة الخليج؟
          </h2>
          <p className="text-muted-foreground leading-relaxed speakable">
            يتحلل هيبوكلوريت الصوديوم ببطء، في الغالب إلى كلوريد الصوديوم (الملح) وكلورات الصوديوم مع قليل من الأكسجين، وتسرّع الحرارة والضوء
            والتلامس مع المعادن هذا التحلل. تفقد درجة 12–15% قوتها تدريجياً خلال ثلاثة إلى ستة أشهر عند 15–20 درجة مئوية،
            وخلال أسابيع في حر الصيف. لذلك يُشحن في عبوات مغلقة بعيداً عن الشمس؛ وتحقق من الكلور المتاح في شهادة التحليل
            المرافقة للشحنة، وخزّنه في الظل أو داخل المبنى عند الاستلام، واطلب كميات أصغر على فترات متقاربة بدلاً من مخزون
            كبير واحد.
          </p>
        </div>
      </section>

      <section className="py-14 border-t">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> ما مهلة التوريد في عُمان والإمارات والبحرين؟
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">نقطة التسليم</th>
                  <th className="px-4 py-2 font-semibold">المهلة من مسقط</th>
                </tr>
              </thead>
              <tbody>
                {delivery.map((d) => (
                  <tr key={d.place} className="border-t border-border">
                    <td className="px-4 py-2 font-medium text-foreground">{d.place}</td>
                    <td className="px-4 py-2 text-muted-foreground">{d.lead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            نورّد أيضاً إلى السعودية وقطر والكويت براً مع شهادة منشأ. وللشحنات التصديرية، يحمل الكلور الصلب كمية أكبر من الكلور في كل طن (بالإنجليزية):{' '}
            <Link to="/chemical-supplier/calcium-hypochlorite-uae" className="text-primary hover:underline">هيبوكلوريت الكالسيوم إلى الإمارات</Link>{' '}
            و<Link to="/chemical-supplier/calcium-hypochlorite-bahrain" className="text-primary hover:underline">إلى البحرين</Link>.
            وللكلور الصلب للمسابح، انظر{' '}
            <Link to="/ar/chemical-supplier/pool-chlorine-gcc" className="text-primary hover:underline">كلور المسابح</Link>.
          </p>
          <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <Mail className="w-4 h-4" /> للاستفسارات: <a href="mailto:info@gcoman.com" className="text-primary hover:underline">info@gcoman.com</a>
            — غلا، مسقط، سلطنة عُمان
          </p>
        </div>
      </section>

      <FAQSection faqs={faqs} heading="أسئلة شائعة عن هيبوكلوريت الصوديوم" />
    </main>

    <Footer />
  </div>
);

export default SodiumHypochloriteOmanAr;
