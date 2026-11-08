import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, Mail, MessageCircle, Sprout, Truck, Droplets } from 'lucide-react';
import hubAr from '@/i18n/locales/hub-pages-ar.json';

/**
 * Arabic fertilizer hub — /ar/chemical-supplier/fertilizers-oman
 * (2026-11-08, MASTER-PLAN P9.6).
 *
 * Why: urea is the only product whose Arabic autocomplete names Oman
 * (docs/seo/gcc-keyword-demand-2026-10-27.md): "يوريا عمان",
 * "يوريا للبيع في عمان", "يوريا للبيع في الامارات", "سماد يوريا للبيع". The /ar
 * render of the English hub was noindex by design (Arabic SEO model,
 * CLAUDE.md), so that demand had no Arabic page. This is a full Arabic body,
 * led by a urea section; its meta lives in hub-pages-ar.json, which makes the
 * /ar URL indexable through scripts/sync-ar-sitemap.mjs.
 *
 * Content rule: every fact restates FertilizersOman.tsx and the agro product
 * data (src/data/products/agro.json, urea-fertilizer longDescription). Nothing
 * new is claimed and no price is published. Product links go to the /ar
 * product twins, which are indexable (products-ar.json, 277/277).
 */

const URL_EN = 'https://gcoman.com/chemical-supplier/fertilizers-oman';
const URL_AR = 'https://gcoman.com/ar/chemical-supplier/fertilizers-oman';
const meta = hubAr.hubPages['fertilizers-oman'];

const WHATSAPP_AR =
  'https://wa.me/96892772305?text=' +
  encodeURIComponent(
    'استفسار عن الأسمدة (gcoman.com). المنتج: يوريا / DAP / بوتاس / نترات الكالسيوم ___. الكمية بالطن: ___. التعبئة: أكياس 25 أو 50 كغ / أكياس جامبو 1,000 كغ. مدينة التسليم: ___. الشركة: ___'
  );

const products = [
  { name: 'سماد اليوريا 46% نيتروجين', analysis: 'نيتروجين كلي 46% كحد أدنى · بيوريت أقل من 1.0%', packs: 'أكياس 25 كغ، أكياس جامبو 1,000 كغ', id: 'urea-fertilizer' },
  { name: 'فوسفات ثنائي الأمونيوم (DAP 18-46-0)', analysis: 'نيتروجين 18% كحد أدنى · فوسفور (P2O5) 46% كحد أدنى', packs: 'أكياس 50 كغ، أكياس جامبو 1,000 كغ', id: 'dap-fertilizer' },
  { name: 'أسمدة NPK المركبة (خلطات مخصصة)', analysis: 'الدرجات الذوّابة: مواد غير ذائبة أقل من 0.1% · نسب قياسية 20-20-20 و19-19-19 و15-15-15 و15-5-30 و12-12-36', packs: 'أكياس 25 كغ، أكياس جامبو 1,000 كغ', id: 'npk-fertilizer' },
  { name: 'كلوريد البوتاسيوم (MOP بوتاس 60%)', analysis: 'K2O 60% كحد أدنى · كلوريد 46–47%', packs: 'أكياس 50 كغ، أكياس جامبو 1,000 كغ', id: 'potassium-chloride-fertilizer' },
  { name: 'سماد نترات الكالسيوم', analysis: 'نيتروجين 15.5% (14.4% نتراتي و1.1% أمونيومي) · أكسيد الكالسيوم (CaO) 26.5%', packs: 'أكياس 25 كغ، أكياس جامبو 1,000 كغ', id: 'calcium-nitrate-fertilizer' },
  { name: 'كبريتات الزنك أحادية الماء (33% زنك) — زراعية', analysis: 'زنك 33% كحد أدنى · كبريت 15% كحد أدنى', packs: 'أكياس 25 كغ', id: 'zinc-sulphate-agricultural' },
  { name: 'الجبس الزراعي (كبريتات الكالسيوم)', analysis: 'كالسيوم نحو 20% كحد أدنى · كبريت نحو 16% كحد أدنى', packs: 'أكياس 25 كغ، أكياس جامبو 1,000 كغ، سائب', id: 'agricultural-gypsum' },
  { name: 'حمض الهيوميك (مستخلص الليوناردايت)', analysis: 'أحماض هيوميك كلية 65–75% · حمض الفولفيك 10–15%', packs: 'أكياس 25 كغ', id: 'humic-acid-fertilizer' },
];

const fertigation = [
  { product: 'نترات الكالسيوم', tank: 'الخزان A فقط', rule: 'لا تُخلط أبداً مع الفوسفات أو الكبريتات: تتكوّن فوسفات الكالسيوم أو الجبس فتنسدّ النقاطات.' },
  { product: 'NPK الذوّاب وMAP والأسمدة الكبريتية', tank: 'الخزان B', rule: 'تُبعد عن الكالسيوم، ولا تلتقي بالخزان A إلا مخففة في خط الري.' },
  { product: 'اليوريا', tank: 'A أو B', rule: 'تذوب كلياً وتبرّد الخزان أثناء الذوبان. لا تُخلط جافة مع نترات الكالسيوم.' },
  { product: 'كلوريد البوتاسيوم (الدرجة القياسية)', tank: 'A أو B', rule: 'يذوب كلياً لكنه يضيف الكلوريد، فتُفضَّل كبريتات البوتاسيوم (SOP) حيث مياه الري مالحة.' },
  { product: 'كبريتات الزنك', tank: 'ليس مع الفوسفات', rule: 'يترسّب الزنك على شكل فوسفات الزنك؛ تُحقن منفصلة أو تُرش على الأوراق.' },
  { product: 'حمض الهيوميك', tank: 'منفصل، بعد إذابته مسبقاً', rule: 'يتكتّل ويترسّب في المياه الحمضية أو شديدة العسر؛ يُذاب أولاً ويُختبر في وعاء.' },
  { product: 'DAP', tank: 'غير مناسب للتنقيط', rule: 'يُضاف سماداً أساسياً في شرائط داخل التربة؛ وللتسميد مع الري استخدم MAP أو NPK الذوّاب.' },
];

const faqs = [
  {
    question: 'أين أجد يوريا للبيع في عُمان؟',
    answer:
      'تورّد جلوبال كيميكالز ذ.م.م يوريا 46% نيتروجين من مخزونها في مسقط، بنوعيها البريل (المكوّرة، 1–2.4 مم) والمحبّبة (جرانيولار، 2–4 مم)، في أكياس 25 كغ وأكياس جامبو 1,000 كغ، بنسبة بيوريت أقل من 1.0% ورطوبة أقل من 0.5%. التسليم في نفس اليوم داخل مسقط، وفي اليوم التالي إلى صحار والباطنة، وخلال يومين إلى ثلاثة أيام إلى صلالة والدقم. أرسل النوع والكمية بالطن ونقطة التسليم للحصول على عرض سعر.',
  },
  {
    question: 'هل توردون اليوريا إلى الإمارات ودول الخليج؟',
    answer:
      'نعم. تُشحن اليوريا والأسمدة الأخرى من مسقط براً إلى الإمارات والسعودية وقطر والكويت والبحرين مع شهادة منشأ، وتصل اليوريا خلال يومين إلى سبعة أيام.',
  },
  {
    question: 'أيهما أطلب: اليوريا البريل أم المحبّبة؟',
    answer:
      'البريل أسرع ذوباناً، فتناسب التسميد مع الري بالتنقيط والرش الورقي. أما المحبّبة فتنتشر بانتظام من آلات النثر وتُخلط مع الأسمدة المحبّبة الأخرى دون أن تنفصل عنها. وللرش الورقي بمحلول 0.5–1.0% استخدم منتجاً منخفض البيوريت، لأن البيوريت سام لأوراق النبات.',
  },
  {
    question: 'ما الأسمدة التي يمكن خلطها في خزان التسميد نفسه؟',
    answer:
      'توضع نترات الكالسيوم في خزان مستقل (الخزان A)، لأنها تكوّن فوسفات الكالسيوم مع الفوسفات والجبس مع الكبريتات، وكلاهما يسدّ النقاطات. وتوضع المنتجات المحتوية على الفوسفات أو الكبريتات، مثل NPK الذوّاب وMAP، في الخزان B. واليوريا وكلوريد البوتاسيوم القياسي يناسبان أياً من الخزانين. لا تُخلط كبريتات الزنك مع الفوسفات، وDAP غير مناسب لخطوط التنقيط.',
  },
  {
    question: 'هل أستخدم كلوريد البوتاسيوم (MOP) أم كبريتات البوتاسيوم (SOP)؟',
    answer:
      'كلوريد البوتاسيوم هو أقل مصادر البوتاسيوم تكلفة، لكنه يضيف الكلوريد. وحيث تكون مياه الري مالحة أصلاً، أو للمحاصيل الحساسة للكلوريد مثل الحمضيات والأفوكادو والفراولة، فكبريتات البوتاسيوم هي الخيار الأسلم. نورّد كلوريد البوتاسيوم من المخزون وكبريتات البوتاسيوم عند الطلب.',
  },
  {
    question: 'كيف أستصلح التربة المالحة أو الصودية؟',
    answer:
      'يوفّر الجبس الزراعي كالسيوم ذائباً يحلّ محل الصوديوم في التربة، لكنه لا يفيد إلا إذا غُسل الصوديوم بعد ذلك إلى ما تحت منطقة الجذور. أضفه قبل رية غزيرة تتسرّب عبر مقطع التربة، ثم اغسل التربة بأفضل مياه متاحة. تعتمد الجرعة على نسبة الصوديوم المتبادل في التربة، لذا افحص التربة أولاً.',
  },
];

const breadcrumbItems = [
  { name: 'الرئيسية', url: 'https://gcoman.com/' },
  { name: 'موردو الكيماويات في عُمان', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'مورد الأسمدة في عُمان', url: URL_AR },
];

const FertilizersOmanAr = () => (
  <div className="min-h-screen bg-background" dir="rtl" lang="ar">
    <SEO
      title="Fertilizer Supplier Oman | Urea, DAP, MOP, Calcium Nitrate"
      description="Urea 46%, DAP 18-46-0, MOP 60%, calcium nitrate, NPK, zinc sulphate, gypsum and humic acid from Muscat stock. 25–50 kg bags and big bags, GCC delivery."
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
            <Badge className="mb-4 text-sm px-4 py-1.5">مخزون في مسقط • من أكياس 25 كغ إلى أكياس جامبو 1,000 كغ • ISO 9001:2015 • JSRS</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              مورد الأسمدة في عُمان: يوريا للبيع، DAP، بوتاس ونترات الكالسيوم
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed speakable">
              تورّد جلوبال كيميكالز ذ.م.م اليوريا وفوسفات ثنائي الأمونيوم (DAP) وكلوريد البوتاسيوم ونترات الكالسيوم وأسمدة
              NPK المركبة وكبريتات الزنك والجبس الزراعي وحمض الهيوميك من مخزونها في مسقط إلى مزارع النخيل ومزارعي الخضروات
              والبيوت المحمية ومزارع الأعلاف ومقاولي تنسيق الحدائق في عُمان ودول الخليج، في أكياس 25 كغ و50 كغ وأكياس جامبو
              1,000 كغ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'fertilizers_ar_whatsapp')}>
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-primary" /> يوريا للبيع في عُمان والإمارات: ما المتوفر؟
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p className="speakable">
              اليوريا بتركيز 46% نيتروجين هي أعلى الأسمدة النيتروجينية الصلبة تركيزاً، والمصدر الرئيسي للنيتروجين في زراعة
              عُمان: مزارع النخيل في الباطنة والداخلية، ومزارع الخضروات، والبيوت المحمية، ومحاصيل الحبوب والأعلاف. نورّد يوريا
              قياسية من الدرجة السمادية بنوعيها البريل (المكوّرة، 1–2.4 مم) والمحبّبة (جرانيولار، 2–4 مم) من مخزون مسقط في أكياس 25 كغ وأكياس جامبو
              1,000 كغ، بنسبة بيوريت أقل من 1.0% ورطوبة أقل من 0.5%.
            </p>
            <p>
              تُضاف اليوريا للنخيل عادة بمعدل 150–300 كغ للهكتار في الموسم، مقسّمة على عدة دفعات من أواخر الشتاء حتى نمو
              الثمار بدلاً من دفعة واحدة كبيرة. وفي تربة عُمان الكلسية القلوية (<span dir="ltr">pH 7.5–8.5</span>) تتحلل اليوريا المتروكة على السطح
              وتفقد جزءاً كبيراً من نيتروجينها على شكل غاز الأمونيا، لذا تُخلط بالتربة أو تُروى في اليوم نفسه، أو تُعطى مع
              مياه التنقيط حيث يكون الفقد قليلاً.
            </p>
            <p>
              اليوريا مادة ماصّة للرطوبة: أبقِ الأكياس مغلقة، مرفوعة عن الأرض وبعيدة عن الشمس المباشرة، فهي تتكتل خلال أيام
              بعد فتحها في هواء الساحل الرطب. ولا تخلطها جافة مع نترات الكالسيوم أو نترات الأمونيوم، لأن الخليط يمتص الرطوبة
              ويتحول إلى عجينة في المخزن. أما يوريا السيارات المخصصة لسائل عادم الديزل فمواصفاتها مختلفة، فاسأل قبل الطلب لهذا
              الاستخدام.
            </p>
          </div>
          <div className="mt-6">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/ar/products/agro/urea-fertilizer">مواصفات سماد اليوريا 46% كاملة</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-14 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">ما الأسمدة المتوفرة في المخزون بعُمان؟</h2>
          <p className="text-muted-foreground mb-6">لكل منتج صفحته بالمواصفات الكاملة ومعدلات الاستخدام وإرشادات التداول.</p>
          <div className="overflow-x-auto rounded-lg border border-border bg-background">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">السماد</th>
                  <th className="px-4 py-2 font-semibold">التحليل</th>
                  <th className="px-4 py-2 font-semibold">التعبئة</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border align-top">
                    <td className="px-4 py-2">
                      <Link to={`/ar/products/agro/${p.id}`} className="text-primary hover:underline font-medium">{p.name}</Link>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{p.analysis}</td>
                    <td className="px-4 py-2 text-muted-foreground">{p.packs}</td>
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
            <Droplets className="w-6 h-6 text-primary" /> ما الأسمدة التي توضع في خزان التسميد نفسه؟
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            معظم انسدادات الري بالتنقيط في مياه عُمان العسرة سببها خلط الكالسيوم مع الفوسفات أو الكبريتات في خزان واحد.
            استخدم نظام الخزانين والتزم بهذه القواعد.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">المنتج</th>
                  <th className="px-4 py-2 font-semibold">الخزان</th>
                  <th className="px-4 py-2 font-semibold">السبب</th>
                </tr>
              </thead>
              <tbody>
                {fertigation.map((r) => (
                  <tr key={r.product} className="border-t border-border align-top">
                    <td className="px-4 py-2 font-medium text-foreground">{r.product}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{r.tank}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.rule}</td>
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
            <Truck className="w-6 h-6 text-primary" /> ما سرعة توصيل الأسمدة في عُمان ودول الخليج؟
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            في نفس اليوم داخل مسقط، وفي اليوم التالي إلى صحار والباطنة، وخلال يومين إلى ثلاثة أيام إلى صلالة والدقم، وبراً
            إلى الإمارات والسعودية وقطر والكويت والبحرين مع شهادة منشأ (اليوريا خلال يومين إلى سبعة أيام). التفاصيل الكاملة بالإنجليزية
            على صفحة{' '}
            <Link to="/chemical-supplier/fertilizers-oman" className="text-primary hover:underline">مورد الأسمدة في عُمان</Link>{' '}
            وفي فئة{' '}
            <Link to="/products/agro" className="text-primary hover:underline">الكيماويات الزراعية</Link>.
          </p>
          <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <Mail className="w-4 h-4" /> للاستفسارات: <a href="mailto:info@gcoman.com" className="text-primary hover:underline">info@gcoman.com</a>
            — مسقط، سلطنة عُمان
          </p>
        </div>
      </section>

      <FAQSection faqs={faqs} heading="أسئلة شائعة عن اليوريا والأسمدة في عُمان" />
    </main>

    <Footer />
  </div>
);

export default FertilizersOmanAr;
