// Blog articles data - shared across Resources and Blog pages

export interface BlogArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  featured: boolean;
  relatedProducts?: string[];
}

export const blogArticles: BlogArticle[] = [
  {
    id: 1,
    title: "Water Treatment Chemicals in Oman & GCC: Complete Guide for 2025",
    excerpt: "A comprehensive overview of water treatment chemicals used in Oman, UAE, Saudi Arabia, Qatar, Kuwait & Bahrain desalination plants and industrial operations. Learn about PAC, calcium hypochlorite, antiscalants, and best practices for GCC water challenges.",
    content: [
      "Oman faces unique water treatment challenges due to its arid climate and reliance on desalination. With over 500 million cubic meters of desalinated water produced annually, understanding the right chemicals for water treatment is essential for industries across Muscat, Sohar, Duqm, and Salalah.",
      "**Key Water Treatment Chemicals for Oman:**\n\n• [Poly Aluminium Chloride (PAC)](/products/water-treatment/pac-liquid) - The preferred coagulant for Oman's high-turbidity water conditions. PAC works effectively across a wide pH range (6.5-9.0) and performs well in the high temperatures common in the Gulf region.\n\n• [Calcium Hypochlorite](/products/water-treatment/calcium-hypochlorite-water) - Essential for disinfection in municipal water systems. With 65-70% available chlorine, it's stable and easy to store in Oman's climate.\n\n• **Sodium Hypochlorite** - Used in automated dosing systems at treatment plants. Degrades faster in heat, so use within 60 days.\n\n• **Antiscalants** - Critical for protecting RO membranes in desalination plants. Prevents calcium and magnesium scale formation.",
      "**Dosing Guidelines for Oman Conditions:**\n\nPAC dosage typically ranges from 10-50 mg/L depending on raw water turbidity. Summer temperatures require adjusted dosing due to faster reaction kinetics. Maintain residual chlorine levels of 0.2-0.5 mg/L at distribution points to ensure water safety throughout the network.",
      "**Best Practices:**\n\n1. Conduct jar tests to determine optimal coagulant dosage\n2. Store chemicals in cool, dry areas away from direct sunlight\n3. Monitor residual aluminium to meet WHO guidelines (<0.2 mg/L)\n4. Implement automated dosing systems for consistent chemical delivery\n5. Regular membrane autopsies help optimize chemical treatment programs",
      "Global Chemicals LLC supplies a complete range of water treatment chemicals with technical support for dosing optimization. Contact our team for product recommendations specific to your facility's requirements."
    ],
    category: "Technical Guides",
    date: "2024-12-01",
    author: "Global Chemicals Technical Team",
    readTime: "8 min read",
    image: "/images/blog/water-treatment-oman.jpg",
    featured: true,
    relatedProducts: ["Poly Aluminium Chloride (PAC)", "Calcium Hypochlorite", "Sodium Hypochlorite", "Antiscalants"]
  },
  {
    id: 2,
    title: "Chemical Storage Safety in Oman & GCC Hot Climate: Essential Guidelines",
    excerpt: "Industrial chemicals require special handling in Oman, UAE & Saudi Arabia's extreme temperatures. This guide covers proper storage conditions, temperature management, and safety protocols for chemical warehouses across the GCC.",
    content: [
      "Oman's extreme temperatures, regularly exceeding 45°C in summer, pose significant challenges for chemical storage. Proper storage practices are essential to maintain product quality, ensure worker safety, and comply with regulations.",
      "**Temperature Management:**\n\n• Never store chemicals above 30°C - this significantly reduces shelf life\n• Install temperature monitoring systems in all storage areas\n• Use air-conditioned storage rooms maintaining 20-25°C for sensitive chemicals\n• Flammable solvents require explosion-proof refrigerators\n• Drum temperatures can exceed 70°C when exposed to sun - causing seal failures",
      "**Storage Best Practices:**\n\n1. **Covered, Ventilated Areas** - Protect from direct sunlight with adequate ventilation\n2. **Drum Positioning** - Store horizontally or with bungs at 3 and 9 o'clock positions\n3. **Segregation** - Keep incompatible chemicals in separate areas (oxidizers away from flammables)\n4. **FIFO Management** - First-in, first-out inventory prevents degradation\n5. **Shade Structures** - Install for outdoor storage areas",
      "**Shelf Life Guidelines in Oman:**\n\n• Mineral oils: Maximum 2 years\n• Synthetic lubricants: Maximum 3 years\n• Sodium hypochlorite: Use within 60 days\n• Laboratory reagents: Check manufacturer specifications\n• Hygroscopic chemicals: Protect with desiccators or nitrogen blanketing",
      "**Safety Equipment Requirements:**\n\n• Emergency eyewash stations (test weekly)\n• Safety showers\n• Spill containment systems\n• Fire suppression appropriate for chemical types\n• SDS accessible within 30 seconds of work area\n\nGlobal Chemicals LLC provides storage guidance and can conduct facility assessments to ensure your chemical storage meets safety standards."
    ],
    category: "Safety & Compliance",
    date: "2024-11-28",
    author: "HSE Department",
    readTime: "6 min read",
    image: "/images/blog/chemical-safety-storage.jpg",
    featured: false,
    relatedProducts: ["Safety Equipment", "Spill Containment", "Storage Solutions"]
  },
  {
    id: 3,
    title: "Global Chemicals LLC Achieves JSRS Certification Renewal for 2025-2026",
    excerpt: "We are proud to announce the renewal of our JSRS certification, reinforcing our commitment to serving Oman's oil and gas sector and the GCC region with quality chemicals and reliable GCC-wide supply.",
    content: [
      "Global Chemicals LLC is pleased to announce the successful renewal of our JSRS (Joint Supplier Registration System) certification for 2024-2025. This certification is a testament to our commitment to meeting the highest standards required by Oman's oil and gas industry.",
      "**What JSRS Certification Means:**\n\nThe Joint Supplier Registration System is a unified vendor qualification system used by major oil and gas operators in Oman, including PDO, OQ, and international contractors. JSRS certification demonstrates that a supplier meets stringent requirements for:\n\n• Quality management systems\n• Health, Safety, and Environment (HSE) compliance\n• Financial stability\n• Technical capability\n• Supply chain reliability",
      "**Our Commitment to Excellence:**\n\nThis renewal reflects Global Chemicals LLC's dedication to:\n\n1. Maintaining ISO 9001:2015 quality management standards\n2. Continuous improvement in safety practices\n3. Reliable supply chain management across Oman\n4. Technical support and expertise for oil & gas applications\n5. In-Country Value (ICV) contribution to Oman's economy",
      "**Serving Oman's Oil & Gas Sector:**\n\nWith JSRS certification, Global Chemicals LLC is qualified to supply:\n\n• Corrosion inhibitors for pipeline protection\n• Scale inhibitors for production optimization\n• Demulsifiers for oil-water separation\n• H2S scavengers for sour gas treatment\n• Drilling and completion chemicals\n• Production chemicals for enhanced recovery",
      "We thank our customers, partners, and team members who have contributed to this achievement. Global Chemicals LLC remains committed to being your trusted chemical partner in Oman's oil and gas industry."
    ],
    category: "Company News",
    date: "2024-11-20",
    author: "Global Chemicals LLC",
    readTime: "3 min read",
    image: "/images/blog/jsrs-certification.jpg",
    featured: false,
    relatedProducts: ["Corrosion Inhibitors", "Scale Inhibitors", "H2S Scavengers", "Demulsifiers"]
  },
  {
    id: 4,
    title: "Choosing the Right Lubricant for GCC Industrial Equipment (Oman, UAE, Saudi Arabia)",
    excerpt: "High temperatures and dusty conditions demand premium lubricants across the GCC. Compare Shell, Mobil, and Castrol products for hydraulic systems, gearboxes, and compressors in Oman, UAE & Saudi Arabia manufacturing and oil & gas sectors.",
    content: [
      "Industrial equipment in Oman faces extreme operating conditions - temperatures regularly exceeding 45°C, dust exposure, and demanding production schedules. Selecting the right lubricant is critical for equipment longevity and operational efficiency.",
      "**Key Selection Criteria for Oman:**\n\n• **High Viscosity Index (VI > 150)** - Maintains consistent performance across temperature ranges\n• **Oxidation Stability** - Resists breakdown in high-temperature environments\n• **Dust/Contamination Resistance** - Protects in sandy, dusty conditions\n• **Extended Drain Intervals** - Reduces maintenance frequency and downtime",
      "**Hydraulic Oils Comparison:**\n\n• **Shell Tellus S2 V** - Excellent for wide temperature applications, high VI for Oman conditions\n• **Mobil DTE 10 Excel** - Superior anti-wear protection, extended equipment life\n• **Castrol Hyspin AWS** - Good all-round performance, cost-effective option\n\nFor Oman, select ISO VG 46 or 68 grades for most applications.",
      "**Gear Oils for Industrial Gearboxes:**\n\n• **Shell Omala S4 GX** - Synthetic PAO-based, 4x longer oil life than mineral oils\n• **Mobil SHC 600 Series** - Reduces operating temperatures by 10-20°C\n• **Castrol Tribol** - Good EP protection for heavy-duty applications\n\nSynthetic gear oils offer significant advantages in Oman's hot climate.",
      "**Maintenance Best Practices:**\n\n1. Monitor oil temperature - every 10°C above 55°C halves oil life\n2. Implement oil analysis programs for predictive maintenance\n3. Maintain system cleanliness to ISO 16/14/11 or better\n4. Never mix different lubricant brands without compatibility testing\n5. Use calibrated grease guns to prevent over-lubrication\n\nGlobal Chemicals LLC is an authorized distributor for Shell, Mobil, and Castrol industrial lubricants. Contact us for technical guidance on lubricant selection."
    ],
    category: "Technical Guides",
    date: "2024-11-15",
    author: "Global Chemicals Technical Team",
    readTime: "7 min read",
    image: "/images/blog/industrial-lubricants.jpg",
    featured: false,
    relatedProducts: ["Shell Tellus Hydraulic Oils", "Mobil DTE Series", "Shell Omala Gear Oils", "Industrial Greases"]
  },
  {
    id: 5,
    title: "How GCC Industrial Zone Companies Optimize Chemical Procurement (Sohar, Dubai, Riyadh)",
    excerpt: "Case study on how manufacturing facilities in Sohar Industrial Zone, JAFZA Dubai, and Jubail Saudi Arabia reduced chemical costs by 15% through consolidated procurement, just-in-time delivery, and technical support.",
    content: [
      "Sohar Industrial Estate and SOHAR Port & Freezone host some of Oman's most significant manufacturing operations. This case study explores how companies in the zone have optimized their chemical procurement to reduce costs while improving operational efficiency.",
      "**The Challenge:**\n\nManufacturing facilities in Sohar faced several procurement challenges:\n\n• Multiple suppliers with inconsistent delivery schedules\n• High inventory carrying costs for chemicals\n• Limited technical support for chemical applications\n• Difficulty managing chemical specifications across operations\n• Long lead times affecting production planning",
      "**The Solution - Consolidated Procurement:**\n\nBy partnering with a local chemical supplier like Global Chemicals LLC, facilities achieved:\n\n1. **Single-Source Supply** - Consolidated orders across chemical categories\n2. **Just-in-Time Delivery** - Reduced inventory from 3 months to 2 weeks\n3. **Technical Support** - On-site consultation for chemical optimization\n4. **Standardized Specifications** - Consistent quality across all deliveries\n5. **Emergency Response** - 24-hour emergency supply capability",
      "**Results Achieved:**\n\n• **15% Cost Reduction** - Through volume discounts and reduced inventory\n• **30% Faster Delivery** - Local supply vs. international imports\n• **Zero Stockouts** - Reliable supply chain management\n• **Improved Safety** - Better chemical handling with supplier training\n• **Reduced Waste** - Right-sized packaging and quantities",
      "**Key Success Factors:**\n\n• Building long-term supplier relationships\n• Clear communication of requirements and specifications\n• Regular supplier performance reviews\n• Collaborative problem-solving approach\n• Leveraging supplier technical expertise\n\nGlobal Chemicals LLC serves numerous facilities in Sohar Industrial Zone. Contact us to discuss how we can optimize your chemical procurement."
    ],
    category: "Case Studies",
    date: "2024-11-10",
    author: "Business Development Team",
    readTime: "5 min read",
    image: "/images/blog/sohar-industrial.jpg",
    featured: false,
    relatedProducts: ["Industrial Chemicals", "Water Treatment Chemicals", "Lubricants"]
  },
  {
    id: 6,
    title: "Swimming Pool Chemicals: Maintaining Crystal Clear Water in GCC Summer (Oman, UAE, Qatar)",
    excerpt: "Hotels, resorts, and residential pools across the GCC — Oman, UAE, Qatar, Saudi Arabia — face unique challenges during summer. Learn proper chlorination, pH management, and algae prevention for optimal pool water quality.",
    content: [
      "Maintaining pool water quality in Oman's hot, sunny climate is challenging. High temperatures accelerate chlorine consumption, while intense UV radiation degrades sanitizers rapidly. This guide covers essential maintenance practices for hotels, resorts, and residential pools.",
      "**Essential Water Chemistry Parameters:**\n\n• **Free Chlorine**: 1-3 ppm (test twice daily in summer)\n• **pH**: 7.2-7.6 (critical for chlorine effectiveness)\n• **Total Alkalinity**: 80-120 ppm\n• **Calcium Hardness**: 200-400 ppm\n• **Cyanuric Acid**: 30-50 ppm (for outdoor pools)",
      "**Chlorination Best Practices for Oman:**\n\n1. Add chlorine in the evening to reduce UV degradation\n2. Use stabilized chlorine (with cyanuric acid) for outdoor pools\n3. Shock treat pools weekly with calcium hypochlorite at 10 ppm\n4. Chlorine consumption can triple during hottest months\n5. Maintain cyanuric acid at 30-50 ppm as a UV shield\n\n**Recommended Products:**\n• Calcium Hypochlorite 65-70% for shock treatment\n• TCCA tablets for continuous chlorination\n• Sodium hypochlorite for automated dosing",
      "**pH and Alkalinity Control:**\n\nOman's high-TDS water often causes pH to drift upward. Use:\n\n• Hydrochloric acid (muriatic acid) to lower pH\n• Sodium bisulfate (dry acid) as a safer alternative\n• Sodium bicarbonate to raise alkalinity\n\n**Important:** Never add acid and chlorine simultaneously - allow 4 hours between additions.",
      "**Algae Prevention:**\n\n• Maintain proper chlorine levels - prevention is easier than treatment\n• Use algaecide weekly as a preventive measure\n• For green algae outbreaks: shock treat at 20-30 ppm chlorine\n• Brush all pool surfaces weekly to remove algae spores\n• Run pump continuously during treatment\n\nGlobal Chemicals LLC supplies a complete range of swimming pool chemicals with technical support. Contact us for pool maintenance programs for your hotel, resort, or facility."
    ],
    category: "Technical Guides",
    date: "2024-11-05",
    author: "Global Chemicals Technical Team",
    readTime: "6 min read",
    image: "/images/blog/pool-chemicals-oman.jpg",
    featured: false,
    relatedProducts: ["Calcium Hypochlorite", "Chlorine Tablets (TCCA)", "Hydrochloric Acid", "Pool Algaecides"]
  },
  {
    id: 7,
    title: "GCC Chemical Import Regulations: Oman, UAE, Saudi Arabia, Qatar Compliance Guide",
    excerpt: "Navigate the regulatory framework for industrial chemicals across the GCC. This guide covers Ministry of Commerce requirements in Oman, UAE MOEI, Saudi SFDA, and GCC documentation needed for chemical imports and distribution.",
    content: [
      "Importing and distributing industrial chemicals in Oman requires compliance with various regulatory frameworks. Understanding these requirements ensures smooth operations and avoids costly delays or penalties.",
      "**Key Regulatory Bodies:**\n\n• **Ministry of Commerce, Industry and Investment Promotion** - Import licensing\n• **Environment Authority** - Environmental permits for hazardous chemicals\n• **Royal Oman Police** - Controlled substances permits\n• **Ministry of Health** - Food-grade and pharmaceutical chemicals\n• **Civil Defence** - Fire safety and storage approvals",
      "**Required Documentation for Chemical Imports:**\n\n1. Commercial Registration (CR) with appropriate activities\n2. Import License from Ministry of Commerce\n3. Safety Data Sheets (SDS) in English and Arabic\n4. Certificate of Analysis (CoA) for each batch\n5. Certificate of Origin\n6. Packing List with proper chemical descriptions\n7. Environmental permit for hazardous materials",
      "**Restricted and Controlled Chemicals:**\n\nSome chemicals require additional permits:\n\n• **Precursor chemicals** - Extra documentation and end-user declarations\n• **Hazardous substances** - Environment Authority permits\n• **Controlled drugs and substances** - Royal Oman Police authorization\n• **Radioactive materials** - Special licensing required",
      "**Compliance Best Practices:**\n\n1. Maintain up-to-date SDS for all chemicals\n2. Keep proper storage records and inventory\n3. Train staff on handling and emergency procedures\n4. Conduct regular internal audits\n5. Stay updated on regulatory changes\n6. Work with experienced local distributors who understand requirements\n\nGlobal Chemicals LLC handles all regulatory compliance for our products. We provide proper documentation and guidance to ensure your operations meet Oman's requirements."
    ],
    category: "Safety & Compliance",
    date: "2024-10-28",
    author: "Compliance Team",
    readTime: "8 min read",
    image: "/images/blog/regulations-compliance.jpg",
    featured: false,
    relatedProducts: []
  },
  {
    id: 8,
    title: "Extended Laboratory Chemical Range Now Available in Muscat, Oman & GCC Export",
    excerpt: "Global Chemicals LLC expands laboratory chemical inventory with AR grade reagents, HPLC solvents, and buffer solutions. Same-day delivery in Muscat. Export available to UAE, Saudi Arabia, Qatar, Kuwait and Bahrain.",
    content: [
      "Global Chemicals LLC is pleased to announce a significant expansion of our laboratory chemical inventory in Muscat. This expansion ensures faster delivery and better availability for research laboratories, quality control departments, and educational institutions across Oman.",
      "**New Product Categories Available:**\n\n**AR Grade Reagents:**\n• Hydrochloric Acid AR\n• Sulfuric Acid AR\n• Nitric Acid AR\n• Sodium Hydroxide AR\n• Potassium Hydroxide AR\n• Ammonia Solution AR\n\n**HPLC Solvents:**\n• Acetonitrile HPLC Grade\n• Methanol HPLC Grade\n• Water HPLC Grade\n• Hexane HPLC Grade\n• LC-MS Grade Solvents",
      "**Buffer Solutions and Standards:**\n• pH Buffer Solutions (pH 4, 7, 10)\n• Conductivity Standards\n• Volumetric Solutions\n• Reference Standards (select items)\n\n**Lab Consumables:**\n• Filter Papers\n• Syringes and Filters\n• Sample Vials\n• Pipette Tips",
      "**Same-Day Delivery in Muscat:**\n\nFor urgent requirements, we now offer same-day delivery within Muscat for orders placed before 11:00 AM. This service supports:\n\n• Research laboratories with time-sensitive experiments\n• QC departments facing production deadlines\n• Educational institutions with practical classes\n• Hospitals and clinical laboratories",
      "**Quality Assurance:**\n\nAll laboratory chemicals come with:\n• Certificate of Analysis (CoA)\n• Lot-specific purity documentation\n• Proper labeling and packaging\n• MSDS/SDS documentation\n\nContact our laboratory chemicals team for quotes and availability. We source from ISO 17034 accredited manufacturers for certified reference materials."
    ],
    category: "Product Updates",
    date: "2024-10-20",
    author: "Global Chemicals LLC",
    readTime: "4 min read",
    image: "/images/blog/laboratory-chemicals.jpg",
    featured: false,
    relatedProducts: ["AR Grade Chemicals", "HPLC Solvents", "pH Buffer Solutions", "Laboratory Reagents"]
  },
  {
    id: 9,
    title: "Corrosion Inhibitors for GCC Oil & Gas Operations (Oman, Saudi Arabia, UAE): Selection Guide",
    excerpt: "High H2S content and elevated temperatures make corrosion control critical in GCC oilfields. Compare film-forming inhibitors for Oman PDO/OQ, Saudi Aramco, ADNOC UAE operations and monitoring best practices.",
    content: [
      "Corrosion is the leading cause of pipeline failures and equipment degradation in Oman's oil and gas operations. Many fields produce sour gas with high H2S content, combined with elevated temperatures and challenging water chemistry, making effective corrosion control essential.",
      "**Understanding Corrosion in Oman Operations:**\n\n• **CO2 Corrosion** - Forms carbonic acid in presence of water\n• **H2S Corrosion** - Creates sulfide stress cracking and pitting\n• **Organic Acid Corrosion** - From formation fluids\n• **Microbiologically Influenced Corrosion (MIC)** - In stagnant systems\n\nOman's high H2S fields require specialized treatment programs combining corrosion inhibitors with H2S scavenging.",
      "**Types of Corrosion Inhibitors:**\n\n**Film-Forming Inhibitors:**\n• Imidazoline-based - Excellent for high-H2S environments\n• Quaternary ammonium compounds - Good general protection\n• Phosphate esters - Effective in mixed CO2/H2S systems\n\n**Application Methods:**\n• Continuous injection - Standard for wet gas and high-water-cut systems\n• Batch treatments - Suitable for low-water producers\n• Squeeze treatments - For downhole protection",
      "**Selection Criteria for Oman Conditions:**\n\n1. H2S concentration in produced fluids\n2. Operating temperature range\n3. Water cut and water chemistry\n4. Flow regime (turbulent vs. laminar)\n5. Compatibility with other production chemicals\n6. Environmental and HSE requirements",
      "**Monitoring and Optimization:**\n\n• **Target corrosion rates:** Below 0.1 mm/year for carbon steel\n• **Inhibitor residuals:** Maintain 50-200 ppm at system endpoints\n• **Monitoring methods:** Corrosion coupons, ER probes, iron counts\n• **Regular testing:** Verify inhibitor effectiveness quarterly\n\nGlobal Chemicals LLC supplies corrosion inhibitors from leading manufacturers with technical support for selection and optimization. Contact us for laboratory testing and field trial programs."
    ],
    category: "Technical Guides",
    date: "2024-10-15",
    author: "Global Chemicals Technical Team",
    readTime: "9 min read",
    image: "/images/blog/corrosion-inhibitors.jpg",
    featured: false,
    relatedProducts: ["Corrosion Inhibitors", "H2S Scavengers", "Scale Inhibitors", "Biocides"]
  },
  {
    id: 10,
    title: "Caustic Soda (Sodium Hydroxide) Supplier in Oman: Grades, Handling & Pricing Guide",
    excerpt: "Complete guide to sourcing caustic soda (NaOH) in Oman — flakes, pearls, and liquid grades, storage safety in hot climates, applications in water treatment and oil & gas, and how to get competitive bulk pricing from a Muscat-based supplier.",
    content: [
      "Caustic soda — sodium hydroxide (NaOH) — is one of the highest-volume industrial chemicals in Oman, used across water treatment, oil & gas, chemical manufacturing, food processing, and soap production. Understanding the available grades and specifications is essential for procurement teams across Muscat, Sohar, Salalah, and Duqm.",
      "**Caustic Soda Grades in Oman:**\n\n• [Caustic Soda Flakes (98–99% NaOH)](/products/water-treatment/caustic-soda-flakes) — White solid, dissolves readily, suitable for batch operations and smaller facilities. Most common grade for industrial users.\n• **Caustic Soda Pearls (98–99% NaOH)** — Lower dust generation than flakes, preferred where dust inhalation is a concern (food processing, pharmaceuticals).\n• [Caustic Soda Liquid (45–50% NaOH)](/products/water-treatment/caustic-soda-liquid) — Most convenient for continuous dosing systems. Pumped directly via chemical dosing equipment. Standard for water treatment plants.\n• **Food-Grade NaOH (E524)** — Tighter heavy metal limits (Pb, Hg, As). Required for food, beverage, and pharmaceutical applications.",
      "**Main Applications in Oman:**\n\n• **Water Treatment:** pH correction of RO permeate (desalinated water is typically pH 6.5–7.0; caustic raises it to 7.5–8.0 for corrosion protection in distribution networks). Also used for membrane cleaning in RO plants.\n• **Oil & Gas:** Produced water pH adjustment, desalting at refinery crude units, scale and corrosion control.\n• **Chemical Manufacturing:** Feedstock for sodium hypochlorite production, sodium phosphates, and various cleaning products.\n• **Sohar Aluminium:** Large-scale Bayer Process use for bauxite refining to alumina.",
      "**Storage Requirements in Oman's Climate:**\n\n• Store liquid caustic (50%) above 12°C — it freezes below this temperature, requiring insulated or heated storage in cooler interior locations.\n• Store in HDPE or mild steel tanks only — never aluminium, zinc, or tin (NaOH dissolves these metals, generating hydrogen gas).\n• Protect from CO2 absorption by keeping containers sealed — forms sodium carbonate if exposed to air.\n• In summer, shade liquid storage tanks to prevent thermal expansion and pressure buildup.\n• Flakes and pearls are hygroscopic — store in sealed bags in a dry area and use within 12 months.",
      "**Safety Handling (Corrosive — GHS Category 1):**\n\nMandatory PPE: neoprene or butyl rubber gloves (nitrile is insufficient for concentrated NaOH), full-face shield, chemical-resistant apron, and safety boots. Emergency eyewash and safety shower must be within 10 seconds of work area. SDS must be accessible within 30 seconds.",
      "Global Chemicals LLC supplies caustic soda flakes, pearls, and liquid solution (45–50%) to industrial customers across Oman with same-day or next-day delivery in Muscat. We also export to UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain with full documentation (CoA, SDS, Certificate of Origin). Contact us at info@gcoman.com or +968 9277 2305 for pricing and availability."
    ],
    category: "Technical Guides",
    date: "2026-03-15",
    author: "Global Chemicals Technical Team",
    readTime: "8 min read",
    image: "/images/blog/caustic-soda-oman.jpg",
    featured: false,
    relatedProducts: ["Caustic Soda Flakes", "Caustic Soda Liquid", "Sodium Hydroxide", "NaOH"]
  },
  {
    id: 11,
    title: "PAC (Poly Aluminium Chloride) in Oman: Liquid vs Powder, Dosing & Supplier Guide",
    excerpt: "Everything you need to know about sourcing PAC in Oman — basicity specifications, liquid vs powder grades, optimal dosing rates for Muscat water conditions, and why PAC outperforms alum for Oman's water treatment applications.",
    content: [
      "Poly Aluminium Chloride (PAC, CAS 1327-41-9) is the dominant coagulant used in water treatment across Oman — from municipal treatment plants and desalination facilities to industrial effluent systems, swimming pools, and hotel water treatment. If you are procuring PAC for a facility in Muscat, Sohar, Salalah, or Duqm, this guide covers everything you need to specify the right product and get optimal treatment performance.",
      "**Understanding PAC Grades:**\n\n• [Liquid PAC (10–12% Al2O3)](/products/water-treatment/pac-liquid) — Standard for dosing pump systems. Supplied in 25L jerricans, 200L drums, or 1,000L IBCs. Most cost-effective for high-volume continuous dosing.\n• [Powder PAC (28–31% Al2O3)](/products/water-treatment/pac-powder) — Used where liquid delivery is impractical or storage space is limited. Requires dissolution before dosing.\n• **High Basicity PAC (70–83%)** — Forms floc faster and works better at lower turbidity. Optimal for Oman's desalinated water supply (low turbidity, near-neutral pH 7.5–8.5).\n• **Low Basicity PAC (10–40%)** — More acidic; better for high-organic-content water (coloured surface water).",
      "**PAC vs Alum for Oman Water Conditions:**\n\nFor most Oman applications, PAC outperforms traditional aluminium sulphate (alum):\n\n| Factor | PAC | Alum |\n|--------|-----|------|\n| Effective pH range | 5.5–9.0 | 6.5–7.5 |\n| Sludge volume | 20–40% less | Higher |\n| Performance at high pH | Excellent | Poor above 7.5 |\n| Temperature sensitivity | Low | High |\n| Reaction speed | Fast | Slower |\n\nOman's desalinated supply (pH 7.5–8.5) is outside alum's effective range — PAC is the correct choice.",
      "**Typical Dosing Rates for Oman:**\n\n• Muscat desalinated supply (low turbidity): **5–15 mg/L** liquid PAC as product\n• Groundwater sources (up to 200 NTU turbidity): **20–50 mg/L**\n• Swimming pool water polishing: **5–10 mg/L**\n• Industrial effluent (SS > 500 mg/L): **50–200 mg/L** plus polymer flocculant\n\nAlways confirm dose rates with a jar test using your actual source water. Target residual aluminium < 0.2 mg/L (WHO drinking water guideline).",
      "**Storage in Oman's Climate:**\n\nLiquid PAC (pH 3.5–5.0, corrosive) must be stored in HDPE or FRP tanks — never plain mild steel or concrete. Storage above 40°C is acceptable short-term, but avoid prolonged exposure above 50°C. Keep containers sealed to prevent CO2 absorption. Powder PAC is hygroscopic — store in sealed bags in a cool, dry warehouse and use within 12 months of manufacture date.",
      "Global Chemicals LLC is a major PAC supplier in Oman, stocking both liquid PAC (10–12% Al2O3) and powder PAC (28–31% Al2O3) at our Muscat warehouse for same-day or next-day delivery. We supply to all Oman regions and export to all GCC countries with full documentation. Contact us at info@gcoman.com or +968 9277 2305 for competitive bulk pricing."
    ],
    category: "Technical Guides",
    date: "2026-03-20",
    author: "Global Chemicals Technical Team",
    readTime: "9 min read",
    image: "/images/blog/pac-oman.jpg",
    featured: false,
    relatedProducts: ["Poly Aluminium Chloride (PAC)", "PAC Liquid", "PAC Powder", "Coagulants"]
  },
  {
    id: 12,
    title: "JSRS-Certified Chemical Supplier for PDO & Oil and Gas Contractors in Oman",
    excerpt: "Everything PDO contractors, OQ operators, and oil and gas companies in Oman need to know about sourcing chemicals from a JSRS-registered, ISO 9001-certified supplier. Covers JSRS registration, ICV compliance, vendor qualification, and our oilfield chemical portfolio.",
    content: [
      "Oman's oil and gas sector requires chemical suppliers to meet JSRS (Joint Supplier Registration System) pre-qualification before any supply agreement can be established. Global Chemicals LLC is a JSRS-registered, ISO 9001:2015 certified, and ICV-compliant chemical supplier covering industrial chemicals, water treatment chemicals, oilfield chemicals, and laboratory reagents.",
      "**What Is JSRS?**\n\nJSRS is Oman's mandatory supplier pre-qualification database jointly operated by PDO and the Ministry of Energy and Minerals. A single JSRS registration opens doors to PDO, OQ, OPAL, BP Oman, TotalEnergies Oman, and other buying companies simultaneously. It requires: ISO 9001:2015 certification, financial stability, technical capability, HSE track record, and ICV compliance.",
      "**Our Oil and Gas Chemical Portfolio:**\n\n• Production chemicals: corrosion inhibitors, scale inhibitors, demulsifiers, H2S scavengers, oxygen scavengers, biocides\n• Drilling chemicals: bentonite, CMC, potassium chloride, calcium chloride, boric acid\n• Water treatment: PAC, antiscalants, biocides, caustic soda\n• Lubricants: Shell, Mobil, Castrol industrial grades\n• Lab chemicals: AR grade reagents for refinery QC labs",
      "Contact sales@gcoman.com with your company name, PDO/OQ contract reference, chemical name, and quantity. We respond within 2–4 working hours for oil and gas sector enquiries."
    ],
    category: "Technical Guides",
    date: "2026-03-25",
    author: "Global Chemicals Technical Team",
    readTime: "9 min read",
    image: "/images/blog/jsrs-pdo-oman.jpg",
    featured: true,
    relatedProducts: ["Corrosion Inhibitors", "Scale Inhibitors", "Demulsifiers", "H2S Scavengers", "Drilling Chemicals"]
  },
  {
    id: 13,
    title: "Swimming Pool Chemicals in Oman: Complete Guide for Hotels, Villas & Facilities",
    excerpt: "How to manage pool chemistry in Oman's extreme climate (45°C summer, intense UV). Covers calcium hypochlorite, TCCA tablets, sodium hypochlorite, algaecide, and pH management for hotels, villas, and facilities in Muscat, Sohar, Salalah, and GCC.",
    content: [
      "Pool maintenance in Oman requires significantly higher chemical attention than in temperate climates. At 35–45°C water temperature, chlorine dissipates 2–3 times faster. High UV intensity and dust contamination from shamal winds further accelerate chemical consumption. This guide covers the essential pool chemicals for Oman's conditions.",
      "**Key Pool Chemicals:**\n\n• [Calcium Hypochlorite (65–70% available Cl)](/products/swimming-pool/calcium-hypochlorite-granules) — Standard granular disinfectant. 20–30g per 10,000L per day for maintenance; 80–100g per 10,000L for shock treatment.\n• [TCCA Tablets (90% available Cl)](/products/swimming-pool/tcca-tablet-pool) — Stabilised chlorine for Oman's high-UV climate. Contains cyanuric acid (CYA) that dramatically slows UV-related chlorine degradation. Monitor CYA — target 30–50 mg/L.\n• **Sodium Hypochlorite (10–12%)** — For automated dosing systems. Store in shade and use within 30–45 days in Oman's heat.\n• **Algaecide** — Weekly preventive dose of 10–15 mL per 10,000L essential in summer.\n• **pH Reducer (sodium bisulphate)** — Oman municipal water pH 7.8–8.2 means most pools need regular pH reduction to target 7.2–7.6.",
      "Global Chemicals LLC supplies the complete pool chemical range to hotels, villa complexes, schools, and facilities across Oman with same-day delivery in Muscat. Contact info@gcoman.com for pricing."
    ],
    category: "Technical Guides",
    date: "2026-04-10",
    author: "Global Chemicals Technical Team",
    readTime: "11 min read",
    image: "/images/blog/pool-chemicals-oman.jpg",
    featured: false,
    relatedProducts: ["Calcium Hypochlorite", "TCCA Tablets", "Sodium Hypochlorite", "Algaecide", "pH Reducer"]
  },
  {
    id: 14,
    title: "RO Membrane Chemicals for Oman: Antiscalants, Cleaners & Passivation Guide",
    excerpt: "Essential guide to reverse osmosis membrane chemicals for Oman's SWRO and BWRO systems. Covers antiscalant selection for silica-rich groundwater, CIP cleaners, passivation agents, and dosing for Oman's specific water chemistry.",
    content: [
      "Oman has one of the world's highest concentrations of RO infrastructure per capita — coastal SWRO plants supply most municipal water, while industrial BWRO systems serve manufacturing, oil and gas, hotels, and food processing. The right membrane chemicals are critical for protecting this investment.",
      "**Key RO Chemicals:**\n\n• [Antiscalants](/products/ro-chemicals/antiscalant-ro) — For SWRO: phosphonate-based at 3–5 mg/L. For BWRO with high silica (common in Oman interior groundwater at 30–60 mg/L): silica-specific polyacrylate antiscalants at 4–8 mg/L. Monitor silica saturation index carefully.\n• [Acid CIP cleaner](/products/ro-chemicals/citric-acid-liquid-ro) — Citric acid 2–3% w/w at pH 3.0–4.0. Removes CaCO3 and iron oxide scale. Maximum 45°C for polyamide TFC membranes.\n• **Alkaline CIP cleaner** — 0.1% NaOH + 0.025% SDS surfactant at pH 11.5–12.0. Removes organic fouling and biofilm.\n• **Sodium bisulphite** — For membrane passivation on new installations and dechlorination of RO feed water.\n• **Descalers** — EDTA-citric blends for emergency scale removal after antiscalant upset.",
      "Global Chemicals LLC stocks all RO membrane chemicals for same-day delivery in Muscat. Full technical support for dosing optimisation available. Contact info@gcoman.com."
    ],
    category: "Technical Guides",
    date: "2026-04-03",
    author: "Global Chemicals Technical Team",
    readTime: "11 min read",
    image: "/images/blog/ro-chemicals-oman.jpg",
    featured: false,
    relatedProducts: ["Antiscalant", "Membrane Cleaner", "Sodium Bisulphite", "Citric Acid", "RO Chemicals"]
  }
];

export const articleCategories = [
  "All",
  "Industry News",
  "Product Updates",
  "Technical Guides",
  "Case Studies",
  "Safety & Compliance",
  "Company News",
];
