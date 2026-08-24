// Lightweight index of every /chemicals/:location page, for surfaces that
// need the full list (the /chemicals hub, footers, sitemaps) without pulling
// in LocationLanding.tsx's ~900-line per-city dataset. LocationLanding.tsx
// remains the source of truth for page content; keep slugs in sync with its
// `locations` record — the hub links 404 (client-side) if they drift.
export interface LocationIndexEntry {
  slug: string;
  city: string;
  cityArabic: string;
  region: string;
  deliveryTime: string;
}

export interface LocationCountry {
  country: string;
  countryArabic: string;
  locations: LocationIndexEntry[];
}

export const locationIndex: LocationCountry[] = [
  {
    country: 'Oman',
    countryArabic: 'عُمان',
    locations: [
      { slug: 'muscat', city: 'Muscat', cityArabic: 'مسقط', region: 'Muscat Governorate', deliveryTime: 'Same-day delivery in the Muscat metropolitan area' },
      { slug: 'rusayl', city: 'Rusayl Industrial Estate', cityArabic: 'المنطقة الصناعية بالرسيل', region: 'Muscat Governorate', deliveryTime: 'Same-day delivery to Rusayl Industrial Estate' },
      { slug: 'sohar', city: 'Sohar', cityArabic: 'صحار', region: 'North Al Batinah Governorate', deliveryTime: 'Next-day delivery to Sohar and the Freezone' },
      { slug: 'rustaq', city: 'Rustaq', cityArabic: 'الرستاق', region: 'South Al Batinah Governorate', deliveryTime: '24–48 hour delivery from Muscat' },
      { slug: 'salalah', city: 'Salalah', cityArabic: 'صلالة', region: 'Dhofar Governorate', deliveryTime: '2–3 day delivery to Salalah' },
      { slug: 'duqm', city: 'Duqm', cityArabic: 'الدقم', region: 'Al Wusta Governorate', deliveryTime: '2–3 day delivery to the Duqm SEZ' },
    ],
  },
  {
    country: 'United Arab Emirates',
    countryArabic: 'الإمارات العربية المتحدة',
    locations: [
      { slug: 'dubai', city: 'Dubai', cityArabic: 'دبي', region: 'Dubai', deliveryTime: '3–5 business days by road, 1–2 days by air' },
      { slug: 'abu-dhabi', city: 'Abu Dhabi', cityArabic: 'أبوظبي', region: 'Abu Dhabi', deliveryTime: '3–5 business days by road' },
      { slug: 'sharjah', city: 'Sharjah', cityArabic: 'الشارقة', region: 'Sharjah', deliveryTime: '3–5 business days by road' },
      { slug: 'fujairah', city: 'Fujairah', cityArabic: 'الفجيرة', region: 'Fujairah', deliveryTime: '2–4 hours by road from Muscat — our fastest GCC lane' },
      { slug: 'ras-al-khaimah', city: 'Ras Al Khaimah', cityArabic: 'رأس الخيمة', region: 'Ras Al Khaimah', deliveryTime: '3–5 business days by road' },
    ],
  },
  {
    country: 'Saudi Arabia',
    countryArabic: 'المملكة العربية السعودية',
    locations: [
      { slug: 'riyadh', city: 'Riyadh', cityArabic: 'الرياض', region: 'Riyadh Region', deliveryTime: '5–7 business days by road or sea' },
      { slug: 'jeddah', city: 'Jeddah', cityArabic: 'جدة', region: 'Makkah Province', deliveryTime: '5–7 days by road, 4–6 days by sea via Port of Sohar' },
      { slug: 'dammam', city: 'Dammam', cityArabic: 'الدمام', region: 'Eastern Province', deliveryTime: '4–6 business days by road' },
      { slug: 'jubail', city: 'Jubail', cityArabic: 'الجبيل', region: 'Eastern Province', deliveryTime: '4–6 business days by road via Dammam' },
      { slug: 'yanbu', city: 'Yanbu', cityArabic: 'ينبع', region: 'Al Madinah Province', deliveryTime: '6–8 days by road, 5–7 days by sea' },
    ],
  },
  {
    country: 'Qatar',
    countryArabic: 'قطر',
    locations: [
      { slug: 'doha', city: 'Doha', cityArabic: 'الدوحة', region: 'Doha', deliveryTime: '3–5 business days by road' },
    ],
  },
  {
    country: 'Kuwait',
    countryArabic: 'الكويت',
    locations: [
      { slug: 'kuwait-city', city: 'Kuwait City', cityArabic: 'مدينة الكويت', region: 'Kuwait City', deliveryTime: '4–6 business days by road' },
    ],
  },
  {
    country: 'Bahrain',
    countryArabic: 'البحرين',
    locations: [
      { slug: 'bahrain', city: 'Bahrain', cityArabic: 'البحرين', region: 'Manama', deliveryTime: '3–5 business days by road via Saudi Arabia' },
    ],
  },
  {
    country: 'Iraq',
    countryArabic: 'العراق',
    locations: [
      { slug: 'baghdad', city: 'Baghdad', cityArabic: 'بغداد', region: 'Baghdad & Southern Iraq', deliveryTime: '7–10 days by road, 3–5 days by air for urgent orders' },
    ],
  },
  {
    country: 'Jordan',
    countryArabic: 'الأردن',
    locations: [
      { slug: 'amman', city: 'Amman', cityArabic: 'عمّان', region: 'Amman & Northern Jordan', deliveryTime: '5–8 business days by road via Saudi Arabia' },
    ],
  },
  {
    country: 'Egypt',
    countryArabic: 'مصر',
    locations: [
      { slug: 'cairo', city: 'Cairo', cityArabic: 'القاهرة', region: 'Cairo, Alexandria & Greater Egypt', deliveryTime: '7–12 days by sea via Alexandria Port' },
    ],
  },
];

export const allLocations: LocationIndexEntry[] = locationIndex.flatMap((c) => c.locations);
