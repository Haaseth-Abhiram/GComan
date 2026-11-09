import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, Mail, MessageCircle, Truck, FileCheck2, Sun } from 'lucide-react';
import hubAr from '@/i18n/locales/hub-pages-ar.json';

/**
 * Arabic pool-chlorine hub — /ar/chemical-supplier/pool-chlorine-gcc
 * (2026-11-05, MASTER-PLAN P9.9, Arabic half).
 *
 * Why: Google autocomplete (docs/seo/gcc-keyword-demand-2026-10-27.md) shows
 * Arabic buyers searching "كلور مسابح للبيع" (pool chlorine for sale),
 * "للبيع كلور مسابح الكويت" (Kuwait) and "كلور خام للبيع". The /ar render of
 * the English hub is noindex by design (Arabic SEO model, CLAUDE.md), so the
 * site had no Arabic page for that demand. This is a full Arabic body; its
 * meta lives in hub-pages-ar.json, which makes the /ar URL indexable through
 * scripts/sync-ar-sitemap.mjs.
 *
 * Content rule: every fact restates PoolChlorineGcc.tsx (and through it the
 * swimming-pool product data and the /chemicals/* lead times). Nothing new is
 * claimed and no price is published.
 */

const URL_EN = 'https://gcoman.com/chemical-supplier/pool-chlorine-gcc';
const URL_AR = 'https://gcoman.com/ar/chemical-supplier/pool-chlorine-gcc';
const meta = hubAr.hubPages['pool-chlorine-gcc'];

const WHATSAPP_AR =
  'https://wa.me/96892772305?text=' +
  encodeURIComponent(
    'استفسار عن كلور المسابح (gcoman.com). المنتج: هيبوكلوريت الكالسيوم / أقراص TCCA / هيبوكلوريت الصوديوم ___. الكمية الشهرية: ___. التعبئة: ___. مدينة ودولة التسليم: ___. الشركة: ___'
  );

const products = [
  { name: 'حبيبات هيبوكلوريت الكالسيوم (للصدمة)', spec: 'كلور متاح 65–70%، دون مثبّت؛ جرعة الصدمة 150–300 غ لكل 10,000 لتر، وتذوب خلال 2–4 ساعات', packs: '1 و5 و25 و50 كغ', link: '/products/swimming-pool/calcium-hypochlorite-granules' },
  { name: 'هيبوكلوريت الكالسيوم 65–75% (درجة معالجة المياه)', spec: 'كلور متاح 65–75%، رطوبة أقل من 10%', packs: 'براميل 25 كغ و45 كغ', link: '/products/water-treatment/calcium-hypochlorite-water' },
  { name: 'بودرة الكلور', spec: 'كلور متاح 65–70%، بودرة ناعمة دون مثبّت', packs: 'من 500 غ إلى 50 كغ', link: '/products/swimming-pool/chlorine-powder-pool' },
  { name: 'أقراص TCCA (حمض ثلاثي كلورو أيزوسيانوريك)', spec: 'كلور متاح 90%، مثبّتة بحمض السيانوريك؛ 20 غ و200 غ؛ تذوب خلال 3–7 أيام', packs: 'دلاء 1 و5 و10 و25 كغ', link: '/products/swimming-pool/tcca-tablet-pool' },
  { name: 'أقراص الكلور 200 غ', spec: 'كلور متاح 90%، قرصان إلى ثلاثة لكل 10,000 لتر أسبوعياً في الموزّع أو السكيمر', packs: 'دلاء', link: '/products/swimming-pool/chlorine-tablet-pool' },
  { name: 'أقراص الكلور الكبيرة 3 إنش', spec: '200 غ، كلور متاح 90%، تذوب خلال 5–7 أيام', packs: 'دلاء 5 و10 و25 كغ', link: '/products/swimming-pool/chlorine-tablet-jumbo' },
  { name: 'هيبوكلوريت الصوديوم 12–15% (درجة المسابح)', spec: 'كلور متاح 12–15%، من 0.8 إلى 1.5 لتر لكل 10,000 لتر، لمضخات الحقن والموزّعات', packs: '25 و60 و200 لتر، وحاويات IBC سعة 1,000 لتر', link: '/products/swimming-pool/sodium-hypo-chlorite-12-15' },
  { name: 'الكلور السائل 10–12%', spec: 'جاهز للاستخدام، من 1 إلى 2 لتر لكل 10,000 لتر', packs: '5 و20 و25 لتر', link: '/products/swimming-pool/chlorine-liquid-pool' },
  { name: 'مبيد الطحالب', spec: 'مركبات الأمونيوم الرباعية 10–15%، لا يسبب رغوة؛ 100–200 مل لكل 10,000 لتر في البداية، ثم 50 مل أسبوعياً', packs: '1 و5 و20 لتر', link: '/products/swimming-pool/algacide-liquid' },
  { name: 'بيسلفيت الصوديوم السائل (لإزالة الكلور)', spec: '38–40%؛ 100 مل تزيل 1 جزء في المليون من الكلور في 10,000 لتر', packs: '5 و20 و60 لتر', link: '/products/swimming-pool/sodium-bi-sulphite-liquid-pool' },
  { name: 'بيسلفيت الصوديوم أحادي الهيدرات', spec: '95% كحد أدنى؛ 70–100 غ تزيل 1 جزء في المليون من الكلور في 10,000 لتر', packs: 'أكياس 1 و5 و25 كغ', link: '/products/swimming-pool/sodium-bi-sulphite-monohydrate' },
  { name: 'خافض الأس الهيدروجيني (بيسلفات الصوديوم) ورافعه (رماد الصودا)', spec: 'حبيبات بيسلفات 93% كحد أدنى؛ رماد الصودا 99.2% كحد أدنى', packs: 'أكياس 25 كغ', link: '/products/water-treatment/sodium-bisulphate-bisulphite' },
];

const choice = [
  { pool: 'مسابح الفنادق والمنتجعات والنوادي المزوّدة بمضخة حقن', chlorine: 'هيبوكلوريت الصوديوم 12–15% في براميل 200 لتر أو حاويات IBC', why: 'الحقن المستمر يحافظ على 1–3 أجزاء في المليون من الكلور الحر دون التعامل مع مواد صلبة، وحاوية IBC هي الأقل تكلفة لكل لتر كلور' },
  { pool: 'مسابح الفلل والمساكن', chlorine: 'أقراص TCCA في موزّع عائم أو في السكيمر', why: 'تحرر بطيء على مدى 3–7 أيام، ومثبّت حمض السيانوريك يحمي الكلور من شمس الخليج' },
  { pool: 'الصدمة الأسبوعية أو بعد تكاثر الطحالب أو العواصف الرملية', chlorine: 'حبيبات هيبوكلوريت الكالسيوم 65–70%', why: 'دون مثبّت، فلا ترفع جرعة الصدمة مستوى حمض السيانوريك؛ وتذوب خلال 2–4 ساعات' },
  { pool: 'الحدائق المائية والمسابح الكبيرة', chlorine: 'بودرة هيبوكلوريت الكالسيوم في أكياس 50 كغ أو هيبوكلوريت الصوديوم بالجملة', why: 'أقل تكلفة لكل كيلوغرام كلور عند الكميات بالطن' },
  { pool: 'المسابح الداخلية والمغطاة', chlorine: 'هيبوكلوريت الكالسيوم أو هيبوكلوريت الصوديوم', why: 'لا فقد بالأشعة فوق البنفسجية، فلا حاجة إلى مثبّت ويُتجنب تراكم حمض السيانوريك' },
  { pool: 'تصريف المسبح أو مياه الغسيل العكسي', chlorine: 'بيسلفيت الصوديوم السائل أو المونوهيدرات', why: 'يزيل الكلور حتى حد التصريف؛ 100 مل من السائل تزيل 1 جزء في المليون في 10,000 لتر' },
];

const delivery = [
  { country: 'الإمارات', points: 'دبي والشارقة وأبوظبي ورأس الخيمة؛ الفجيرة والساحل الشرقي', lead: '3–5 أيام عمل براً؛ الفجيرة في نفس اليوم أو اليوم التالي' },
  { country: 'السعودية', points: 'الدمام والخبر والجبيل؛ الرياض؛ جدة وينبع', lead: 'المنطقة الشرقية 4–6 أيام عمل؛ الرياض 5–7 أيام عمل؛ جدة وينبع بحراً عبر صحار بمدة تُحدَّد لكل رحلة' },
  { country: 'قطر', points: 'الدوحة ومسيعيد ولوسيل واللؤلؤة', lead: '3–5 أيام عمل براً' },
  { country: 'الكويت', points: 'مدينة الكويت والسالمية والشعيبة', lead: '4–6 أيام عمل براً' },
  { country: 'البحرين', points: 'المنامة وسترة وأمواج', lead: '3–5 أيام عمل عبر جسر الملك فهد' },
  { country: 'عُمان', points: 'مسقط وصحار وصلالة والدقم', lead: 'مسقط في نفس اليوم؛ صحار في اليوم التالي؛ صلالة والدقم 2–3 أيام' },
];

const faqs = [
  {
    question: 'أين أجد كلور مسابح للبيع في الإمارات أو الكويت؟',
    answer:
      'تورّد جلوبال كيميكالز ذ.م.م كلور المسابح من مخزونها في مسقط إلى الإمارات والسعودية وقطر والكويت والبحرين وعُمان: حبيبات وبودرة هيبوكلوريت الكالسيوم، وأقراص TCCA بأحجام 20 غ و200 غ والكبيرة 3 إنش، وهيبوكلوريت الصوديوم 12–15%. تصل الشحنات إلى دبي والشارقة وأبوظبي خلال 3 إلى 5 أيام عمل براً، وإلى مدينة الكويت خلال 4 إلى 6 أيام. أرسل المنتج والكمية ومدينة التسليم إلى info@gcoman.com أو عبر واتساب للحصول على عرض سعر.',
  },
  {
    question: 'أيهما أفضل لمسبح الفندق: أقراص الكلور أم هيبوكلوريت الكالسيوم أم الكلور السائل؟',
    answer:
      'المسبح المزوّد بمضخة حقن يعمل بهيبوكلوريت الصوديوم 12–15% من البراميل أو حاويات IBC. والمسبح من دونها يستخدم أقراص TCCA في موزّع للتعقيم اليومي، لأن مثبّت حمض السيانوريك يبطئ فقد الكلور تحت شمس الخليج. أما حبيبات هيبوكلوريت الكالسيوم فهي منتج الصدمة للنوعين، أسبوعياً أو بعد تكاثر الطحالب، لأنها خالية من المثبّت ولا ترفع مستوى حمض السيانوريك.',
  },
  {
    question: 'كم أحتاج من هيبوكلوريت الكالسيوم لصدمة مسبح سعته 10,000 لتر؟',
    answer:
      'من الحبيبات بتركيز 65–70%: من 150 إلى 300 غ لكل 10,000 لتر، تُذاب في دلو من ماء المسبح وتُضاف والمضخة تعمل، وتنتهي الصدمة خلال ساعتين إلى أربع ساعات. ومن هيبوكلوريت الصوديوم 12–15%: من 1 إلى 2 لتر لكل 10,000 لتر.',
  },
  {
    question: 'كيف يُشحن كلور المسابح من عُمان إلى دول الخليج؟',
    answer:
      'يُشحن هيبوكلوريت الكالسيوم مادةً مؤكسدة من الفئة 5.1 برقم UN 2880 (المائي) أو UN 1748 (الجاف)، أو UN 3487 / UN 3485 إذا صُنّف أكّالاً أيضاً، بحسب القسم 14 من صحيفة بيانات السلامة، وأقراص TCCA برقم UN 2468 من الفئة 5.1 أيضاً، ومحلول هيبوكلوريت الصوديوم برقم UN 1791 من الفئة 8. تُفصل الشحنات عن الأحماض والمواد العضوية والوقود، وتُحفظ جافة وفي الظل، وترافقها صحيفة بيانات السلامة وفق نظام GHS بالإنجليزية والعربية. يُمنع تخزين هيبوكلوريت الكالسيوم وأقراص TCCA أو تحميلهما معاً، لأنهما يتفاعلان بعنف عند اختلاطهما.',
  },
  {
    question: 'هل لديكم قائمة أسعار لكلور المسابح بالجملة؟',
    answer:
      'لا توجد قائمة أسعار ثابتة منشورة، لأن أسعار هيبوكلوريت الكالسيوم وهيبوكلوريت الصوديوم تتغير مع أسواق المواد الخام وحجم التعبئة. أرسل المنتج والكمية الشهرية وطريقة التعبئة ومدينة التسليم، ويصلك عرض السعر بالكيلوغرام أو بالدلو أو بحاوية IBC خلال 24 ساعة. تُقدَّم أسعار الطبليات والحاويات لمجموعات الفنادق ومقاولي المسابح والموزعين.',
  },  {
    question: 'هل يمكن شراء أقراص الكلور منكم في الكويت أو السعودية؟',
    answer:
      'نعم. تصل أقراص TCCA بحجم 200 غ والكبيرة 3 إنش في دلاء من 5 إلى 25 كغ إلى مدينة الكويت خلال 4 إلى 6 أيام عمل براً، وإلى الدمام والخبر والجبيل خلال 4 إلى 6 أيام، والرياض خلال 5 إلى 7 أيام، وجدة بحراً عبر ميناء صحار بمدة تُحدَّد لكل رحلة. ترافق كل شحنة شهادة تحليل وصحيفة بيانات السلامة ومستندات التصدير والجمارك.',
  },
];

const breadcrumbItems = [
  { name: 'الرئيسية', url: 'https://gcoman.com/' },
  { name: 'موردو الكيماويات في الشرق الأوسط', url: 'https://gcoman.com/chemical-suppliers-middle-east' },
  { name: 'مورد كلور المسابح في الخليج', url: URL_AR },
];

const PoolChlorineGccAr = () => (
  <div className="min-h-screen bg-background" dir="rtl" lang="ar">
    <SEO
      title="Pool Chlorine & Calcium Hypochlorite Supplier UAE & GCC"
      description="Calcium hypochlorite 65–70%, TCCA 90% tablets, sodium hypochlorite 12–15% and algaecide from Muscat stock to the UAE, Saudi Arabia, Kuwait, Qatar and Bahrain."
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
            <Badge className="mb-4 text-sm px-4 py-1.5">هيبوكلوريت الكالسيوم 65–70% • أقراص TCCA 90% • هيبوكلوريت 12–15% • مخزون في مسقط • ISO 9001:2015</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              مورد كلور المسابح وهيبوكلوريت الكالسيوم للإمارات والسعودية والكويت ودول الخليج
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed speakable">
              تورّد جلوبال كيميكالز ذ.م.م كلور المسابح من مخزونها في مسقط إلى الفنادق والمنتجعات والحدائق المائية ومقاولي
              المسابح وشركات إدارة المرافق والموزعين في الإمارات والسعودية وقطر والكويت والبحرين وعُمان: حبيبات وبودرة
              هيبوكلوريت الكالسيوم، وأقراص TCCA بأحجام 20 غ و200 غ والكبيرة، وهيبوكلوريت الصوديوم 12–15%، ومبيد الطحالب،
              ومواد ضبط الأس الهيدروجيني وإزالة الكلور. تصل الشحنات إلى دبي خلال 3 إلى 5 أيام عمل براً وإلى الكويت خلال 4
              إلى 6 أيام، وترافق كل شحنة شهادة تحليل وصحيفة بيانات سلامة وفق نظام GHS بالإنجليزية والعربية ومستندات التصدير والجمارك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'pool_gcc_ar_whatsapp')}>
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">ما أنواع كلور المسابح المتوفرة للبيع؟</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">المنتج</th>
                  <th className="px-4 py-2 font-semibold">المواصفات والجرعة</th>
                  <th className="px-4 py-2 font-semibold">التعبئة</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.link} className="border-t border-border align-top">
                    <td className="px-4 py-2">
                      <Link to={p.link} className="text-primary hover:underline font-medium">{p.name}</Link>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{p.spec}</td>
                    <td className="px-4 py-2 text-muted-foreground">{p.packs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            المواصفات الكاملة بالإنجليزية على صفحة{' '}
            <Link to="/chemical-supplier/pool-chlorine-gcc" className="text-primary hover:underline">كلور المسابح</Link>{' '}
            وفي فئة{' '}
            <Link to="/products/swimming-pool" className="text-primary hover:underline">كيماويات المسابح</Link>.
          </p>
        </div>
      </section>

      <section className="py-14 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sun className="w-6 h-6 text-primary" /> أي كلور يناسب أي مسبح في الخليج؟
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 speakable">
            تفقد مسابح الخليج الكلور أسرع مما تفترضه الملصقات: حرارة المياه فوق 30 درجة مئوية طوال الصيف، والأشعة فوق
            البنفسجية القوية معظم العام، والغبار بعد رياح الشمال، كلها ترفع الجرعة المطلوبة. والحل المعتاد منتج مثبّت للتعقيم
            اليومي ومنتج غير مثبّت للصدمة، حتى لا يرتفع حمض السيانوريك إلى حد يُفقد الكلور فعاليته.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border bg-background">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">المسبح</th>
                  <th className="px-4 py-2 font-semibold">الكلور</th>
                  <th className="px-4 py-2 font-semibold">السبب</th>
                </tr>
              </thead>
              <tbody>
                {choice.map((c) => (
                  <tr key={c.pool} className="border-t border-border align-top">
                    <td className="px-4 py-2 font-medium text-foreground">{c.pool}</td>
                    <td className="px-4 py-2 text-muted-foreground">{c.chlorine}</td>
                    <td className="px-4 py-2 text-muted-foreground">{c.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-14 border-t">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> إلى أين توصلون كلور المسابح في الخليج؟
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">الدولة</th>
                  <th className="px-4 py-2 font-semibold">نقاط التسليم</th>
                  <th className="px-4 py-2 font-semibold">مهلة التسليم من مسقط</th>
                </tr>
              </thead>
              <tbody>
                {delivery.map((d) => (
                  <tr key={d.country} className="border-t border-border align-top">
                    <td className="px-4 py-2 font-medium text-foreground">{d.country}</td>
                    <td className="px-4 py-2 text-muted-foreground">{d.points}</td>
                    <td className="px-4 py-2 text-muted-foreground">{d.lead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-14 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-primary" /> ما المستندات وقواعد النقل؟
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            شهادة تحليل للدفعة تبيّن نسبة الكلور المتاح، وصحيفة بيانات السلامة وفق نظام GHS بالإنجليزية والعربية، وصحيفة
            بيانات فنية، ومستندات التصدير والجمارك، وفاتورة تجارية برموز النظام المنسق. هيبوكلوريت
            الكالسيوم (UN 2880 أو UN 1748 أو UN 3487 / 3485 بحسب صحيفة بيانات السلامة) وأقراص TCCA (UN 2468) من الفئة 5.1، ومحلول هيبوكلوريت الصوديوم (UN 1791) من الفئة 8،
            لذلك تُفصل الشحنات عن الأحماض والمواد العضوية والوقود وتُحفظ جافة وفي الظل أثناء النقل وفي مخزنك.
          </p>
          <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <Mail className="w-4 h-4" /> للاستفسارات: <a href="mailto:info@gcoman.com" className="text-primary hover:underline">info@gcoman.com</a>
            — مسقط، سلطنة عُمان
          </p>
        </div>
      </section>

      <FAQSection faqs={faqs} heading="أسئلة شائعة عن كلور المسابح في الخليج" />
    </main>

    <Footer />
  </div>
);

export default PoolChlorineGccAr;
