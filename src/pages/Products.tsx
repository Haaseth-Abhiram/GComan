import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loadProductsByCategory, loadAllProducts, TOTAL_PRODUCTS, ALL_CATEGORIES } from '@/data/productLoader';
import type { Product } from '@/data/productTypes';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube, Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound, Flame, Wind, Wine, ChevronRight, Shield, SprayCan, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getLangPrefixFromPath, withLangPrefix } from '@/lib/langRouting';
import { AISearchDialog } from '@/components/AISearchDialog';
import { ProductCard } from '@/components/products/ProductCard';
import { SEO } from '@/components/SEO';
import { BreadcrumbStructuredData, FAQStructuredData, SpeakableStructuredData, ItemListStructuredData } from '@/components/StructuredData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { trackSearch } from '@/components/GoogleAnalytics';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LocalizedLink } from '@/components/LocalizedLink';

// FAQ structured data for products page — targets high-intent procurement queries
const productsFAQs = [
  {
    question: "What chemical products does Global Chemicals LLC supply in Oman?",
    answer: `Global Chemicals LLC supplies ${TOTAL_PRODUCTS}+ industrial and specialty chemicals in Oman including water treatment chemicals (PAC, caustic soda, calcium hypochlorite, antiscalants), industrial lubricants (Shell, Mobil, Castrol), laboratory chemicals (AR grade, HPLC solvents), oilfield chemicals (corrosion inhibitors, demulsifiers, H2S scavengers), swimming pool chemicals, food-grade chemicals, RO chemicals, and construction chemicals.`
  },
  {
    question: "Can I buy chemicals in bulk from Global Chemicals LLC in Muscat?",
    answer: "Yes, Global Chemicals LLC offers bulk chemical supply in Muscat and across Oman. We supply in packaging from 1-litre bottles to 25-litre jerricans, 200-litre drums, and 1,000-litre IBC containers. Volume pricing is available for regular bulk buyers. Contact our sales team at info@gcoman.com or +968-93754388 for bulk quotations."
  },
  {
    question: "Are Global Chemicals LLC products supplied with Safety Data Sheets (SDS)?",
    answer: "Yes. All chemical products supplied by Global Chemicals LLC come with current GHS-compliant Safety Data Sheets (SDS/MSDS) in English. Arabic SDS is available for most products. We also provide Certificates of Analysis (CoA) and Technical Data Sheets (TDS) on request for every batch supplied."
  },
  {
    question: "Does Global Chemicals LLC supply Shell, Mobil, and Castrol lubricants in Oman?",
    answer: "Yes, Global Chemicals LLC is an authorised distributor of Shell, Mobil, and Castrol lubricants in Oman. We stock Shell Rimula, Shell Tellus, Shell Gadus, Mobil Delvac, Mobil DTE, Castrol RX Super, and many other grades in Muscat with same-day delivery. All lubricants are genuine branded products supplied with original CoA."
  },
  {
    question: "What is the delivery time for chemical orders in Oman?",
    answer: "For Muscat and Rusayl Industrial Area: same-day delivery for orders before 12:00 PM. For Sohar and surrounding areas: next-day delivery. For Salalah, Duqm, Nizwa, Sur: 2–3 business days. Emergency and weekend deliveries can be arranged. Contact us at +968-93754388 for urgent requirements."
  }
];

// Category-specific FAQ overrides — replaces the generic sitewide FAQ on
// category pages so structured-data is topically relevant (Google devalues
// duplicated FAQ markup reused across many URLs).
const categoryFAQs: Record<string, { question: string; answer: string }[]> = {
  glycols: [
    {
      question: "Who supplies glycols in bulk in Oman and the GCC?",
      answer: "Global Chemicals LLC stocks MEG, DEG, TEG, propylene glycol (industrial and USP), and butyl glycol in our Muscat warehouse for same-day Oman dispatch and scheduled GCC delivery — Fujairah in 2–4 hours by road, Dubai and Abu Dhabi in 3–5 days, Saudi Arabia in 4–7 days. Drum, IBC, and ISO-tank quantities with batch CoA and SDS on every consignment. Request a quote with your grade and volume for same-day pricing.",
    },
    {
      question: "What is the difference between MEG, DEG and TEG?",
      answer: "All three are ethylene glycols differing in chain length. MEG (monoethylene glycol) is the antifreeze and PET feedstock workhorse; DEG (diethylene glycol) serves polyester resins, plasticisers and dehydration blend make-up; TEG (triethylene glycol) is the standard desiccant liquid in natural-gas dehydration contactors because of its higher boiling point and low vapour loss. For gas plants we supply fresh TEG and DEG for make-up; for HVAC antifreeze duty, inhibited MEG.",
    },
    {
      question: "Which glycol should be used in chilled water and district cooling systems?",
      answer: "Inhibited MEG at 25–35% concentration is the Gulf standard for closed chilled-water loops. Where lower toxicity is required — hotels, food factories, or any system with potential incidental contact — propylene glycol is used instead at a slightly higher concentration for the same freeze/burst protection. We supply both, plus the corrosion-inhibitor package and glycol-concentration test equipment.",
    },
    {
      question: "Do you supply food-grade propylene glycol (E1520 / USP) in Oman?",
      answer: "Yes — USP/EP-grade propylene glycol (E1520) with food-compliance documentation compatible with HACCP systems, in 215 kg drums and IBCs. It serves flavour and colour carrier duty, humectant use in food and personal care, and pharmaceutical formulation. Industrial grade is stocked separately for coatings, antifreeze and de-icing applications.",
    },
    {
      question: "Can you deliver TEG to gas plants in Oman's interior?",
      answer: "Yes. TEG for dehydration contactor circuits is delivered to upstream sites across Oman including the Marmul, Nimr and Qarn Alam areas under our JSRS registration (PDO/OQ approved supplier lists). Batch CoA covers purity, water content and pH; drum and IBC deliveries run on scheduled interior routes with hazmat-trained drivers.",
    },
    {
      question: "What packaging options are available for bulk glycol orders?",
      answer: "Standard packaging is 215–235 kg steel or HDPE drums (glycol-dependent) and 1,000 L IBC totes. For recurring volume users we arrange ISO-tank and bulk tanker delivery into customer storage. Palletised container loads for GCC export are prepared with full customs documentation from our Muscat facility.",
    },
  ],
  'corrosion-inhibitor': [
    {
      question: "What is the best corrosion inhibitor for closed-loop cooling systems?",
      answer: "For Gulf conditions — desalinated make-up water with elevated chloride — a molybdate-based programme is the most reliable for mild-steel chilled-water circuits: 10–20 mg/L molybdate residual for the steel, plus tolyltriazole at 1–5 mg/L for copper heat-exchanger tubes. Nitrite-based programmes are the lower-cost alternative where microbiological control is well managed. We supply blended closed-system inhibitors, straight sodium molybdate, and residual test kits.",
    },
    {
      question: "Which corrosion inhibitors are used for gas pipelines?",
      answer: "Film-forming amine inhibitors — typically imidazoline chemistry — injected continuously at 10–50 ppm or batch-applied between pigging runs. Product selection depends on whether the service is sweet (CO₂) or sour (H₂S), water cut, and temperature. We supply oilfield corrosion inhibitors qualified for both continuous and batch programmes, with dose-rate guidance from our technical team and JSRS-registered supply into PDO/OQ contractor procurement.",
    },
    {
      question: "How do you choose a corrosion inhibitor for a cooling tower?",
      answer: "Open recirculating towers need a phosphonate-azole blend with polymer dispersant, dosed at 80–150 ppm of recirculating water and paired with a biocide programme. The right blend depends on cycles of concentration, make-up hardness and chloride. Send us your make-up water analysis and target cycles — we specify the programme and supply test kits for phosphonate residual monitoring.",
    },
    {
      question: "Do you supply oxygen scavengers for boiler feedwater in Oman?",
      answer: "Yes — catalysed sulphite oxygen scavengers for feedwater and hydrotest preservation, dosed to a 20–40 ppm sulphite residual, alongside pH boosters and condensate-line amine treatments. All ship from Muscat stock with CoA; dosing pumps and residual test kits can be included in the package.",
    },
    {
      question: "Can one inhibitor protect mixed metallurgy — steel, copper and aluminium?",
      answer: "Multi-metal closed-system formulations combine molybdate or nitrite for ferrous protection with azoles for copper alloys and silicate or specific azole chemistry for aluminium components. Our Multi-Metal CI covers mixed district-cooling and HVAC loops; where aluminium content is high we adjust the programme — send the metallurgy list with your enquiry.",
    },
  ],
  ethanolamines: [
    {
      question: "Who supplies MEA, DEA, TEA and MDEA in Oman and the GCC?",
      answer: "Global Chemicals LLC stocks the full ethanolamine series at ≥99% purity in Muscat — monoethanolamine, diethanolamine, triethanolamine (85% and 99%), and MDEA — with batch CoA and GHS SDS. Same-day Muscat dispatch, GCC delivery in 2–7 days depending on destination, and long-term contract pricing for gas plants, cement producers, and formulators.",
    },
    {
      question: "Which amine is best for gas sweetening — MEA, DEA or MDEA?",
      answer: "MEA removes CO₂ aggressively at low pressure but costs the most regeneration energy; DEA suits refinery streams with mixed CO₂/H₂S at moderate loadings; MDEA is the modern choice for selective H₂S removal at high pressure with the lowest energy demand, tunable with activators for CO₂ slip. We supply all three for make-up and first-fill to gas treating operations in Oman and the GCC.",
    },
    {
      question: "What is triethanolamine used for in cement production?",
      answer: "TEA at 85% is the classic cement grinding aid — dosed at 0.02–0.05% of clinker it reduces pack-set and improves mill throughput and early strength development. We supply TEA 85% and 99% in 230 kg drums and IBCs to grinding-aid formulators and cement plants across the GCC, with consistent water content confirmed on every batch CoA.",
    },
  ],
  agro: [
    {
      question: "What agricultural chemicals and fertilizers does Global Chemicals LLC supply in Oman?",
      answer: "We supply straight and compound fertilizers (urea 46% N, DAP 18-46-0, NPK 20-20-20 / 19-19-19 / 15-15-15, potassium chloride 60% K2O, calcium nitrate 15.5% N), micronutrients (zinc sulphate monohydrate 33% Zn, chelated iron, manganese, boron), soil amendments (agricultural gypsum, humic acid, leonardite extract), and irrigation water treatment chemicals for drip systems (acid pH correction, antiscalants, algaecides). Custom NPK blending, soil and irrigation water analysis, and Oman Ministry of Agriculture-approved import documentation available."
    },
    {
      question: "Which fertilizer is best for date palms in Oman?",
      answer: "Date palms in Oman require a balanced NPK program with heavy potassium emphasis. A typical annual program per mature tree: 2–3 kg urea (46% N) split across three applications, 1–2 kg DAP (18-46-0) at winter dormancy break, and 3–5 kg potassium chloride (60% K2O) split at fruit set and fruit development — potassium is critical for fruit sizing, sugar accumulation, and post-harvest storage quality. Add zinc sulphate (100–200 g/tree) every 2–3 years to correct the near-universal zinc deficiency in Oman's alkaline soils. Apply via basin flooding or fertigation through drip emitters."
    },
    {
      question: "How is calcium nitrate used to prevent blossom-end rot in greenhouse tomatoes?",
      answer: "Blossom-end rot in Oman greenhouse tomatoes is caused by localised calcium deficiency during rapid fruit expansion — often when high transpiration in summer greenhouses draws calcium to leaves instead of fruit. Continuous fertigation with calcium nitrate (15.5% N, 26.5% CaO) at 150–200 ppm Ca in the drip solution supplies steady calcium throughout the fruiting cycle. Weekly foliar sprays (0.3–0.5% calcium nitrate) supplement soil supply during peak fruit-set weeks. Calcium nitrate is the only widely-available calcium source fully compatible with fertigation — it dissolves clearly and delivers nitrate-nitrogen, which crops prefer over ammonium in alkaline substrates."
    },
    {
      question: "How does agricultural gypsum reclaim sodic soils in Oman?",
      answer: "Sodic soils are widespread in Oman where saline groundwater irrigation has raised exchangeable sodium above 15% of cation exchange capacity, destroying soil aggregate structure and reducing water infiltration to near zero. Agricultural gypsum (calcium sulphate dihydrate, 23% Ca) supplies soluble calcium that displaces adsorbed sodium from clay exchange sites; the displaced sodium is then leached out with excess irrigation water. Typical reclamation rate is 2–10 tonnes/ha depending on soil texture and sodium adsorption ratio, followed by heavy leaching irrigation. Structure and infiltration usually recover within one cropping season, and gypsum also supplies calcium and sulphur as a non-acidifying nutrient source."
    },
    {
      question: "Do you supply Ministry of Agriculture-approved fertilizers to Omani farms?",
      answer: "Yes. All fertilizers and agricultural chemicals supplied by Global Chemicals LLC carry Oman Ministry of Agriculture, Fisheries Wealth and Water Resources import approvals and are backed by Certificates of Analysis, Safety Data Sheets (GHS-compliant, English and Arabic), and, where applicable, food/feed-grade documentation. We deliver to farms across Al Batinah, Al Dakhiliyah, Al Sharqiyah, Dhofar, and Musandam, and offer soil and irrigation water analysis to match the fertilizer program to your specific field conditions."
    }
  ],
  'water-treatment': [
    {
      question: "Who supplies water treatment chemicals in bulk in Oman and the GCC?",
      answer: "Global Chemicals LLC stocks the full municipal and industrial water treatment range in Muscat — PAC (poly aluminium chloride, liquid 10–18% and powder 30%), aluminium sulphate, calcium and sodium hypochlorite, chlorine tablets (TCCA), caustic soda, soda ash, antiscalants, biocides, and flocculants — with same-day Muscat delivery, next-day Sohar/Nizwa, and scheduled GCC export lanes to the UAE and Saudi Arabia. Every batch ships with CoA and GHS SDS; JSRS registration covers supply to PDO and OQ water operations."
    },
    {
      question: "PAC or alum — which coagulant should a water treatment plant use?",
      answer: "PAC (poly aluminium chloride) outperforms aluminium sulphate in most Gulf applications: it works across a wider pH window (5–9 versus alum's narrow 5.5–7.5), consumes far less alkalinity, produces denser faster-settling floc, and leaves lower residual aluminium — decisive advantages on Oman's alkaline, high-TDS source waters. Alum remains the lower-cost option for well-buffered waters with simple turbidity loads. Typical PAC dosing is 5–50 ppm as product depending on raw-water turbidity; jar testing confirms the optimum, and our technical team runs dose trials with customer samples."
    },
    {
      question: "What chlorine dose is required for potable water disinfection?",
      answer: "Standard practice targets a free chlorine residual of 0.2–0.5 mg/L at the furthest point of the network. Breakpoint dosing depends on ammonia and organic load — typically 1–3 mg/L applied dose for treated water and up to 5+ mg/L for raw well water. Calcium hypochlorite 65–70% granules suit remote sites and tanker disinfection (1.5 g per 1,000 L gives roughly 1 mg/L); sodium hypochlorite 12.5% suits dosed systems with metering pumps; TCCA tablets provide slow-release residual in storage tanks. Use our online chlorine dosing calculator at /tools/dosing-calculator to convert between products and target residuals."
    },
    {
      question: "Do you supply antiscalants and chemicals for desalination plants?",
      answer: "Yes — antiscalant formulations for RO seawater and brackish-water trains dosed at 2–5 ppm ahead of the membranes, plus the supporting chemistry: sodium metabisulphite for dechlorination, citric and sulphamic acid descalants, membrane cleaners, caustic soda and soda ash for post-treatment pH correction and remineralisation support, and calcium hypochlorite for intake shock dosing. We serve municipal desalination operators and private RO plants across Oman and export to GCC water utilities with full documentation."
    }
  ],
  oilfield: [
    {
      question: "Who supplies oilfield production chemicals to PDO and OQ contractors in Oman?",
      answer: "Global Chemicals LLC is JSRS-certified for supply to Petroleum Development Oman (PDO), OQ, OPAL and their approved contractors. Our production chemicals range covers corrosion inhibitors, scale inhibitors, H2S scavengers, demulsifiers and reverse demulsifiers, oxygen scavengers, biocides, defoamers, THT gas odorant, methanol and MEG for hydrate control, and drilling additives (bentonite, barite, CMC). Deliveries run on scheduled interior routes to Marmul, Nimr, Qarn Alam and Fahud with hazmat-trained drivers, and every batch carries CoA and GHS SDS."
    },
    {
      question: "How are demulsifiers selected and dosed for crude oil treatment?",
      answer: "Demulsifier selection is bottle-test driven: candidate chemistries are screened against a fresh wellhead emulsion sample for water drop-out speed, interface quality, and dehydrated-crude BS&W. Typical continuous injection is 10–100 ppm upstream of the FWKO or desalter, adjusted seasonally as water cut changes. For produced-water clean-up the mirror problem — oil dispersed in water — takes a reverse demulsifier at 2–20 ppm ahead of flotation or hydrocyclones to meet oil-in-water discharge or reinjection specs. We supply both chemistries and support field bottle testing."
    },
    {
      question: "What is THT and how is natural gas odorized in Oman and the GCC?",
      answer: "THT (tetrahydrothiophene) is the sulphur odorant injected into odourless natural gas so leaks are detectable by smell — the safety requirement for city-gas grids, industrial distribution, and CNG networks. Typical injection is 10–25 mg/m³ of gas, dosed by proportional injection pumps at the city-gate or distribution station. THT is favoured over mercaptan blends where oxidation stability and low soil-adsorption matter, holding its odour intensity further down the network. We supply THT in sealed drums with Class 3 handling documentation and injection-rate guidance."
    },
    {
      question: "Which scale and corrosion inhibitors work for high-salinity produced water?",
      answer: "Oman's produced waters commonly run high in chloride, calcium and sulphate, driving both CaCO3/CaSO4 scaling and accelerated steel corrosion. Phosphonate scale inhibitors (dosed 3–10 ppm continuous) handle carbonate and sulphate scale up to moderate supersaturation; for harsher brines, polymer-blend inhibitors are squeezed or continuously injected. Corrosion control pairs film-forming imidazoline inhibitors (10–50 ppm continuous, or batch between pig runs) with oxygen scavengers on any system open to air ingress. Send your water analysis and our technical team will specify the programme and doses."
    }
  ],
  solvents: [
    {
      question: "Who supplies industrial solvents in drum and bulk quantities in Oman?",
      answer: "Global Chemicals LLC stocks the full industrial solvent range in Muscat — acetone, methanol, ethanol, isopropanol (IPA), toluene, xylene, n-hexane, MEK, ethyl acetate, white spirit, thinner 402, and industrial kerosene — in 20L jerricans, 200L drums and IBCs, with bulk tanker supply for repeat buyers. Same-day Muscat dispatch, GCC export with HS-coded documentation, and every batch confirmed by Certificate of Analysis for purity (typically ≥99%), water content and non-volatile residue."
    },
    {
      question: "Which solvent should be used for paint thinning versus equipment degreasing?",
      answer: "For thinning: match the resin system — white spirit or thinner 402 for alkyd/enamel paints, xylene for chlorinated rubber and some epoxies, MEK or acetone-based blends for fast-flash industrial coatings, and IPA for shellac and some inks. For degreasing: white spirit and kerosene handle general workshop grease safely on most metals; acetone and MEK cut resins, adhesives and uncured composites but attack many plastics; hexane suits low-residue extraction and precision cleaning. If the duty involves electronics or sensitive substrates, IPA 99% leaves the least residue. Our team advises against the actual soil and substrate, not just the solvent family."
    },
    {
      question: "What is the difference between MEK and acetone as industrial solvents?",
      answer: "Both are ketones with strong dissolving power for resins, inks and adhesives. Acetone evaporates roughly twice as fast, making it the choice for rapid-flash cleaning and surface prep, but its speed can cause blushing in humid coastal conditions. MEK evaporates slower, giving longer open time for coatings, fibreglass lay-up, and adhesive activation, with slightly stronger solvency for vinyls and certain resins. MEK's slower flash also means lower solvent loss in open processes. We stock both at ≥99.5% purity with batch CoA."
    },
    {
      question: "Do you provide SDS and export documentation for solvent shipments to the GCC?",
      answer: "Yes. Every solvent consignment ships with a GHS-compliant SDS (English, Arabic available), batch Certificate of Analysis, and for export orders a Certificate of Origin attested by the Oman Chamber of Commerce plus HS-coded commercial invoice — flammable-liquid (Class 3) transport documentation included. We export solvents to the UAE, Saudi Arabia and Qatar under GCC customs with end-use declarations where destination regulations require them."
    }
  ],
  'lab-chemicals': [
    {
      question: "Who supplies laboratory chemicals and AR-grade reagents in Oman?",
      answer: "Global Chemicals LLC supplies analytical reagent (AR/ACS) grade chemicals to QC laboratories, universities, hospitals and water-testing labs across Oman — AR acids (sulphuric, hydrochloric, nitric, acetic), AR bases (sodium and potassium hydroxide pellets), HPLC and GC-grade solvents (acetonitrile, methanol, hexane, toluene), buffers and reference standards (tris base, EDTA), indicators (phenolphthalein, silver nitrate for argentometric titration), and microbiological media (agar, peptone, glucose). Minimum orders start at 500 ml / 100 g, with CoA per batch and same-day Muscat delivery."
    },
    {
      question: "What is the difference between AR grade, LR grade and HPLC grade chemicals?",
      answer: "AR (analytical reagent, equivalent to ACS grade) certifies tight maximum-impurity limits suitable for quantitative analysis and titration standards. LR (laboratory reagent) grade carries looser specs — fine for teaching labs, qualitative work and general preparation, at meaningfully lower cost. HPLC grade adds UV-transparency and filtered particulate specs required for liquid chromatography mobile phases; GC grades certify low-residue volatility profiles. Using LR where AR is needed skews assays; paying for HPLC grade in general wet chemistry wastes budget — we stock all three tiers so labs can match grade to method."
    },
    {
      question: "Can you supply chemicals for water and wastewater testing laboratories?",
      answer: "Yes — the standard-methods reagent set: silver nitrate and potassium chromate for chloride titration, EDTA and Eriochrome Black T for hardness, phenolphthalein and methyl orange for alkalinity, sodium thiosulphate for residual chlorine (iodometric), buffer tablets and solutions (pH 4/7/10), COD digestion reagents, and nutrient media for microbiological counts. We serve municipal water labs, desalination plant QC, and environmental consultancies across Oman with traceable CoA documentation."
    },
    {
      question: "Do lab chemical orders come with Certificates of Analysis and SDS?",
      answer: "Every batch ships with its Certificate of Analysis stating assay and impurity results against the grade specification, plus a GHS-compliant SDS. For accredited laboratories (ISO/IEC 17025) we support traceability requirements with lot numbers, expiry dates, and manufacturer certificates on request. Controlled and precursor chemicals are supplied against the required Royal Oman Police permits with end-user declarations — our team advises which items on your list need permits before ordering."
    }
  ],
  'food-beverage': [
    {
      question: "Who supplies food-grade chemicals with HACCP documentation in Oman?",
      answer: "Global Chemicals LLC supplies food-contact-grade chemicals to food and beverage factories, dairies and bakeries across Oman — citric acid anhydrous and monohydrate (E330), ascorbic acid (E300), sodium bicarbonate (E500), potassium sorbate (E202), xanthan gum (E415), propylene glycol USP (E1520), calcium lactate, food-grade caustic soda and sodium hypochlorite for CIP, and nitric acid 68% for membrane-plant cleaning. Every food-grade item ships with CoA, food-safety datasheet and HACCP-compatible documentation, Halal-compatible sourcing, and same-day Muscat delivery."
    },
    {
      question: "Which chemicals are used for CIP (clean-in-place) in dairy and beverage plants?",
      answer: "A standard CIP sequence runs: caustic soda 1–2% at 70–80°C to strip fats and proteins, an intermediate rinse, then nitric acid 0.5–1% at 60–70°C to remove mineral scale (milkstone/beerstone), finishing with a sanitising rinse — sodium hypochlorite 100–200 ppm available chlorine or peracetic-based sanitiser for chlorine-sensitive lines. We supply food-grade caustic soda liquid, nitric acid 68%, and food-grade hypochlorite with dosing guidance matched to your plant's CIP skid, water hardness and soil load."
    },
    {
      question: "What preservatives and stabilisers do you stock for beverage production?",
      answer: "Potassium sorbate (E202) at 200–500 ppm controls yeast and mould in juices and syrups; ascorbic acid (E300) protects colour and vitamin claims while scavenging dissolved oxygen; citric acid (E330) sets pH to the 3.0–3.5 range where sorbate is effective and flavour is balanced; xanthan gum (E415) at 0.05–0.3% stabilises suspension in pulpy and flavoured drinks. All are supplied in food-grade packaging with lot-level CoA; our team helps convert per-litre recipes into batch weighing sheets."
    },
    {
      question: "Are your food-grade chemicals Halal-compatible and export-documented?",
      answer: "Yes — food-grade items are sourced from manufacturers with Halal-compatible production and supplied with CoA, food-grade compliance statements, and where available manufacturer Halal certificates. For export to the UAE, Saudi Arabia and Qatar we prepare Certificates of Origin and the documentation food-safety authorities (including SFDA and Qatar MOPH categories) expect for food-contact chemicals. State the certification your auditor requires and we confirm availability per product before you order."
    }
  ],
  'soap-detergent': [
    {
      question: "Who supplies soap and detergent raw materials in Oman and the GCC?",
      answer: "Global Chemicals LLC stocks the core detergent raw-materials basket in Muscat: caustic soda (flakes, prills and 50% liquid) for saponification, LABSA 96% and SLES 70% surfactants, soda ash light and dense, sodium metasilicate, STPP, trisodium phosphate, glycerine, EDTA, hydrogen peroxide 35–50%, and optical brighteners. We supply soap plants, liquid-detergent blenders and car-wash chemical producers across Oman with bulk pricing, and export to GCC manufacturers with full customs documentation."
    },
    {
      question: "How much caustic soda is needed to saponify oils in bar soap production?",
      answer: "Each oil has a saponification value; in practice the NaOH charge is calculated per formulation — coconut oil needs roughly 0.183 kg NaOH per kg oil, palm oil ~0.142, olive oil ~0.135 — then discounted by a 5–8% superfat margin so finished bars retain free oils for mildness. A typical 100 kg mixed-oil batch (60% palm, 30% coconut, 10% castor) takes about 14.5 kg of caustic soda dissolved to a 30–33% lye solution. We supply flakes and prills at 98–99% purity with per-batch CoA so saponification calculations stay accurate."
    },
    {
      question: "What is the difference between LABSA and SLES in detergent formulation?",
      answer: "LABSA (linear alkylbenzene sulphonic acid, 96%) is the anionic workhorse for powders, dishwash and hard-surface cleaners — high detergency and low cost, but it must be neutralised (typically with caustic soda to sodium-LAS) and is relatively harsh on skin. SLES 70% is milder, high-foaming and already neutralised, the base of shampoos, body washes and premium dishwash liquids. Many liquid formulations blend the two: LABSA-salt for cleaning power, SLES for foam and mildness, with betaine or CDEA as foam boosters. Both are stocked in Muscat with technical formulation support."
    },
    {
      question: "Do you provide formulation support for new detergent manufacturers?",
      answer: "Yes — starter formulations for dishwashing liquid, laundry liquid and powder, hand wash, floor cleaner and car shampoo, with raw-material ratios, neutralisation guidance (LABSA to pH 7–8), viscosity building (salt curve with SLES systems), and preservation. We also help scale recipes from lab bench to production batch and supply the full ingredient list from stock so new plants can commission with one supplier and consistent batch documentation."
    }
  ],
  'tank-cleaners': [
    {
      question: "Who supplies marine and industrial tank cleaning chemicals in Oman?",
      answer: "Global Chemicals LLC stocks tank cleaning chemistry for vessel cargo holds, fuel and crude storage tanks, and process vessels at Oman's ports (Sohar, Duqm, Salalah, Muscat) — Aquatuff ship-hold cleaner, Aqua Clean HD alkaline degreaser, alkaleen safety cleaner, general tank cleaner concentrates, resin-clean solvent blends, acid descalants, and methanol-grade cleaners. Products are matched to MARPOL discharge constraints, supplied in drums and IBCs with SDS and application guidance, and delivered dockside with short notice for vessels on tight port stays."
    },
    {
      question: "Which chemical removes hydrocarbon residue from cargo holds and fuel tanks?",
      answer: "Alkaline surfactant degreasers are the standard for petroleum residues: applied 2–10% in seawater or fresh water by recirculation, Butterworth machine or hand-spray at 40–60°C where heating is available, followed by water rinse. For heavy crude bottoms and sludge, a solvent-emulsifier pre-treatment breaks and suspends the sludge so it pumps out with the wash water. Grain-clean and water-white standards after chemical cargoes usually need a two-step alkaline wash plus fresh-water rinse with wall-wash verification. Send the last-cargo list and target standard and we specify the product and dose."
    },
    {
      question: "How is scale and rust removed from industrial storage tanks?",
      answer: "Mineral scale and rust take an acid descalant — typically inhibited sulphamic or phosphoric-based blends circulated at 5–15% until effervescence stops, then neutralised and rinsed. Inhibited formulations protect the base steel during cleaning; stainless vessels finish with a passivation rinse to rebuild the chromium-oxide layer. Never acid-clean a tank that held hypochlorite or cyanides without specialist gas control. Our range covers inhibited descalants, neutralising agents and passivation liquids with confined-space application guidance."
    },
    {
      question: "Are your tank cleaners compliant with MARPOL discharge rules?",
      answer: "We supply cleaners formulated for marine use with biodegradable surfactant systems, and advise on which products and wash-water handling meet MARPOL Annex I/II discharge conditions for the cleaning duty — including where slops must be retained for shore reception instead of discharged. Each product ships with SDS and dosing instructions; for chemical-tanker prewash duties we confirm compatibility with the cargo's Annex II category before recommending the wash programme."
    }
  ],
  'ro-chemicals': [
    {
      question: "Who supplies RO membrane chemicals and antiscalants in Oman?",
      answer: "Global Chemicals LLC supplies the complete RO chemical programme from Muscat stock: broad-spectrum antiscalants for seawater and brackish trains, alkaline and acid membrane cleaners, RO-222 descaler, sodium metabisulphite for dechlorination, biocides for CIP sanitisation, and pH-correction chemicals. We serve municipal desalination plants, hotel and compound RO systems, and industrial process-water trains across Oman and the GCC, with dosing guidance calibrated to the region's high-TDS feed waters."
    },
    {
      question: "What antiscalant dose does an RO plant need?",
      answer: "Typical antiscalant dosing is 2–5 ppm into the feed ahead of the cartridge filters, set by the projection software output for your water analysis and recovery — Oman's brackish wells often run high sulphate and silica, which push the required dose toward the upper end or a silica-specific formulation. Overdosing wastes chemical and can itself foul membranes; underdosing scales the tail elements first (visible as rising differential pressure on the last stage). Send your feed analysis and recovery target and we return a dosing projection with the product recommendation — or use the RO antiscalant calculator at /tools/dosing-calculator for a first estimate."
    },
    {
      question: "When should RO membranes be cleaned, and with what chemicals?",
      answer: "Clean when normalised permeate flow drops 10–15%, differential pressure rises 10–15%, or normalised salt passage climbs — waiting longer sets fouling permanently. Match the cleaner to the foulant: high-pH alkaline cleaners (pH 11–12, 30–35°C) remove biofilm and organics; low-pH acid cleaners (pH 2–3) dissolve carbonate scale and iron; silica and sulphate scales need specialised high-pH or chelant formulations. Always clean stage-by-stage, alkaline before acid when both are needed. We stock both cleaner families plus RO-222 descaler and provide CIP procedures per membrane manufacturer limits."
    },
    {
      question: "Why is sodium metabisulphite dosed ahead of RO membranes?",
      answer: "Polyamide RO membranes are destroyed by free chlorine — even fractions of a ppm oxidise the membrane surface irreversibly. Where feed water is chlorinated, sodium metabisulphite (SMBS) is dosed at roughly 3–5 ppm per 1 ppm of free chlorine ahead of the membranes to neutralise it, verified by an ORP setpoint (typically below ~200 mV) interlocked to the high-pressure pumps. SMBS is also the standard preservation solution (1–1.5%) for membrane storage during shutdowns. We supply food-grade and technical SMBS in 25 kg bags with CoA."
    }
  ],
  'cooling-water': [
    {
      question: "Who supplies cooling tower treatment chemicals in Oman and the GCC?",
      answer: "Global Chemicals LLC stocks the complete open- and closed-loop programme in Muscat: scale and corrosion inhibitors (Altreat 4000, Cool Water Treat, Corro Guard), oxidising and non-oxidising biocides, antifoulants for seawater-cooled systems, closed-loop chiller inhibitors and biocides, and hardness-control boiler chemicals. We treat district cooling plants, hotel and mall HVAC, and process cooling across Oman and the UAE, with water-analysis-based programme design and residual test kits supplied alongside the chemicals."
    },
    {
      question: "How is Legionella controlled in cooling towers in the Gulf?",
      answer: "Gulf ambient temperatures put tower basins in the ideal Legionella growth band for most of the year, so control has to be continuous, not reactive: maintain an oxidising biocide residual (0.5–1 ppm free halogen) with a weekly alternating non-oxidising biocide shot to prevent resistance, keep cycles of concentration controlled to limit nutrient build-up, and physically clean basins and fill quarterly. Monitoring pairs weekly dip-slide counts with periodic Legionella-specific sampling. We supply both biocide families with a dosing schedule matched to your system volume and blowdown."
    },
    {
      question: "What causes scale in cooling towers and how is it prevented?",
      answer: "Evaporation concentrates the make-up water's calcium and alkalinity until calcium carbonate exceeds solubility — in Oman's climate a tower at 5 cycles concentrates minerals five-fold at the region's highest evaporation rates. Prevention combines cycles-of-concentration control via conductivity-based blowdown with a phosphonate-polymer inhibitor (80–150 ppm of recirculating water) that holds hardness in suspension. The sustainable cycles depend on make-up hardness, silica and the inhibitor programme — send your make-up analysis and we calculate target cycles, blowdown rate and chemical consumption."
    },
    {
      question: "What treatment does a closed chilled-water loop need?",
      answer: "A closed loop needs three things at commissioning and maintained thereafter: a corrosion inhibitor (molybdate or nitrite programme at an initial 2–5% charge for mild steel, with azole for copper), a compatible biocide to stop microbiological growth in the low-flow sections, and — where freeze or heat-transfer specs demand it — inhibited glycol at the engineered concentration. Annual water analysis confirms inhibitor residual and checks for bacterial activity or glycol degradation. We supply the inhibitors, closed-loop biocides, inhibited MEG/PG, and the test kits to monitor all three."
    }
  ],
  construction: [
    {
      question: "Who supplies construction chemicals and concrete admixtures in Oman?",
      answer: "Global Chemicals LLC supplies contractors, ready-mix plants and precast yards across Oman with concrete admixtures (superplasticisers, retarders, accelerators), epoxy coatings and bonding agents, polymer-modified mortars, mould release agents, paraffin oil for shuttering, curing compounds and waterproofing chemistry. Our technical team advises on hot-weather concreting practice for the Gulf — where mix temperature, slump retention and curing discipline decide durability — and supplies from Muscat stock with same-day delivery to sites across the capital area."
    },
    {
      question: "Which admixture keeps concrete workable in Oman's hot weather?",
      answer: "Above 35°C ambient, plain concrete can lose placeable slump in under 30 minutes. The standard response is a retarding superplasticiser: the retarder component slows cement hydration to extend working time by 1–3 hours, while the plasticiser recovers workability at a lower water-cement ratio — protecting both placement and strength. Dosing typically runs 0.6–1.2% by cement weight, trialled per mix design. For night pours and mass concrete, ice or chilled-water batching supplements the admixture. We supply retarding and high-range water-reducing admixtures with mix-design trial support."
    },
    {
      question: "What is polymer-modified mortar used for in repairs?",
      answer: "Polymer modification (SBR or acrylic dispersion in the gauging liquid) gives repair mortars the properties plain cement mortar lacks: adhesion to existing concrete, flexural strength, reduced shrinkage cracking, and much lower water permeability. It is the standard chemistry for spall repairs on reinforced concrete, screeds bonded to old slabs, and render in wet areas. Typical dosing is 5–20% polymer solids on cement weight depending on duty. We supply polymer bonding agents and ready-formulated repair mortars, plus epoxy systems where structural-grade adhesion is specified."
    },
    {
      question: "Do you supply epoxy coatings for industrial floors and tanks in Oman?",
      answer: "Yes — epoxy coating systems for warehouse and workshop floors, secondary-containment bunds, and internal tank linings, with surface-preparation and application guidance (substrate moisture limits matter in coastal Oman, and amine-blush risk in humid conditions dictates recoat windows). Alongside the coatings we stock the supporting chemistry: degreasers for substrate cleaning, acid etchants for concrete preparation, and mould release agents and shuttering oils for formwork. Site-specific system recommendations available against your exposure conditions."
    }
  ],
  alcohols: [
    {
      question: "Who supplies industrial alcohols — methanol, ethanol, IPA — in Oman?",
      answer: "Global Chemicals LLC stocks industrial alcohols in Muscat for same-day dispatch: methanol (technical grade), ethanol (96% and absolute ≥99.5%, denatured and undenatured against permit), isopropanol 99% (IPA), and n-butanol — in 20L jerricans, 200L drums, IBCs and bulk. Customers span oilfield services (methanol hydrate control), pharmaceutical and disinfectant producers (IPA, ethanol), and coatings manufacturers (butanol). Every batch ships with CoA confirming assay and water content, plus Class 3 flammable-liquid transport documentation."
    },
    {
      question: "What is the difference between ethanol 96% and absolute ethanol?",
      answer: "Ethanol and water form an azeotrope at ~96% — ordinary distillation cannot pass it, so 96% (rectified spirit) is the standard industrial grade for disinfection, extraction and general solvent use. Absolute ethanol (≥99.5–99.9%) is further dehydrated for uses where water interferes: analytical work, pharmaceutical formulation, water-sensitive reactions, and fuel blending. For 70% disinfectant production, 96% grade is the economical feedstock — absolute grade adds cost without benefit. Undenatured ethanol in Oman requires the applicable permits; denatured grades ship without them."
    },
    {
      question: "Why is methanol used for hydrate inhibition in gas operations?",
      answer: "Gas hydrates — ice-like solids of water and gas — form in pipelines and chokes at high pressure and the cool temperatures of night-time desert operations, blocking flow. Methanol injected at the wellhead or upstream of restrictions depresses the hydrate formation temperature; typical continuous rates run tens of litres per MMscf depending on water production and pipeline conditions, with batch injection ahead of shut-ins. MEG serves the same duty where recovery/regeneration is economic. We supply technical methanol in drums, IBCs and bulk to oilfield operations across Oman under JSRS registration."
    },
    {
      question: "Which alcohol grade is right for hand sanitiser and disinfectant manufacture?",
      answer: "WHO-formulation sanitisers use either ethanol at a final 80% v/v or IPA at 75% v/v, with glycerol as humectant and hydrogen peroxide 0.125% to eliminate spores in the packaging. Ethanol 96% and IPA 99% are the standard feedstocks — both stocked in Muscat with CoA. Producers registering products with Oman's Ministry of Health need batch documentation and assay certificates, which we supply per delivery, along with the glycerine and hydrogen peroxide to complete the formulation from one source."
    }
  ],
  'calcium-carbonate': [
    {
      question: "Who supplies calcium carbonate in bulk quantities from Oman?",
      answer: "Global Chemicals LLC supplies ground calcium carbonate (GCC) from Oman's high-purity limestone deposits — one of the country's flagship mineral exports — in multiple particle-size grades from coarse feed grades down to fine coated grades, packed in 25 kg bags, 1-tonne jumbo bags, and bulk. Customers span plastics and masterbatch compounders, paint and coatings producers, paper, rubber, animal feed and construction users across the GCC and Indian Ocean markets. Every grade ships with CoA covering purity, particle-size distribution, brightness and moisture."
    },
    {
      question: "What is the difference between coated and uncoated calcium carbonate?",
      answer: "Coated grades are surface-treated with stearic acid (typically ~1%), making the particle hydrophobic so it disperses uniformly in polymer melts and improves flow in PVC, PP and PE compounding — the standard for plastics masterbatch and cable filler duty. Uncoated grades stay hydrophilic, which suits water-based systems: paints and emulsions, paper coating, construction products and feed. Choosing wrong shows up as poor dispersion, die build-up in extrusion, or viscosity problems in paints. We stock both, in the particle sizes each application needs."
    },
    {
      question: "Which calcium carbonate particle size is right for my application?",
      answer: "Coarser grades (20–40 μm) serve construction products, putties and feed where cost per tonne dominates. Mid grades (5–20 μm) are the general workhorse for paints, paper filler and rubber. Fine grades (≤5 μm, top-cut controlled) go into plastics compounding, high-PVC paints and sealants where surface finish, gloss and mechanical properties matter; the finest coated grades approach functional-additive duty in rigid PVC. Brightness (whiteness ≥90 for decorative uses) is specified alongside size. Send the application and current spec sheet and we match the economic grade."
    },
    {
      question: "Do you supply food-grade or pharma-grade calcium carbonate?",
      answer: "Yes — food-grade (E170) and USP/BP pharmacopoeia grades are available on indent with full compliance documentation: heavy-metals limits, microbiological counts, and assay per the pharmacopoeia monograph. These grades serve calcium fortification, antacid manufacture, and toothpaste production. Technical grades for industry ship from Muscat stock; food/pharma grades are ordered against your specification with manufacturer certificates and typically 3–4 week lead time. State the pharmacopoeia edition your QA requires when enquiring."
    }
  ],
  additives: [
    {
      question: "Who supplies specialty chemical additives to manufacturers in Oman and the GCC?",
      answer: "Global Chemicals LLC supplies performance additives to plastics compounders, coatings and ink producers, lubricant blenders and adhesive manufacturers across Oman and the GCC — UV stabilisers and antioxidants, dispersants and wetting agents, defoamers, rheology modifiers, slip and anti-block agents, biocides and in-can preservatives, and pour-point depressants. Because additive selection is formulation-specific, our technical team works from your base formulation and failure mode (fading, settling, foaming, viscosity drift) to shortlist candidates, with samples for trial before committing to drum quantities."
    },
    {
      question: "Which additives protect plastics from Gulf sun and heat?",
      answer: "Outdoor plastic in the Gulf faces a double attack: UV irradiance among the world's highest, and surface temperatures on dark parts exceeding 80°C. A durable package pairs a HALS (hindered-amine light stabiliser) for long-term UV protection with a phenolic antioxidant for processing and heat ageing, plus a phosphite co-stabiliser for melt-processing colour hold; TiO2 or carbon-black pigmentation adds screening. Typical loadings run 0.2–0.6% HALS and 0.1–0.3% antioxidant depending on polymer and service life target. We supply the stabiliser families with loading guidance per polymer."
    },
    {
      question: "How do defoamers and dispersants improve paint and coating production?",
      answer: "Dispersants (dosed on pigment weight, commonly 0.5–2% for inorganic and up to 20%+ for fine organic pigments) charge-stabilise or sterically stabilise pigment particles during grinding — cutting grind time, raising colour strength, and preventing flocculation, flooding and settling in the can. Defoamers (0.1–0.5% split between grind and letdown) collapse the foam that milling and filling entrain, preventing surface craters and pinholes in the applied film. Wrong defoamer choice itself causes craters, so we sample-test candidates against your formulation before scale-up."
    },
    {
      question: "Do you supply pour-point depressants and viscosity modifiers for lubricant blending?",
      answer: "Yes — for lubricant blenders we supply viscosity-index improvers to hit multigrade targets, pour-point depressants for low-temperature flow, plus the supporting additive slate (antiwear, antioxidant, demulsifier components) depending on the blend programme. Loadings depend on base-oil group and target grade; we work from your blend recipe and target spec (SAE grade, VI, pour point) to confirm the additive and treat rate, with lab-scale samples for blend validation ahead of drum supply."
    }
  ]
};

// Display titles for category pages — used for both the H1 (category views
// must not reuse the generic /products hero heading) and ItemList schema.
const CATEGORY_DISPLAY_TITLES: Record<string, string> = {
  'water-treatment': 'Water Treatment Chemicals — Oman & GCC',
  'lubricants': 'Industrial Lubricants & Greases — Oman & GCC',
  'swimming-pool': 'Swimming Pool Chemicals — Oman & GCC',
  'lab-chemicals': 'Laboratory Chemicals & Reagents — Oman',
  'oilfield': 'Oilfield & Refinery Chemicals — Oman & GCC',
  'tank-cleaners': 'Marine & Industrial Tank Cleaners — Oman & GCC',
  'soap-detergent': 'Soap & Detergent Raw Materials — Oman & GCC',
  'food-beverage': 'Food & Beverage Grade Chemicals — Oman & GCC',
  'cooling-water': 'Cooling Water Treatment Chemicals — Oman & GCC',
  'corrosion-inhibitor': 'Corrosion Inhibitors — Oman & GCC',
  'ro-chemicals': 'RO Plant Chemicals — Oman & GCC',
  'solvents': 'Industrial Solvents — Oman & GCC',
  'inorganic': 'Inorganic Chemicals — Oman & GCC',
  'construction': 'Construction Chemicals — Oman & GCC',
  'alcohols': 'Industrial Alcohols — Oman & GCC',
  'glycols': 'Glycols — Oman & GCC',
  'ethanolamines': 'Ethanolamines — Oman & GCC',
  'chlorinated': 'Chlorinated Solvents — Oman & GCC',
  'lab-equipment': 'Laboratory Equipment — Oman & GCC',
  'calcium-carbonate': 'Calcium Carbonate — Oman & GCC',
  'agro': 'Agricultural Chemicals — Oman & GCC',
  'additives': 'Chemical Additives — Oman & GCC',
};

const Products = () => {
  const { t, i18n } = useTranslation();
  const { category: categoryParam } = useParams<{ category?: string }>();
  const location = useLocation();
  const langPrefix = getLangPrefixFromPath(location.pathname);

  // A /products/:category URL whose segment isn't a real category (e.g.
  // /products/foobar) must not render as an indexable, self-canonical soft-404.
  const isUnknownCategory = !!categoryParam && !ALL_CATEGORIES.includes(categoryParam);

  // Single source for both the rendered accordion and the FAQ JSON-LD, so the
  // markup can never describe questions the page doesn't actually show.
  const visibleFAQs =
    categoryParam && categoryFAQs[categoryParam] ? categoryFAQs[categoryParam] : productsFAQs;

  // Build the crawlable URL for a sidebar category. 'all' → the products root.
  const categoryHref = (id: string) =>
    withLangPrefix(langPrefix, id === 'all' ? '/products' : `/products/${id}`);

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Search must span the whole catalogue. On a category URL we'd otherwise only
  // have that one category loaded, so a query for a sibling-category product
  // (e.g. "PAC" while on /products/oilfield) would wrongly return nothing even
  // though the UI promises results "across all categories".
  const hasSearch = searchQuery.trim().length > 0;

  // Sync URL category param → active filter when navigating between category routes
  useEffect(() => {
    setActiveCategory(categoryParam || 'all');
  }, [categoryParam]);

  // Lazy-load products: the active category when browsing, or the full catalogue
  // when searching (so cross-category search actually works) or on /products.
  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    const loader = categoryParam && !hasSearch
      ? loadProductsByCategory(categoryParam)
      : loadAllProducts();
    loader
      .then((data) => {
        if (cancelled) return;
        setProducts(data as Product[]);
        setProductsLoading(false);
      })
      .catch((err) => {
        // safeImport already handles stale-chunk reloads; this just ensures we
        // don't get stuck on a spinner if the import fails for any other reason.
        console.error('[Products] Failed to load product data:', err);
        if (cancelled) return;
        setProducts([]);
        setProductsLoading(false);
      });
    return () => { cancelled = true; };
  }, [categoryParam, hasSearch]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 3) {
      trackSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const categories = [
    { id: 'all', name: t('products.allProducts'), icon: FlaskConical },
    { id: 'oilfield', name: 'Oilfield & Refinery', icon: Factory },
    { id: 'water-treatment', name: 'Water Treatment Chemicals', icon: Droplets },
    { id: 'lubricants', name: 'Lubricants & Greases', icon: Wrench },
    { id: 'corrosion-inhibitor', name: 'Corrosion Inhibitor', icon: Shield },
    { id: 'tank-cleaners', name: 'Tank Cleaners', icon: SprayCan },
    { id: 'ro-chemicals', name: 'RO Chemicals', icon: Droplets },
    { id: 'cooling-water', name: 'Cooling Water Chemicals', icon: Droplets },
    { id: 'swimming-pool', name: 'Swimming Pool Chemicals', icon: Droplets },
    { id: 'construction', name: 'Construction', icon: Building2 },
    { id: 'food-beverage', name: 'Food & Beverage', icon: Wine },
    { id: 'soap-detergent', name: 'Soap & Detergent', icon: Sparkles },
    { id: 'calcium-carbonate', name: 'Calcium Carbonate', icon: FlaskConical },
    { id: 'additives', name: 'Additives', icon: Zap },
    { id: 'lab-equipment', name: 'Lab Equipment', icon: TestTube },
    { id: 'lab-chemicals', name: 'Lab Chemicals', icon: Beaker },
    { id: 'agro', name: 'Agro Products', icon: Wheat },
    { id: 'solvents', name: 'Solvents', icon: FlaskRound },
    { id: 'inorganic', name: 'Inorganic Chemicals', icon: Microscope },
    { id: 'chlorinated', name: 'Chlorinated Solvents', icon: Flame },
    { id: 'ethanolamines', name: 'Ethanolamines', icon: Beaker },
    { id: 'glycols', name: 'Glycols', icon: Wind },
    { id: 'alcohols', name: 'Alcohols', icon: FlaskRound },
  ];

  // Memoize filtered products to prevent recalculating on every render
  const filteredProducts = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    // Search is global: when the user has typed a query, ignore the active
    // category so they don't get an empty page when their term lives in a
    // sibling category (e.g. searching "PAC" while on Oilfield).
    let filtered = products;
    if (!trimmedQuery && activeCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === activeCategory);
    }

    if (trimmedQuery) {
      const query = trimmedQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        // Search in title
        if (product.title.toLowerCase().includes(query)) return true;

        // Search in description
        if (product.description.toLowerCase().includes(query)) return true;

        // Search in details
        if (product.details) {
          // Search in formula
          if (product.details.formula?.toLowerCase().includes(query)) return true;

          // Search in CAS number
          if (product.details.casNumber?.toLowerCase().includes(query)) return true;

          // Search in alternative names
          if (product.details.alternativeNames?.some(name =>
            name.toLowerCase().includes(query)
          )) return true;

          // Search in SEO keywords
          if (product.details.seoKeywords?.some(keyword =>
            keyword.toLowerCase().includes(query)
          )) return true;

          // Search in applications
          if (product.details.applications?.some(app =>
            app.toLowerCase().includes(query)
          )) return true;
        }

        return false;
      });
    }

    return filtered;
    // `products` MUST be in deps — otherwise the memo returns its initial empty
    // result after the lazy JSON loader resolves, and prerendered category pages
    // ship with "No products available" baked in.
  }, [activeCategory, searchQuery, products]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={(() => {
          const categoryTitles: Record<string, string> = {
            'water-treatment': 'Water Treatment Chemicals Oman & GCC | GC Oman',
            'lubricants': 'Industrial Lubricants Oman & Middle East | GC Oman',
            'swimming-pool': 'Swimming Pool Chemicals Oman & GCC | GC Oman',
            'lab-chemicals': 'Laboratory Chemicals Oman & Middle East | GC Oman',
            'oilfield': 'Oilfield & Refinery Chemicals Oman & GCC | GC Oman',
            'tank-cleaners': 'Marine & Industrial Tank Cleaners Oman | GC Oman',
            'soap-detergent': 'Soap & Detergent Chemicals Oman & GCC | GC Oman',
            'food-beverage': 'Food & Beverage Grade Chemicals Oman & GCC | GC Oman',
            'cooling-water': 'Cooling Water Chemicals Oman & GCC | GC Oman',
            'corrosion-inhibitor': 'Corrosion Inhibitors Oman & Middle East | GC Oman',
            'ro-chemicals': 'RO Plant Chemicals Oman & GCC | GC Oman',
            'solvents': 'Industrial Solvents Oman & Middle East | GC Oman',
            'inorganic': 'Inorganic Chemicals Oman & GCC | GC Oman',
            'construction': 'Construction Chemicals Oman & GCC | GC Oman',
            'alcohols': 'Industrial Alcohols Oman & GCC | GC Oman',
            'glycols': 'Glycols Supplier Oman & GCC | GC Oman',
            'ethanolamines': 'Ethanolamines Supplier Oman & GCC | GC Oman',
            'chlorinated': 'Chlorinated Solvents Oman & GCC | GC Oman',
            'lab-equipment': 'Laboratory Equipment Oman & GCC | GC Oman',
            'calcium-carbonate': 'Calcium Carbonate Supplier Oman & GCC | GC Oman',
            'agro': 'Agricultural Chemicals Oman & GCC | GC Oman',
            'additives': 'Chemical Additives Oman & GCC | GC Oman'
          };
          return categoryTitles[activeCategory] || 'Industrial Chemicals Supplier Oman & GCC | GC Oman';
        })()}
        description={(() => {
          const categoryDescs: Record<string, string> = {
            'water-treatment': 'Water treatment chemicals in Oman & GCC — PAC, caustic soda, calcium hypochlorite, antiscalants. Fast delivery across Muscat, Dubai & Riyadh.',
            'lubricants': 'Shell, Mobil, Castrol & GP lubricants supplier in Oman & Middle East. Industrial and automotive grades with same-day Muscat delivery.',
            'swimming-pool': 'Swimming pool chemicals in Oman & GCC — chlorine tablets, algaecides, TCCA, sodium hypochlorite. Fast delivery across Muscat, Dubai & Riyadh.',
            'lab-chemicals': 'Laboratory chemicals and reagents supplier in Oman & Middle East. AR grade acids, solvents, and analytical reagents for research labs. Request a quote today.',
            'oilfield': 'Oilfield and refinery chemicals in Oman & GCC — drilling fluids, production chemicals, corrosion inhibitors. Trusted by oil & gas companies across the Middle East.',
            'tank-cleaners': 'Heavy duty alkaline, acidic and neutral tank cleaners for marine and industrial applications in Oman & GCC. Environmentally friendly sludge breakers.',
            'soap-detergent': 'Raw materials for soap and detergent manufacturing in Oman & GCC including LABSA, SLES, Caustic Soda, Soda Ash & more. Request a quote today.',
            'food-beverage': 'Food-grade chemicals in Oman & GCC — Citric Acid, Ascorbic Acid, Calcium Carbonate, Sodium Bicarbonate. Certified high-purity ingredients for F&B industry.',
            'cooling-water': 'Microbiocides, corrosion inhibitors & scale inhibitors for cooling towers and chilled water systems in Oman & GCC. Increase HVAC efficiency.',
            'corrosion-inhibitor': 'Protect metals with our premium corrosion inhibitors in Oman & GCC. Suitable for closed loop systems, boilers, cooling towers, and oilfield applications.',
            'ro-chemicals': 'Reverse osmosis chemicals in Oman & GCC — antiscalants, membrane cleaners, and biocides for water desalination plants. Ensure optimal RO performance.',
            'solvents': 'Premium industrial solvents provider in Oman & Middle East. High purity Toluene, Xylene, Acetone, Hexane, MEK, and other chemical solvents.',
            'inorganic': 'Wholesale supplier of inorganic chemicals in Oman & GCC including Sodium Nitrite, Potassium Chloride, Borax, and Silica Gel.',
            'construction': 'Construction chemicals, concrete additives, and epoxy solutions in Oman & GCC for civil engineering and infrastructure projects.',
            'alcohols': 'Industrial grade alcohols in Oman & GCC — Methanol, Ethanol, Isopropanol (IPA), Butanol. Available in bulk & drums for immediate delivery.',
            'glycols': 'Supplier of Monoethylene Glycol (MEG), Diethylene Glycol (DEG) and Propylene Glycol in Oman & GCC. Available in industrial and food grades.',
            'ethanolamines': 'Monoethanolamine (MEA), Diethanolamine (DEA), and Triethanolamine (TEA) supplier in Oman & GCC for gas sweetening and industrial uses.',
            'chlorinated': 'Methylene Chloride, Perchloroethylene, Trichloroethylene supplier in Oman & GCC. High grade chlorinated solvents for industrial degreasing.',
            'lab-equipment': 'High precision laboratory equipment and apparatus for analytical and research laboratories across Oman & Middle East.',
            'calcium-carbonate': 'High purity Calcium Carbonate for industrial, food, and pharmaceutical applications in Oman & GCC.',
            'agro': 'Specialty agricultural chemicals and fertilizers for farming and greenhouse applications in Oman & GCC.',
            'additives': 'Performance-enhancing chemical additives for coatings, plastics, and industrial manufacturing in Oman & GCC.'
          };
          return categoryDescs[activeCategory] || 'Comprehensive catalog of industrial chemicals in Oman & GCC — water treatment, lubricants, lab chemicals, oilfield & swimming pool products. ISO certified. Exporting to UAE, Saudi Arabia, Qatar, Kuwait, Bahrain.';
        })()}
        keywords="water treatment chemicals Oman UAE, PAC Oman, caustic soda GCC, calcium hypochlorite Middle East, industrial chemicals Muscat Dubai Riyadh, laboratory chemicals Oman, Shell lubricants UAE, Mobil oils Saudi Arabia, chemical supplier GCC, chemicals Dubai, Riyadh chemicals, industrial lubricants Oman, RO chemicals UAE, cooling tower chemicals Middle East, swimming pool chemicals GCC, chemical exporter Oman"
        ogTitle={(() => {
          const categoryOgTitles: Record<string, string> = {
            'agro': 'Agricultural Chemicals & Fertilizers Supplier | Oman & GCC',
          };
          if (categoryOgTitles[activeCategory]) return categoryOgTitles[activeCategory];
          return activeCategory !== 'all'
            ? `${activeCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Global Chemicals LLC Oman & GCC`
            : 'Chemical Products | Industrial Chemicals Oman & Middle East | Global Chemicals LLC';
        })()}
        ogDescription={(() => {
          const categoryOgDescs: Record<string, string> = {
            'agro': 'Fertilizers, micronutrients, soil amendments and irrigation chemicals for Oman farms — urea, DAP, NPK, potassium chloride, calcium nitrate, zinc sulphate, gypsum, humic acid.',
          };
          return categoryOgDescs[activeCategory] ||
            'Leading chemical supplier in Oman exporting to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. Browse our complete catalog of water treatment chemicals, industrial lubricants, and specialty chemicals.';
        })()}
        ogUrl={categoryParam && !isUnknownCategory ? `https://gcoman.com/products/${categoryParam}` : 'https://gcoman.com/products'}
        canonical={categoryParam && !isUnknownCategory ? `https://gcoman.com/products/${categoryParam}` : 'https://gcoman.com/products'}
        noIndex={isUnknownCategory}
      />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://gcoman.com/' },
        { name: 'Products', url: 'https://gcoman.com/products' },
        ...(categoryParam ? [{ name: categoryParam.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), url: `https://gcoman.com/products/${categoryParam}` }] : [])
      ]} />
      <FAQStructuredData faqs={visibleFAQs} />
      <SpeakableStructuredData url={categoryParam ? `https://gcoman.com/products/${categoryParam}` : 'https://gcoman.com/products'} cssSelector={["h1", "h2", ".speakable"]} />
      {categoryParam && filteredProducts.length > 0 && (
        <ItemListStructuredData
          name={CATEGORY_DISPLAY_TITLES[categoryParam] || `${categoryParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} — Global Chemicals LLC Oman`}
          description={`Product catalogue for ${categoryParam.replace(/-/g, ' ')} chemicals supplied by Global Chemicals LLC in Oman and the GCC region.`}
          url={`https://gcoman.com/products/${categoryParam}`}
          items={filteredProducts.map(p => ({
            id: p.id,
            title: p.title,
            url: `https://gcoman.com/products/${p.category}/${p.id}`,
            description: p.description,
          }))}
        />
      )}

      <Navigation />

      <main id="main-content">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {/* Category views get their own identity as the H1 — reusing the
                  generic /products hero heading on category URLs left users
                  (and crawlers) unable to tell the pages apart. Arabic renders
                  keep the localized generic heading (category titles are
                  English-only and /ar category views are noindex). */}
              {categoryParam && i18n.language !== 'ar'
                ? (CATEGORY_DISPLAY_TITLES[categoryParam] ?? `${categoryParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} — Oman & GCC`)
                : t('products.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('products.heroDesc')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">{t('products.badges.isoCertified')}</span>
              <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full font-medium">{t('products.badges.yearsExperience')}</span>
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full font-medium">{t('products.badges.productsCount')}</span>
              <span className="px-4 py-2 bg-tertiary/10 text-tertiary rounded-full font-medium">{t('products.badges.technicalSupport')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Intro Block — unique content per category for SEO */}
      {activeCategory !== 'all' && (() => {
        // Hub-grade categories can add `sections` (subheaded prose) and a
        // comparison `table` under the intro paragraph — the supplier-page
        // depth that "X supplier" queries reward (Aug 2026 gap analysis:
        // these families had real impressions at positions 25-70 because the
        // page was a catalogue card, not a supplier page).
        type CategoryIntro = {
          heading: string;
          body: string;
          sections?: { heading: string; body: string }[];
          table?: { caption: string; headers: string[]; rows: string[][] };
        };
        const categoryIntros: Record<string, CategoryIntro> = {
          'water-treatment': {
            heading: 'Water Treatment Chemicals Supplier in Oman & GCC',
            body: 'Global Chemicals LLC supplies a comprehensive range of water treatment chemicals to municipal water utilities, industrial plants, hotels, and desalination facilities across Oman and the GCC. Our water treatment portfolio covers coagulants (PAC — Poly Aluminium Chloride, aluminium sulphate), disinfectants (calcium hypochlorite, sodium hypochlorite, chlorine tablets), pH adjustment chemicals (caustic soda flakes, soda ash, sulphuric acid), antiscalants for RO and desalination systems, corrosion inhibitors, biocides, antifoams, and flocculants. All products are supplied with GHS-compliant SDS and CoA. Same-day delivery in Muscat; next-day delivery to Sohar and Salalah. JSRS certified for supply to PDO and OQ water treatment operations.'
          },
          'lubricants': {
            heading: 'Shell, Mobil, Castrol & GP Lubricants Supplier in Oman',
            body: "Global Chemicals LLC is an authorised distributor of Shell, Mobil, Castrol, and GP (IPOL) lubricants in Muscat, Oman — stocking engine oils, hydraulic oils, gear oils, greases, compressor oils, and transmission fluids for automotive, industrial, and heavy-duty applications. All branded lubricants are 100% genuine, supplied with original Certificate of Analysis and GHS Safety Data Sheet. We serve oil & gas operators (PDO, OQ, Oman LNG), construction fleets, manufacturing plants, and logistics companies across Oman. Available in 1L, 20L, 208L drums, and IBC containers. Same-day delivery in Muscat."
          },
          'oilfield': {
            heading: 'Oilfield & Refinery Chemicals Supplier — JSRS Certified Oman',
            body: "Global Chemicals LLC is JSRS (Joint Supplier Registration System) certified, qualifying us to supply chemicals directly to Petroleum Development Oman (PDO), OQ, OPAL, Occidental (Oxy), and their approved contractors. Our oilfield chemicals range includes corrosion inhibitors, scale inhibitors, H2S scavengers, demulsifiers, wax inhibitors, biocides, drilling fluid additives (bentonite, CMC, barite), well stimulation chemicals, and production chemicals for Oman's upstream and midstream oil & gas sector. We supply field operations across South Oman (Marmul, Nimr, Qarn Alam), the Duqm Refinery zone, and Sohar Refinery. Rapid supply chain with emergency delivery capability."
          },
          'swimming-pool': {
            heading: 'Swimming Pool Chemicals Supplier in Oman — Muscat & Nationwide',
            body: "Global Chemicals LLC supplies swimming pool treatment chemicals across Oman, serving hotel pools, residential developments, water parks, school facilities, and public pools in Muscat, Sohar, Salalah, and Nizwa. Our pool chemicals range covers chlorine tablets (TCCA 90% — 200g and 500g), calcium hypochlorite granules, sodium hypochlorite 12–15%, algaecides (liquid and tablet), pH reducers (sodium bisulphate), pH raisers (soda ash), stabilisers (cyanuric acid), and complete pool starter kits. Oman's high UV and temperatures require frequent chemical dosing — our team provides free dosing guidance and technical support for all pool types."
          },
          'lab-chemicals': {
            heading: 'Laboratory Chemicals & Reagents Supplier in Oman',
            body: "Global Chemicals LLC supplies laboratory-grade chemicals, analytical reagents, and HPLC solvents to quality control laboratories, research facilities, university laboratories, and testing centres across Oman. Our lab chemicals range covers analytical reagent (AR) grade acids (sulphuric, hydrochloric, nitric, acetic, phosphoric), AR grade bases (sodium hydroxide, potassium hydroxide), organic solvents (acetone, methanol, ethanol absolute, IPA, hexane, toluene, dichloromethane, chloroform), inorganic salts and standards, indicators, buffers, culture media (agar, glucose, peptone), and microbiological reagents. SDS and CoA supplied with every batch. Minimum order from 500ml/100g."
          },
          'soap-detergent': {
            heading: 'Soap & Detergent Raw Materials Supplier in Oman & GCC',
            body: "Global Chemicals LLC supplies soap and detergent manufacturing raw materials to producers across Oman, UAE, and the wider GCC region. Our soap and detergent chemicals portfolio includes caustic soda (NaOH) in flakes, prills, and liquid forms — the primary raw material for saponification; LABSA (Linear Alkylbenzene Sulphonic Acid) and SLES 70% (Sodium Laureth Sulphate) for surfactant-based formulations; soda ash dense and light (sodium carbonate) for detergency building; glycerine, EDTA, STPP (sodium tripolyphosphate), sodium metasilicate, and hydrogen peroxide in various concentrations. Bulk pricing available for regular manufacturers. Technical formulation support available on request."
          },
          'food-beverage': {
            heading: 'Food-Grade Chemicals Supplier in Oman — HACCP & Halal Compatible',
            body: "Global Chemicals LLC supplies food-grade (food contact quality) chemicals to food manufacturers, beverage producers, bakeries, dairy facilities, and food processing plants across Oman. Our food-grade chemicals meet international food safety standards including HACCP, EU/FCC food chemical standards, and are Halal-compatible. Products include food-grade caustic soda (E524), citric acid anhydrous and monohydrate (E330), ascorbic acid (E300 Vitamin C), sodium bicarbonate (E500), propylene glycol food grade (E1520), xanthan gum (E415), potassium sorbate (E202), sodium hypochlorite food grade for CIP cleaning, and ethanol 70% (food equipment sanitiser). CoA, food safety datasheet, and HACCP compliance documentation available."
          },
          'ro-chemicals': {
            heading: 'RO Membrane Chemicals & Antiscalant Supplier in Oman',
            body: "Global Chemicals LLC supplies reverse osmosis (RO) membrane chemicals to desalination plants, industrial RO systems, and commercial water treatment facilities across Oman. Oman has one of the highest per-capita RO infrastructure densities in the world — and the country's specific water chemistry (high TDS brackish groundwater, high-TDS seawater) creates significant membrane fouling and scaling challenges. Our RO chemical range includes antiscalants (specifically formulated for Oman's high-sulphate brackish water), membrane cleaners (alkaline and acidic grades for biofouling, carbonate, and silica removal), passivation agents (for new membrane commissioning), and descalants. Technical dosing programmes and RO system optimisation support available."
          },
          'corrosion-inhibitor': {
            heading: 'Corrosion Inhibitor Supplier — Pipelines, Cooling Systems, Water Treatment',
            body: "Global Chemicals LLC supplies corrosion inhibitors matched to the application, not one-size-fits-all: film-forming amine inhibitors for gas pipelines and flowlines, molybdate and nitrite programmes for closed-loop chilled water, phosphonate blends for open cooling towers, oxygen scavengers for boiler feedwater, and multi-metal packages for mixed-metallurgy district cooling networks across Oman and the GCC. Tell us the system — metallurgy, water chemistry, temperature, and whether the loop is open or closed — and we specify the inhibitor and dose rate. JSRS-registered for supply to PDO, OQ and their contractors.",
            table: {
              caption: 'Which corrosion inhibitor for which system',
              headers: ['Application', 'Recommended chemistry', 'Our products', 'Typical dose'],
              rows: [
                ['Gas pipelines & flowlines', 'Film-forming amines, imidazoline-based', 'Corrosion Inhibitor (oilfield), Gas Compressor CI', 'Continuous 10–50 ppm or batch'],
                ['Closed-loop chillers / district cooling', 'Molybdate, nitrite-azole multi-metal', 'Closed System CI, Sodium Molybdate, Multi-Metal CI', '2–5% initial charge, then maintain'],
                ['Open cooling towers', 'Phosphonate-azole with dispersant', 'Cool Water Treat CI, Corro Guard', '80–150 ppm of recirculation'],
                ['Boiler feedwater', 'Oxygen scavenger + pH control', 'Oxygen Scavenger, pH Booster CI', 'To residual sulphite 20–40 ppm'],
                ['Water treatment plants', 'Blended phosphonate programmes', 'Corrosion Inhibitor (water treatment)', 'Per water analysis'],
              ],
            },
            sections: [
              { heading: 'Closed-loop systems: why molybdate programmes win in the Gulf', body: 'High-chloride make-up water (desalinated supply with elevated residual chloride) attacks mild steel in chilled-water circuits. Molybdate residuals of 10–20 mg/L protect steel pipework, with tolyltriazole at 1–5 mg/L protecting copper heat-exchanger tubes — the standard specification for hospital, hotel, and district-cooling loops in Muscat and Dubai. We supply both the blended product and sodium molybdate for in-house programmes, with residual test kits.' },
              { heading: 'Pipelines and oilfield systems', body: 'For sweet and sour service flowlines we supply film-forming inhibitors qualified for continuous injection or batch treatment, plus H₂S scavengers and oxygen scavengers for hydrotest and preservation water. JSRS registration covers supply into PDO, OQ, Oxy and contractor procurement; CoA and dose-rate guidance ship with every order.' },
            ],
          },
          'tank-cleaners': {
            heading: 'Marine & Industrial Tank Cleaners Supplier in Oman',
            body: "Global Chemicals LLC supplies heavy-duty tank cleaning chemicals for vessel cargo holds, marine fuel tanks, industrial storage tanks, and process vessels across Oman's ports (Muscat, Sohar, Duqm, Salalah). Our tank cleaner range covers alkaline degreasers for petroleum and hydrocarbon residues, acid descalants for scale and rust removal, neutral cleaners for food-grade tanks and sensitive linings, sludge emulsifiers for crude oil tank bottoms, passivation liquids for stainless steel and carbon steel tanks, and environmental discharge-safe formulations meeting MARPOL requirements. Technical data sheets and application guidance available for all products."
          },
          'cooling-water': {
            heading: 'Cooling Tower & Chilled Water Treatment Chemicals in Oman',
            body: "Cooling towers and chilled water systems operating in Oman's extreme climate — ambient temperatures above 45°C, high evaporation rates, and varying water quality — require robust chemical treatment programmes to prevent scale, corrosion, and biological fouling (including Legionella). Global Chemicals LLC supplies a complete range of cooling water treatment chemicals: broad-spectrum biocides and algaecides, corrosion and scale inhibitors, antifouling agents, drift eliminators, and pH control chemicals. We serve district cooling plants, HVAC systems in hotels and malls, process cooling in manufacturing, and power plant cooling water systems across Oman."
          },
          'construction': {
            heading: 'Construction Chemicals & Concrete Admixtures Supplier in Oman',
            body: "Global Chemicals LLC supplies construction chemicals and concrete admixtures to civil contractors, ready-mix concrete plants, precast yards, and infrastructure projects across Oman and the GCC. Our construction range covers superplasticisers and high-range water reducers for high-strength and self-compacting concrete, retarders and accelerators for hot-weather and cold-joint pours, air-entraining agents, integral waterproofing admixtures, curing compounds, bonding agents and epoxy adhesives, non-shrink grouts, tile adhesives, and concrete repair mortars. Oman's hot, arid climate makes admixture selection critical — our technical team advises on dosing for ambient temperatures above 40°C and aggressive sulphate-bearing groundwater commonly encountered in coastal and Batinah projects."
          },
          'solvents': {
            heading: 'Industrial Solvents Supplier in Oman, UAE & GCC',
            body: "Global Chemicals LLC is a leading industrial solvents supplier in Oman, stocking high-purity acetone, methanol, ethanol, isopropanol (IPA), toluene, xylene, n-hexane, methyl ethyl ketone (MEK), ethyl acetate, white spirit, and dichloromethane. We serve paints and coatings manufacturers, printing inks producers, pharmaceutical compounders, electronics assembly facilities, adhesive and sealant makers, and oilfield service companies across Oman, UAE, Saudi Arabia, and Qatar. All solvents come with batch-level Certificates of Analysis confirming purity (typically ≥99%), water content, and residue. Available in 20L jerricans, 200L drums, and IBCs; bulk road-tanker delivery available for repeat industrial buyers."
          },
          'inorganic': {
            heading: 'Inorganic Chemicals Supplier in Oman & GCC',
            body: "Global Chemicals LLC supplies a comprehensive range of inorganic chemicals — sodium nitrite, sodium nitrate, potassium chloride, potassium nitrate, borax (sodium tetraborate), boric acid, silica gel, sodium thiosulphate, ferrous sulphate, ferric chloride, copper sulphate, and zinc sulphate — to manufacturing, water treatment, metallurgy, and laboratory customers in Oman, UAE, and the wider GCC. Our inorganic salts and oxides are sourced from quality-audited producers and supplied with batch-level Certificates of Analysis. Available in 25kg bags, 50kg sacks, and 1-tonne jumbo bags. Technical-grade and AR-grade options stocked; food-grade and pharma-grade variants available on indent."
          },
          'chlorinated': {
            heading: 'Chlorinated Solvents Supplier — Methylene Chloride, Perc, TCE Oman',
            body: "Global Chemicals LLC supplies high-purity chlorinated solvents — methylene chloride (DCM/dichloromethane), perchloroethylene (PCE/perc/tetrachloroethylene), and trichloroethylene (TCE) — to industrial degreasing, dry cleaning, paint stripping, and pharmaceutical extraction customers in Oman, UAE, and across the GCC. Chlorinated solvents are aggressive cleaners with strict handling and disposal requirements; we supply only with current GHS-compliant SDS, exposure-control guidance, and full Certificate of Analysis confirming purity (≥99.5%) and stabiliser content. Packaging: 250kg drums and 1,100kg IBCs. Stocked in our Muscat warehouse for same-day Oman dispatch; export to GCC on documented end-use."
          },
          'ethanolamines': {
            heading: 'Ethanolamine Suppliers — MEA, DEA, TEA, MDEA in Oman & GCC',
            body: "Global Chemicals LLC supplies and distributes the full ethanolamine series — monoethanolamine (MEA), diethanolamine (DEA), triethanolamine (TEA 85% and 99%), and methyldiethanolamine (MDEA) — to gas-sweetening operations, soap and personal-care manufacturers, cement grinding-aid producers, metalworking-fluid blenders, and corrosion-inhibitor formulators across Oman, UAE, Saudi Arabia, and Qatar. MEA, DEA and MDEA serve amine gas treating in Oman's upstream gas plants and refineries (Sohar, Duqm); TEA serves cement grinding aids, surfactant neutralisation, and personal-care formulation. Supplied at ≥99% purity with full CoA in 230 kg drums and IBCs; long-term contract pricing for industrial buyers.",
            table: {
              caption: 'Ethanolamine selection at a glance',
              headers: ['Amine', 'Where it wins', 'Notes'],
              rows: [
                ['MEA', 'Deep CO₂ removal at low pressure', 'Highest reactivity; higher regeneration energy'],
                ['DEA', 'Refinery gas treating, mixed CO₂/H₂S', 'Lower corrosion than MEA at moderate loadings'],
                ['MDEA', 'Selective H₂S removal, high-pressure gas', 'Selectivity tunable with activators; lowest energy'],
                ['TEA 85/99', 'Cement grinding aids, cosmetics, esters', 'Mild base; surfactant and emulsifier chemistry'],
              ],
            },
          },
          'glycols': {
            heading: 'Glycol Suppliers in Oman & GCC — MEG, DEG, TEG, Propylene Glycol',
            body: "Global Chemicals LLC is a bulk glycol supplier and distributor serving Oman, UAE, Saudi Arabia, Qatar, Kuwait and Bahrain from our Muscat warehouse. We stock the full glycol series — monoethylene glycol (MEG), diethylene glycol (DEG), triethylene glycol (TEG), propylene glycol (industrial and USP food grade) and butyl glycol (EGBE) — for HVAC and district-cooling contractors, natural-gas dehydration operators, polyester and resin producers, coatings formulators, and food and pharmaceutical manufacturers. Every consignment ships with batch Certificate of Analysis and GHS-compliant SDS; same-day dispatch in Muscat, 2–4 hour road lane to Fujairah, and scheduled GCC freight (see delivery lanes below).",
            table: {
              caption: 'Glycol selection guide — grades stocked in Muscat',
              headers: ['Glycol', 'Typical purity', 'Primary applications in the GCC', 'Packaging'],
              rows: [
                ['MEG (monoethylene glycol)', '≥99.8%', 'Chilled-water/district cooling antifreeze, gas hydrate inhibition, PET/polyester feedstock', '230 kg drums · 1,000 L IBC · bulk'],
                ['DEG (diethylene glycol)', '≥99.5%', 'Natural-gas dehydration (TEG make-up blends), unsaturated polyester resins, plasticisers', '235 kg drums · IBC'],
                ['TEG (triethylene glycol)', '≥99.0%', 'Gas dehydration contactor circuits (upstream Oman), humectant, solvent', '225 kg drums · IBC'],
                ['Propylene glycol (PG)', 'Industrial ≥99.5% / USP', 'Food & beverage (E1520), pharma formulation, low-toxicity HVAC loops, fog fluid', '215 kg drums · IBC'],
                ['Butyl glycol (EGBE)', '≥99.0%', 'Coatings and lacquer solvent, industrial cleaners, drilling-fluid additive', '190 kg drums · IBC'],
              ],
            },
            sections: [
              { heading: 'Which glycol do you need?', body: "For closed-loop chilled water and district cooling in the Gulf's ambient temperatures, inhibited MEG at 25–35% is the standard; use PG where incidental food contact or lower toxicity is required (hotels, food plants). For natural-gas dehydration, TEG is the contactor workhorse — we supply both fresh TEG and DEG for blend make-up to operators in Oman's upstream sector. Coatings and cleaner formulators typically want butyl glycol for its evaporation profile. Unsure between grades? Send us the duty specification and our technical team will confirm the right glycol, concentration, and inhibitor package." },
              { heading: 'Delivery lanes for bulk glycols', body: 'Same-day delivery in Muscat and Rusayl; next-day Sohar and Nizwa; 2–3 days Salalah and Duqm. Cross-border: Fujairah in 2–4 hours by road, Dubai and Abu Dhabi in 3–5 days, Saudi Arabia (Riyadh, Dammam, Jubail) in 4–7 days under GCC customs transit, with sea freight from Sohar Port for Jeddah and Yanbu bulk orders. Full drum, palletised IBC, and ISO-tank quantities.' },
              { heading: 'Documentation and compliance', body: 'Every glycol shipment includes batch CoA (purity, water content, colour APHA), GHS SDS, and — for USP propylene glycol — food-grade compliance documentation compatible with HACCP systems. DEG and MEG are supplied for industrial use with end-use declarations where required by import regulations in the destination GCC state.' },
            ],
          },
          'alcohols': {
            heading: 'Industrial Alcohols Supplier — Methanol, Ethanol, IPA, Butanol Oman',
            body: "Global Chemicals LLC supplies industrial-grade alcohols — methanol, ethanol absolute (denatured and undenatured), isopropyl alcohol (IPA), n-butanol, and isobutanol — to oilfield service companies, pharmaceutical compounders, paint and coatings producers, hand sanitiser manufacturers, and laboratory users across Oman, UAE, Saudi Arabia, and Qatar. Methanol is widely used in Oman's gas industry for hydrate inhibition; IPA is critical for electronics cleaning, pharmaceutical formulation, and disinfectant production; n-butanol serves coatings and plasticiser manufacture. All alcohols supplied at ≥99.5% purity with batch CoA confirming water content and residue on evaporation. Available in 200L drums, IBCs, and bulk."
          },
          'calcium-carbonate': {
            heading: 'Calcium Carbonate Supplier — GCC, PCC, Coated Grades Oman',
            body: "Global Chemicals LLC supplies high-purity calcium carbonate (CaCO₃) — both ground calcium carbonate (GCC) and precipitated calcium carbonate (PCC), in coated and uncoated grades — to plastics compounders, PVC pipe manufacturers, paint and coatings producers, paper mills, rubber masterbatch makers, animal feed formulators, and food and pharmaceutical customers across Oman and the GCC. We stock multiple particle-size grades (from 10μm down to ultrafine sub-micron) with brightness and whiteness specifications suited to filler, extender, and functional uses. Food-grade (E170) and pharma-grade (USP/BP) variants available with full compliance documentation. Supplied in 25kg bags and 1-tonne jumbo bags; bulk silo delivery for high-volume manufacturers."
          },
          'additives': {
            heading: 'Chemical Additives Supplier — Coatings, Plastics, Industrial Oman',
            body: "Global Chemicals LLC supplies performance-enhancing chemical additives to plastics compounders, paint and coatings manufacturers, lubricant blenders, and adhesive producers across Oman and the GCC. Our additives portfolio covers UV stabilisers and antioxidants for polymer durability, slip and anti-blocking agents, dispersants and wetting agents, defoamers and surface levelling agents, rheology modifiers and thickeners, biocides and preservatives, viscosity index improvers and pour-point depressants for lubricant formulation, and compatibilisers for polymer alloys. Technical formulation support available — our team helps customers select the right additive package for ambient-temperature performance in Oman's hot climate, including elevated thermal-stability and UV-resistance requirements."
          },
          'lab-equipment': {
            heading: 'Laboratory Equipment & Apparatus Supplier in Oman',
            body: "Global Chemicals LLC supplies laboratory equipment, apparatus, and consumables to quality-control labs, university research labs, hospital pathology labs, water-testing laboratories, and industrial QC departments across Oman. Our lab equipment range covers analytical balances and precision balances, pH meters and conductivity meters, hot plates and magnetic stirrers, water baths and shaking incubators, drying ovens and muffle furnaces, centrifuges, spectrophotometers, glassware (volumetric, borosilicate, Pyrex), pipettes and micropipettes, filtration assemblies, and lab safety equipment (fume hoods, eye-wash stations, lab coats, PPE). Calibration certificates, traceable reference standards, and after-sales technical support available for all instruments."
          },
          'agro': {
            heading: 'Agricultural Chemicals & Fertilisers Supplier in Oman',
            body: "Global Chemicals LLC supplies agricultural chemicals, fertilisers, and crop-protection raw materials to farming operations, greenhouse growers, landscaping contractors, and date-palm cultivators across Oman. Our agro portfolio covers water-soluble NPK fertilisers (suitable for fertigation and drip-irrigation), urea and ammonium sulphate, potassium nitrate and potassium sulphate, micronutrient chelates (Fe, Zn, Mn, Cu, B, Mo), soil conditioners and humic-acid products, and substrate disinfectants. Oman's saline and calcareous soils require careful nutrient selection — our technical team advises on irrigation-water salinity tolerance, optimum fertigation programmes for tomato, cucumber, and capsicum greenhouse crops, and date-palm fertilisation schedules adapted to Oman's climate."
          },
        };
        const intro = categoryIntros[activeCategory];
        if (!intro) return null;
        return (
          <section className="py-10 border-b bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{intro.heading}</h2>
                <p className="text-muted-foreground leading-relaxed">{intro.body}</p>
                {intro.table && (
                  <div className="mt-8 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm min-w-[560px]">
                      <caption className="text-left text-xs text-muted-foreground p-2 caption-top font-medium">{intro.table.caption}</caption>
                      <thead>
                        <tr className="bg-muted/50">
                          {intro.table.headers.map((h) => (
                            <th key={h} className="text-start font-semibold text-foreground px-3 py-2 border-b border-border">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {intro.table.rows.map((row, i) => (
                          <tr key={i} className={i % 2 ? 'bg-muted/20' : ''}>
                            {row.map((cell, j) => (
                              <td key={j} className={`px-3 py-2 border-b border-border/50 ${j === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {intro.sections?.map((sec) => (
                  <div key={sec.heading} className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{sec.heading}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{sec.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Products Section with Sidebar */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-12 animate-fade-in-up">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('products.browseDesc')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                aria-label="Search products by name, CAS number, formula, or category"
                placeholder="Search by product name, CAS number, formula, or category..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-12 h-14 text-base shadow-lg border-2 focus:border-primary"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
            <div className="flex justify-center mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAISearchOpen(true)}
                className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary"
              >
                <Sparkles className="h-4 w-4" />
                Ask AI about our products
              </Button>
            </div>
            {searchQuery.trim() && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {` matching "${searchQuery}" across all categories`}
              </p>
            )}
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Category Navigation */}
              <aside className="lg:w-72 flex-shrink-0">
                <div className="lg:sticky lg:top-24 space-y-2">
                  <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide px-2 sm:px-3">
                    {t('products.productCategories')}
                  </h3>
                  <nav className="space-y-1 max-h-[60vh] lg:max-h-none overflow-y-auto">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isActive = activeCategory === category.id;
                      // Real <Link>s to /products/:category so crawlers can reach
                      // every category landing page and filtered views are
                      // shareable. Clearing the query keeps the destination from
                      // opening under a stale cross-category search.
                      return (
                        <Link
                          key={category.id}
                          to={categoryHref(category.id)}
                          onClick={clearSearch}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all group',
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'bg-card hover:bg-accent text-foreground border border-border hover:border-primary/50'
                          )}
                        >
                          <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0', isActive ? 'text-primary-foreground' : 'text-primary')} />
                          <span className="flex-1 text-xs sm:text-sm font-medium">{category.name}</span>
                          <ChevronRight className={cn('w-3 h-3 sm:w-4 sm:h-4 transition-transform', isActive ? 'translate-x-0' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100')} />
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground">
                      {t('products.cantFind')}{' '}
                      <LocalizedLink to="/contact" className="text-primary hover:underline font-semibold">
                        {t('common.contactUs')}
                      </LocalizedLink>{' '}
                      {t('products.contactForCustom')}
                    </p>
                  </div>
                </div>
              </aside>

              {/* Product Grid — a plain <div>, not <main>: the page already has a
                  single <main id="main-content"> landmark wrapping this section. */}
              <div className="flex-1 min-w-0">
                {isUnknownCategory ? (
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-foreground mb-3">Category not found</h2>
                    <p className="text-muted-foreground mb-6">
                      That product category doesn't exist. Browse our full catalogue instead.
                    </p>
                    <Button asChild>
                      <Link to={withLangPrefix(langPrefix, '/products')}>Browse all products</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        {searchQuery.trim()
                          ? `Search results`
                          : (categories.find((c) => c.id === activeCategory)?.name || t('products.allProducts'))}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {filteredProducts.length} {t('products.productsAvailable')} · {t('products.tapToViewDetails')}
                      </p>
                    </div>

                    {productsLoading ? (
                      <div className="text-center py-16">
                        <p className="text-muted-foreground text-lg">{t('common.loading') || 'Loading products…'}</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                          {filteredProducts.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                            />
                          ))}
                        </div>

                        {filteredProducts.length === 0 && (
                          <div className="text-center py-16">
                            <p className="text-muted-foreground text-lg">
                              {t('products.noProductsAvailable')}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs. `productsFAQs`/`categoryFAQs` were only ever fed to
          FAQStructuredData — ~320 lines of buyer-objection copy that no human
          could see, and FAQ markup is supposed to mirror visible content. */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Sourcing, documentation and delivery — answered.
            </p>
            <Accordion type="single" collapsible className="w-full">
              {visibleFAQs.map((faq, i) => (
                <AccordionItem key={i} value={`products-faq-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">Why Choose Our Chemical Products</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Leading chemical supplier in Oman & Middle East with proven track record serving oil &amp; gas, manufacturing, water treatment, and industrial sectors across Muscat, Dubai, Riyadh, Doha, and the wider GCC region.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Comprehensive Range',
                  description: `${TOTAL_PRODUCTS}+ water treatment chemicals, industrial lubricants, and specialty products from trusted global manufacturers.`,
                },
                {
                  title: 'ISO Quality Assured',
                  description:
                    'ISO 9001 certified operations. Every product meets international standards with complete technical documentation and safety data sheets.',
                },
                {
                  title: 'Expert Technical Support',
                  description:
                    '10+ years expertise in chemical supply. Our team provides product selection guidance, application support, and after-sales technical assistance.',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-card rounded-lg border border-border animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
      <AISearchDialog open={isAISearchOpen} onOpenChange={setIsAISearchOpen} />
    </div>
  );
};

export default Products;
