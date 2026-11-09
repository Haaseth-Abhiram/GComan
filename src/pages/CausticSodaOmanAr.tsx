import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, Mail, MessageCircle, Truck, Scale } from 'lucide-react';
import hubAr from '@/i18n/locales/hub-pages-ar.json';

/**
 * Arabic caustic soda hub — /ar/chemical-supplier/caustic-soda-oman
 * (2026-11-09, MASTER-PLAN P10.15).
 *
 * Why: "صودا كاوية قشور" is the Arabic GCC autocomplete phrasing for caustic
 * (docs/seo/gcc-keyword-demand-2026-10-27.md), caustic is a core product the
 * user wants to lead on (2026-11-08), and the /ar render of the English hub was
 * noindex by design (Arabic SEO model, CLAUDE.md). This is a full Arabic body;
 * its meta lives in hub-pages-ar.json, which makes the /ar URL indexable
 * through scripts/sync-ar-sitemap.mjs.
 *
 * Content rule: every fact restates CausticSodaOman.tsx, the caustic product
 * JSON (water-treatment + food-beverage) and CausticSodaCountry.tsx (UAE /
 * Saudi lanes). Nothing new is claimed and no price is published. Product
 * links go to the /ar product twins, which are indexable.
 */

const URL_EN = 'https://gcoman.com/chemical-supplier/caustic-soda-oman';
const URL_AR = 'https://gcoman.com/ar/chemical-supplier/caustic-soda-oman';
const meta = hubAr.hubPages['caustic-soda-oman'];

const WHATSAPP_AR =
  'https://wa.me/96892772305?text=' +
  encodeURIComponent(
    'استفسار عن الصودا الكاوية (gcoman.com). الشكل: قشور / حبيبات / سائلة ___. الدرجة: تقنية / غذائية. الكمية: ___. مدينة التسليم: ___. الشركة: ___'
  );

const forms = [
  { name: 'صودا كاوية قشور', strength: '98–99% هيدروكسيد الصوديوم', note: 'رطوبة أقل من 1%، كربونات الصوديوم أقل من 0.8%', packs: 'أكياس 25 كغ، أكياس جامبو 1,000 كغ', link: '/ar/products/water-treatment/caustic-soda-flakes' },
  { name: 'صودا كاوية حبيبات (بريل)', strength: '99% كحد أدنى', note: 'كريات 0.5–1.0 مم، قليلة الغبار وسهلة الانسياب', packs: 'أكياس 25 كغ، أكياس جامبو 500 كغ', link: '/ar/products/water-treatment/caustic-soda-prills' },
  { name: 'صودا كاوية سائلة', strength: '32% أو 48% أو 50%', note: 'الكثافة النوعية نحو 1.35–1.52', packs: 'عبوات 25 لتر، براميل 200 لتر، حاويات IBC سعة 1,000 لتر، وصهاريج', link: '/ar/products/water-treatment/caustic-soda-liquid' },
  { name: 'صودا كاوية سائلة غذائية (E524)', strength: '30–50%', note: 'معادن ثقيلة أقل من 5 أجزاء في المليون (ppm)، للتنظيف في المكان (CIP)', packs: 'عبوات 25 لتر، براميل 200 لتر، حاويات IBC', link: '/ar/products/food-beverage/caustic-soda-liquid-food' },
];

const uses = [
  'معالجة المياه: رفع الرقم الهيدروجيني للمياه المحلاة قبل التوزيع ومعادلة المياه العادمة الحمضية',
  'صناعة الصابون والمنظفات: تصبين الزيوت والدهون ومعادلة حمض السلفونيك (LABSA)',
  'النفط والغاز والمصافي: غسل الغاز الحمضي وكبريتيد الهيدروجين بالصودا الكاوية',
  'الصناعات الغذائية: المرحلة القلوية في التنظيف في المكان (CIP) وتقشير الفواكه والخضروات بالدرجة الغذائية',
  'الألمنيوم والنسيج والورق: حفر الألمنيوم وتنظيفه، وغلي القطن وتنظيفه ومرسرته، وطبخ لب الورق',
];

const delivery = [
  { place: 'مسقط والرسيل', lead: 'في نفس اليوم للطلبات قبل الساعة 12 ظهراً' },
  { place: 'صحار', lead: 'في اليوم التالي' },
  { place: 'صلالة والدقم ونزوى وصور', lead: 'خلال يومين إلى ثلاثة أيام عمل' },
  { place: 'الإمارات (أبوظبي ودبي والشارقة)', lead: '3–5 أيام عمل؛ الفجيرة في نفس اليوم أو اليوم التالي' },
  { place: 'السعودية (الدمام والخبر والجبيل)', lead: '4–6 أيام عمل براً؛ الرياض 5–7' },
  { place: 'قطر والبحرين', lead: '3–5 أيام عمل' },
  { place: 'الكويت', lead: '4–6 أيام عمل' },
];

const faqs = [
  {
    question: 'أين أجد صودا كاوية للبيع في عُمان؟',
    answer:
      'تورّد جلوبال كيميكالز ذ.م.م الصودا الكاوية (هيدروكسيد الصوديوم، NaOH، رقم CAS ‏1310-73-2) من مخزونها في مسقط: قشور 98–99% وحبيبات 99% في أكياس 25 كغ، وسائلة بتركيز 32% و48% و50% في عبوات وبراميل وحاويات IBC، بالدرجة التقنية والدرجة الغذائية (E524). لا يوجد حد أدنى لطلب الصودا الصلبة، من كيس واحد 25 كغ إلى حمولة شاحنة كاملة؛ وللسائلة الحد الأدنى المعتاد برميل 200 لتر أو حاوية IBC واحدة.',
  },
  {
    question: 'ما الفرق بين الصودا الكاوية القشور والحبيبات والسائلة؟',
    answer:
      'كلها هيدروكسيد الصوديوم، ويختلف الشكل والتركيز فقط. القشور 98–99% هي الشكل الصلب الأقل كلفة والأكثر توفراً في عُمان، لكنها تثير بعض الغبار. والحبيبات 99% كريات صغيرة سهلة الانسياب قليلة الغبار، تُفضَّل في أنظمة الجرعات الآلية. أما السائلة فجاهزة للضخ دون إذابة، وتناسب المحطات التي تضخ الصودا باستمرار.',
  },
  {
    question: 'هل تتوفر صودا كاوية غذائية؟',
    answer:
      'نعم. الصودا الكاوية السائلة الغذائية (E524) بتركيز 30–50% ومعادن ثقيلة أقل من 5 أجزاء في المليون (ppm)، تُستخدم في المرحلة القلوية للتنظيف في المكان (CIP) في مصانع الألبان والمشروبات بتركيز 0.5–2% عادةً، وفي تقشير الفواكه والخضروات. ترافق كل دفعة شهادة تحليل.',
  },
  {
    question: 'كيف تُذاب الصودا الكاوية بأمان؟',
    answer:
      'تطلق إذابة هيدروكسيد الصوديوم حرارة كبيرة تكفي لغليان كمية صغيرة من الماء. أضف القشور أو الحبيبات ببطء إلى ماء بارد في وعاء يتحمل الحرارة مع التحريك، ولا تضف الماء إلى الصودا أبداً، وارتدِ واقي الوجه والقفازات. أبعد الصودا الكاوية عن الأحماض وعن الألمنيوم والزنك والقصدير.',
  },
  {
    question: 'هل توردون الصودا الكاوية إلى الإمارات والسعودية؟',
    answer:
      'نعم. تصل إلى أبوظبي ودبي والشارقة خلال 3–5 أيام عمل، وإلى الدمام والخبر والجبيل خلال 4–6 أيام عمل براً، والرياض خلال 5–7. ترافق كل شحنة شهادة تحليل، وصحيفة بيانات سلامة بالإنجليزية والعربية، وفاتورة تجارية برمز النظام المنسق، ومستندات المنشأ المناسبة للدرجة (شهادة منشأ خليجية للمنتج المصنوع في الخليج).',
  },
];

const breadcrumbItems = [
  { name: 'الرئيسية', url: 'https://gcoman.com/' },
  { name: 'موردو الكيماويات في عُمان', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'مورد الصودا الكاوية في عُمان', url: URL_AR },
];

const CausticSodaOmanAr = () => (
  <div className="min-h-screen bg-background" dir="rtl" lang="ar">
    <SEO
      title="Caustic Soda Supplier Oman | NaOH Flakes, Prills & Liquid | Global Chemicals LLC"
      description="Caustic soda (sodium hydroxide) supplier in Oman. Flakes 98–99%, prills 99%, liquid 32–50%. Food-grade & technical. Same-day Muscat delivery. JSRS certified."
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
            <Badge className="mb-4 text-sm px-4 py-1.5">مخزون في مسقط • تقنية وغذائية E524 • ISO 9001:2015 • JSRS</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              مورد الصودا الكاوية في عُمان: قشور وحبيبات وسائلة
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed speakable">
              تورّد جلوبال كيميكالز ذ.م.م الصودا الكاوية (هيدروكسيد الصوديوم، NaOH) من مخزونها في مسقط: قشور 98–99%،
              وحبيبات 99%، وسائلة بتركيز 32–50%، بالدرجة التقنية والدرجة الغذائية (E524)، لمحطات معالجة المياه ومصانع
              الصابون والمنظفات والأغذية وقطاع النفط والغاز في عُمان ودول الخليج، مع التوصيل في نفس اليوم داخل مسقط.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'caustic_ar_whatsapp')}>
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">ما أشكال الصودا الكاوية المتوفرة؟</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">الشكل</th>
                  <th className="px-4 py-2 font-semibold">التركيز</th>
                  <th className="px-4 py-2 font-semibold">المواصفات</th>
                  <th className="px-4 py-2 font-semibold">التعبئة</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((f) => (
                  <tr key={f.link} className="border-t border-border align-top">
                    <td className="px-4 py-2">
                      <Link to={f.link} className="text-primary hover:underline font-medium">{f.name}</Link>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{f.strength}</td>
                    <td className="px-4 py-2 text-muted-foreground">{f.note}</td>
                    <td className="px-4 py-2 text-muted-foreground">{f.packs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            تُنقل الصودا الكاوية الصلبة تحت رقم الأمم المتحدة UN 1823 والمحلول تحت UN 1824، وكلاهما من الفئة 8 (مادة أكّالة). جدول
            المواصفات الكامل بالإنجليزية على{' '}
            <Link to="/chemical-supplier/caustic-soda-oman" className="text-primary hover:underline">صفحة الصودا الكاوية</Link>.
          </p>
          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">أين تُستخدم الصودا الكاوية؟</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pr-5">
            {uses.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" /> قشور أم سائلة؟
          </h2>
          <p className="text-muted-foreground leading-relaxed speakable">
            الكيلوغرام الواحد من القشور أو الحبيبات يعطي كيلوغرامين من محلول 50%، فشاحنة الصودا الصلبة تحمل نحو ضعف كمية
            هيدروكسيد الصوديوم في الوزن نفسه من السائلة 50%، ونحو ثلاثة أضعاف السائلة 32%. تناسب الصودا الصلبة المصانع التي
            لديها خزان إذابة ومن يريد مخزوناً يدوم أشهراً إذا بقي مغلقاً وجافاً، وتناسب السائلة الجرعات المستمرة بمضخة: دون
            أكياس ولا خزان إذابة، مع أن تخفيف السائلة 48–50% يطلق حرارة أيضاً، فأضف الصودا إلى الماء لا العكس.
          </p>
        </div>
      </section>

      <section className="py-14 border-t">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> ما مهلة التوريد في عُمان ودول الخليج؟
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
            التفاصيل بالإنجليزية:{' '}
            <Link to="/chemical-supplier/caustic-soda-uae" className="text-primary hover:underline">الصودا الكاوية إلى الإمارات</Link>{' '}
            و<Link to="/chemical-supplier/caustic-soda-saudi-arabia" className="text-primary hover:underline">إلى السعودية</Link>.
          </p>
          <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <Mail className="w-4 h-4" /> للاستفسارات: <a href="mailto:info@gcoman.com" className="text-primary hover:underline">info@gcoman.com</a>
            — غلا، مسقط، سلطنة عُمان
          </p>
        </div>
      </section>

      <FAQSection faqs={faqs} heading="أسئلة شائعة عن الصودا الكاوية في عُمان" />
    </main>

    <Footer />
  </div>
);

export default CausticSodaOmanAr;
