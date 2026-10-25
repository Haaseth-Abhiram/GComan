import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, Mail, MessageCircle, Truck, FileCheck2 } from 'lucide-react';
import hubAr from '@/i18n/locales/hub-pages-ar.json';

/**
 * Arabic nitric acid hub — /ar/chemical-supplier/nitric-acid-oman (2026-10-25).
 *
 * Why: Arabic buyers in the GCC search "حمض النيتريك للبيع" (for sale) and
 * "حمض النيتريك اين يباع" (where is it sold) — Google autocomplete, gl=om and
 * gl=sa, 2026-10-22 and 2026-10-25 — and the site had no Arabic nitric page:
 * the /ar render of the English hub was noindex by design (Arabic SEO model,
 * CLAUDE.md). This is a full Arabic body, so the page may pass arTitle /
 * arDescription to <SEO> and become indexable with reciprocal hreflang.
 *
 * Content rule: every fact restates the English hub (NitricAcidOman.tsx) —
 * 68% HNO3, CAS 7697-37-2, own production unit in Oman, Ghala stock, the three
 * grades, the pack range, UN 2031, the GCC lead-time table, CoA + SDS, ISO
 * 9001:2015 / JSRS / ICV, per-tonne bulk quotes within 24 hours. Nothing new
 * is claimed here; no price is published (owner decision pending).
 *
 * Meta lives in hub-pages-ar.json, which scripts/sync-ar-sitemap.mjs reads to
 * decide that this /ar URL is indexable — the same gate pattern as
 * location-pages-ar.json for the city pages.
 */

const URL_EN = 'https://gcoman.com/chemical-supplier/nitric-acid-oman';
const meta = hubAr.hubPages['nitric-acid-oman'];

const BULK_WHATSAPP_AR =
  'https://wa.me/96892772305?text=' +
  encodeURIComponent(
    'استفسار عن حمض النيتريك بالجملة (gcoman.com). الدرجة/التركيز: 68% ___. الكمية الشهرية (طن): ___. التعبئة: IBC / صهريج / براميل. موقع التسليم: ___. الشركة: ___'
  );

const grades = [
  {
    grade: 'الدرجة الصناعية / التقنية',
    strength: '68%',
    use: 'تخليل المعادن وتخميلها، وإزالة الترسبات، ومعادلة المياه العادمة، ومادة أولية للنترتة',
    packs: 'عبوات 35 كغ (30 لتر)، براميل 60 كغ و200 لتر، حاويات IBC سعة 1,000 لتر، وصهاريج بالجملة',
  },
  {
    grade: 'الدرجة الغذائية (لملامسة الأغذية)',
    strength: '68%',
    use: 'التنظيف الحمضي في المكان (CIP) في مصانع الألبان والمشروبات',
    packs: 'عبوات 35 كغ (30 لتر)، براميل 60 كغ و200 لتر، حاويات IBC سعة 1,000 لتر',
  },
  {
    grade: 'الدرجة المخبرية (ACS / المعادن النزرة)',
    strength: '68–70%',
    use: 'التحليل المخبري وهضم العينات لأجهزة ICP وAAS',
    packs: 'زجاجات كهرمانية 500 مل و2.5 لتر',
  },
];

const delivery = [
  { country: 'عُمان', lead: 'في نفس اليوم (مسقط) / اليوم التالي (صحار)', notes: 'السوق المحلي — مخزون في غلا، دون مستندات تصدير' },
  { country: 'الإمارات', lead: '2–5 أيام عمل', notes: 'دبي وأبوظبي والشارقة — شهادة منشأ، وصحيفة بيانات سلامة بالإنجليزية والعربية' },
  { country: 'السعودية', lead: '4–7 أيام عمل', notes: 'الدمام وجدة والرياض — دعم مستندات SASO' },
  { country: 'البحرين', lead: '3–5 أيام عمل', notes: 'المنامة — شهادة منشأ خليجية تفضيلية عند الطلب' },
  { country: 'قطر', lead: '3–5 أيام عمل', notes: 'الدوحة ومسيعيد — مستندات التخليص الجمركي' },
  { country: 'الكويت', lead: '4–6 أيام عمل', notes: 'مستندات الجمارك وشهادة المنشأ كاملة' },
];

const faqs = [
  {
    question: 'أين يمكن شراء حمض النيتريك في عُمان؟',
    answer:
      'من جلوبال كيميكالز ذ.م.م، التي تحتفظ بمخزون حمض النيتريك في مستودعها في غلا بمسقط وتورّد الدرجات الصناعية والغذائية والمخبرية للشركات والمؤسسات في جميع أنحاء عُمان: إرسال في نفس اليوم داخل مسقط والرسيل، وفي اليوم التالي إلى صحار، وخلال يومين إلى ثلاثة أيام إلى صلالة والدقم ونزوى وصور. أرسل الدرجة والكمية وعنوان التسليم إلى info@gcoman.com أو اتصل على ‎+968 9277 2305‎ للحصول على عرض سعر، وترافق كل شحنة شهادة تحليل وصحيفة بيانات سلامة وفق نظام GHS.',
  },
  {
    question: 'هل توفرون حمض النيتريك بالجملة؟',
    answer:
      'نعم. تنتج جلوبال كيميكالز ذ.م.م حمض النيتريك 68% في وحدة الإنتاج الخاصة بها في عُمان، وتورّد الكميات الكبيرة في حاويات IBC سعة 1,000 لتر وبالصهاريج، إلى جانب العبوات والبراميل للاستخدامات الأصغر. ويمكن للمصانع الاتفاق على عقود توريد دورية بتسليم مجدول. تُشحن الكميات الكبيرة برقم الأمم المتحدة UN 2031 (الفئة 8، مع خطر ثانوي: مادة مؤكسدة 5.1) مع مستندات النقل وصحيفة بيانات السلامة وشهادة تحليل الدفعة، وتُرفق شهادة منشأ بشحنات التصدير.',
  },
  {
    question: 'كم سعر حمض النيتريك بالطن في عُمان؟',
    answer:
      'يُسعَّر حمض النيتريك بالجملة بالطن وفق أربعة عوامل: التركيز والدرجة، والكمية الشهرية، وطريقة التعبئة (IBC أو صهريج)، وموقع التسليم. تكلفة الكيلوغرام في حاويات IBC والصهاريج أقل من العبوات الصغيرة، وتُسعَّر الكميات الشهرية المنتظمة وفق شرائح الكمية. ولأن الحمض يُنتج محلياً فلا توجد تكلفة استيراد في السعر. أرسل الكمية والتركيز وموقع التسليم عبر البريد أو الهاتف أو واتساب، ويصلك عرض السعر خلال 24 ساعة.',
  },
  {
    question: 'ما درجات حمض النيتريك وأحجام التعبئة المتوفرة؟',
    answer:
      'ثلاث درجات من مخزون مسقط: الدرجة الصناعية 68% لمعالجة المعادن والعمليات، والدرجة الغذائية 68% لتنظيف CIP في مصانع الألبان والمشروبات، والدرجة المخبرية بتركيز 68 إلى 70% (ACS / المعادن النزرة) للتحليل. التعبئة في عبوات 35 كغ وبراميل 60 كغ وحاويات IBC سعة 1,000 لتر مع ترتيبات بالجملة للمصانع، وتتوفر الدرجة المخبرية في زجاجات 500 مل و2.5 لتر.',
  },
  {
    question: 'ما مستندات السلامة التي ترافق حمض النيتريك؟',
    answer:
      'ترافق كل شحنة صحيفة بيانات سلامة حديثة وفق نظام GHS بالإنجليزية، وبالعربية عند الطلب، إلى جانب شهادة تحليل للدفعة وصحيفة بيانات فنية. حمض النيتريك مادة مؤكسدة شديدة التآكل: تعامل معه بمعدات الوقاية الكاملة من الأحماض (واقي للوجه، وقفازات ومريلة مقاومة للأحماض)، وخزّنه في مكان بارد جيد التهوية، بعيداً عن المواد العضوية والعوامل المختزلة والمعادن، واستخدم أوعية من البولي إيثيلين أو الفولاذ المقاوم للصدأ. لا تخزّنه أبداً بجوار مواد قابلة للاشتعال.',
  },
  {
    question: 'هل تصدّرون حمض النيتريك إلى دول الخليج؟',
    answer:
      'نعم، من عُمان إلى الإمارات والسعودية والبحرين وقطر والكويت، عادةً خلال 2 إلى 7 أيام بحسب الوجهة، براً أو عبر ميناء صحار، مع شهادة منشأ عند الطلب، وترافق كل شحنة صحيفة بيانات سلامة وفق نظام GHS بالإنجليزية (وتتوفر بالعربية).',
  },
];

const breadcrumbItems = [
  { name: 'الرئيسية', url: 'https://gcoman.com/' },
  { name: 'موردو الكيماويات في عُمان', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'مورد حمض النيتريك في عُمان', url: 'https://gcoman.com/ar/chemical-supplier/nitric-acid-oman' },
];

const NitricAcidOmanAr = () => (
  <div className="min-h-screen bg-background" dir="rtl" lang="ar">
    <SEO
      title="Nitric Acid Supplier Oman & GCC | 68% HNO3 Manufacturer"
      description="Nitric acid 68% (HNO3) manufacturer in Oman, exporting to the UAE, Saudi Arabia, Qatar, Kuwait & Bahrain in 2–7 days."
      arTitle={meta.metaTitle}
      arDescription={meta.metaDescription}
      ogUrl={URL_EN}
      canonical={URL_EN}
    />
    <FAQStructuredData faqs={faqs} />
    <BreadcrumbStructuredData items={breadcrumbItems} />
    <SpeakableStructuredData url="https://gcoman.com/ar/chemical-supplier/nitric-acid-oman" cssSelector={['h1', 'h2', '.speakable']} />
    <Navigation />

    <main id="main-content">
      <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 text-sm px-4 py-1.5">إنتاج ذاتي في عُمان • مخزون في عُمان • JSRS • ISO 9001:2015 • ICV</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">مورد ومصنّع حمض النيتريك في عُمان</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed speakable">
              حمض النيتريك (HNO3، رقم CAS ‏7697-37-2) حمض معدني قوي يُورَّد بتركيز 68% لتخليل المعادن وتخميلها وإزالة
              الترسبات والنترتة والتنظيف في المكان (CIP). تصنّع جلوبال كيميكالز ذ.م.م حمض النيتريك في وحدة الإنتاج الخاصة
              بها في عُمان وتحتفظ بمخزون في مسقط بالدرجات الصناعية والغذائية والمخبرية، في عبوات 35 كغ وبراميل 60 كغ
              وحاويات IBC سعة 1,000 لتر وبالجملة. الإنتاج المحلي يعني مهل توريد أقصر وأسعاراً تنافسية، مع التصدير إلى
              الإمارات والسعودية والبحرين وقطر والكويت.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'nitric_acid_ar_whatsapp')}>
                <a href={BULK_WHATSAPP_AR} target="_blank" rel="noopener noreferrer nofollow">
                  <MessageCircle className="w-5 h-5" /> استفسار بالجملة عبر واتساب
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">ما درجات حمض النيتريك المتوفرة في عُمان؟</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">الدرجة</th>
                  <th className="px-4 py-2 font-semibold">التركيز</th>
                  <th className="px-4 py-2 font-semibold">الاستخدام</th>
                  <th className="px-4 py-2 font-semibold">التعبئة</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.grade} className="border-t border-border align-top">
                    <td className="px-4 py-2 font-medium text-foreground">{g.grade}</td>
                    <td className="px-4 py-2 text-muted-foreground whitespace-nowrap" dir="ltr">{g.strength}</td>
                    <td className="px-4 py-2 text-muted-foreground">{g.use}</td>
                    <td className="px-4 py-2 text-muted-foreground">{g.packs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            المواصفات: الصيغة HNO3، سائل شفاف عديم اللون إلى أصفر باهت، رقم الأمم المتحدة UN 2031 (الفئة 8، مع خطر ثانوي: مادة مؤكسدة 5.1).
            جدول المواصفات الكامل بالإنجليزية على <Link to="/chemical-supplier/nitric-acid-oman" className="text-primary hover:underline">صفحة حمض النيتريك</Link>.
          </p>
        </div>
      </section>

      <section className="py-14 border-t bg-muted/20" id="bulk-supply">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> حمض النيتريك بالجملة: كيف تحصل على عرض سعر؟
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 speakable">
            نورّد حمض النيتريك 68% بالجملة من وحدة إنتاجنا في عُمان: حاويات IBC سعة 1,000 لتر وصهاريج، مع عقود توريد دورية
            وتسليم شهري مجدول للمستخدمين المنتظمين. أرسل التركيز والدرجة، والكمية الشهرية بالطن، وطريقة التعبئة، وموقع
            التسليم؛ يُسعَّر الطلب بالطن وفق شرائح الكمية ويصلك العرض خلال 24 ساعة.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2">من يشتري بالجملة</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                خطوط تخليل الصلب والجلفنة، ومصنّعو الفولاذ المقاوم للصدأ وورش التخميل، ومنتجو الأسمدة والكيماويات، ومصانع
                الألبان والمشروبات التي تشغّل دورات CIP يومية، ومحطات معالجة المياه والصرف، ومقاولو المصافي والنفط والغاز.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-primary" /> المستندات مع كل شحنة
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                شهادة تحليل للدفعة، وصحيفة بيانات السلامة وفق نظام GHS بالإنجليزية، وبالعربية عند الطلب، ومستندات نقل البضائع الخطرة
                برقم الأمم المتحدة UN 2031، وشهادة منشأ لشحنات التصدير. الشركة حاصلة على ISO 9001:2015 ومسجلة في JSRS وملتزمة بمتطلبات القيمة المحلية المضافة (ICV).
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-14 border-t">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">هل تصدّرون حمض النيتريك إلى دول الخليج؟</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">الدولة</th>
                  <th className="px-4 py-2 font-semibold">مهلة التسليم من مسقط</th>
                  <th className="px-4 py-2 font-semibold">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {delivery.map((d) => (
                  <tr key={d.country} className="border-t border-border">
                    <td className="px-4 py-2 font-medium text-foreground">{d.country}</td>
                    <td className="px-4 py-2 text-muted-foreground">{d.lead}</td>
                    <td className="px-4 py-2 text-muted-foreground">{d.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
            <Mail className="w-4 h-4" /> للاستفسارات: <a href="mailto:info@gcoman.com" className="text-primary hover:underline">info@gcoman.com</a>
            — غلا، مسقط، سلطنة عُمان
          </p>
        </div>
      </section>

      <FAQSection faqs={faqs} heading="أسئلة شائعة عن حمض النيتريك في عُمان" />
    </main>

    <Footer />
  </div>
);

export default NitricAcidOmanAr;
