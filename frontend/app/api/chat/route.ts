import { NextResponse } from 'next/server'

// ─── Farming Knowledge Base ─────────────────────────────────────────────────
// Comprehensive AI-style farming assistant using keyword matching + context

type KnowledgeEntry = {
  keywords: string[]
  answer: string
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [

  // ── Crops ──
  { keywords: ["wheat", "gehu", "गेहूं"],
    answer: "🌾 **Wheat (गेहूं)**\n\n• **Season:** Rabi (Oct–Nov sowing, Mar–Apr harvest)\n• **Soil:** Well-drained loamy soil, pH 6–7.5\n• **Water:** 4–6 irrigations needed\n• **Temperature:** 15–25°C ideal\n• **Fertilizer:** DAP at sowing + Urea in 2 splits\n• **Best States:** Punjab, Haryana, UP, MP, Rajasthan\n• **Yield:** 40–50 quintals/hectare with good management" },

  { keywords: ["rice", "paddy", "chawal", "dhan", "चावल", "धान"],
    answer: "🌾 **Rice (धान)**\n\n• **Season:** Kharif (June–July sowing, Oct–Nov harvest)\n• **Soil:** Clayey or loamy soil that retains water\n• **Water:** Standing water 5cm during growth, drain before harvest\n• **Temperature:** 20–37°C\n• **Fertilizer:** NPK (120:60:40 kg/ha)\n• **Best States:** West Bengal, UP, Punjab, Tamil Nadu, AP\n• **Tip:** SRI method gives 30% more yield with less water" },

  { keywords: ["sugarcane", "ganna", "गन्ना"],
    answer: "🌿 **Sugarcane (गन्ना)**\n\n• **Season:** Plant Feb–Mar, harvest after 10–12 months\n• **Soil:** Deep loamy soil, good drainage\n• **Water:** Heavy water requirement, 8–10 irrigations\n• **Temperature:** 25–35°C\n• **Spacing:** Row-to-row 90cm, plant-to-plant 30cm\n• **Best States:** UP, Maharashtra, Karnataka, Tamil Nadu\n• **Tip:** Trench planting method increases yield by 20%" },

  { keywords: ["cotton", "kapas", "कपास"],
    answer: "🌿 **Cotton (कपास)**\n\n• **Season:** Kharif (April–May sowing)\n• **Soil:** Black soil (regur) is ideal\n• **Water:** Moderate, avoid waterlogging\n• **Temperature:** 21–35°C\n• **Fertilizer:** NPK 120:60:60 kg/ha\n• **Pest Alert:** Bollworm is major threat, use Bt cotton varieties\n• **Best States:** Gujarat, Maharashtra, Telangana, MP" },

  { keywords: ["tomato", "tamatar", "टमाटर"],
    answer: "🍅 **Tomato (टमाटर)**\n\n• **Season:** Year-round in polyhouse; Oct–Nov & Jan–Feb outdoor\n• **Soil:** Sandy loam, pH 6–7\n• **Spacing:** 60×45 cm\n• **Water:** Drip irrigation recommended, avoid overhead watering\n• **Fertilizer:** FYM 25 tonnes/ha + NPK\n• **Diseases:** Early blight, late blight – spray Mancozeb\n• **Yield:** 25–30 tonnes/hectare" },

  { keywords: ["potato", "aloo", "आलू"],
    answer: "🥔 **Potato (आलू)**\n\n• **Season:** Rabi (Oct–Nov sowing)\n• **Soil:** Sandy loam, well-drained\n• **Temperature:** 15–25°C ideal\n• **Seed Rate:** 25–30 quintals/hectare\n• **Fertilizer:** NPK 180:80:100 kg/ha\n• **Irrigation:** Light, frequent watering\n• **Best States:** UP, West Bengal, Bihar, Punjab\n• **Yield:** 200–300 quintals/hectare" },

  { keywords: ["onion", "pyaj", "pyaaz", "प्याज"],
    answer: "🧅 **Onion (प्याज)**\n\n• **Season:** Kharif (June–July), Rabi (Nov–Dec)\n• **Soil:** Sandy loam to loam, pH 6–7\n• **Spacing:** 15×10 cm\n• **Water:** Light irrigation every 7–10 days\n• **Fertilizer:** NPK 100:50:50 kg/ha\n• **Storage:** Cure for 10–15 days before storing\n• **Best States:** Maharashtra, Karnataka, MP, Rajasthan" },

  { keywords: ["soybean", "soyabean", "सोयाबीन"],
    answer: "🌱 **Soybean (सोयाबीन)**\n\n• **Season:** Kharif (June–July sowing)\n• **Soil:** Well-drained loamy soil\n• **Seed Rate:** 65–75 kg/hectare\n• **Fertilizer:** NPK 20:80:20 kg/ha\n• **Best States:** MP (largest producer), Maharashtra, Rajasthan\n• **Tip:** Treat seeds with Rhizobium culture before sowing\n• **Yield:** 20–25 quintals/hectare" },

  { keywords: ["maize", "corn", "makka", "makki", "मक्का"],
    answer: "🌽 **Maize (मक्का)**\n\n• **Season:** Kharif (June–July) & Rabi (Oct–Nov)\n• **Soil:** Well-drained loamy soil\n• **Temperature:** 21–30°C\n• **Spacing:** 60×20 cm\n• **Fertilizer:** NPK 120:60:40 kg/ha\n• **Water:** Critical at tasseling & silking stage\n• **Best States:** Karnataka, MP, Bihar, Rajasthan, UP" },

  { keywords: ["bajra", "millet", "pearl millet", "बाजरा"],
    answer: "🌾 **Bajra (Pearl Millet / बाजरा)**\n\n• **Season:** Kharif (June–July)\n• **Soil:** Sandy to sandy loam, drought-tolerant\n• **Water:** Very low requirement, rainfed crop\n• **Temperature:** 25–35°C\n• **Seed Rate:** 4–5 kg/hectare\n• **Best States:** Rajasthan, Gujarat, Haryana, UP\n• **Tip:** Excellent crop for dryland farming" },

  { keywords: ["groundnut", "mungfali", "moongfali", "मूंगफली"],
    answer: "🥜 **Groundnut (मूंगफली)**\n\n• **Season:** Kharif (June–July)\n• **Soil:** Sandy loam, well-drained\n• **Seed Rate:** 100–120 kg/hectare\n• **Fertilizer:** NPK 25:50:25 + Gypsum 500kg/ha\n• **Water:** Critical at pegging & pod development\n• **Best States:** Gujarat, Rajasthan, AP, Tamil Nadu\n• **Yield:** 15–20 quintals/hectare" },

  { keywords: ["mustard", "sarson", "सरसों"],
    answer: "🌼 **Mustard (सरसों)**\n\n• **Season:** Rabi (Oct–Nov sowing)\n• **Soil:** Loamy to sandy loam\n• **Temperature:** 15–25°C\n• **Water:** 2–3 irrigations at branching, flowering, pod filling\n• **Seed Rate:** 5–6 kg/hectare\n• **Best States:** Rajasthan, MP, UP, Haryana\n• **Yield:** 15–20 quintals/hectare" },

  { keywords: ["tea", "chai", "चाय"],
    answer: "🍵 **Tea (चाय)**\n\n• **Region:** Hills with 150–300cm rainfall\n• **Soil:** Deep, well-drained acidic soil (pH 4.5–5.5)\n• **Temperature:** 20–30°C\n• **Altitude:** 600–2000m above sea level\n• **Pruning:** Regular pruning essential\n• **Best States:** Assam, West Bengal (Darjeeling), Kerala, Tamil Nadu\n• **Note:** Takes 3–5 years for first harvest" },

  { keywords: ["coffee", "कॉफ़ी"],
    answer: "☕ **Coffee (कॉफ़ी)**\n\n• **Types:** Arabica (high altitude), Robusta (low altitude)\n• **Soil:** Rich, volcanic, well-drained, pH 6–6.5\n• **Shade:** Needs shade trees (Silver Oak, Dadap)\n• **Rainfall:** 150–200cm well-distributed\n• **Best States:** Karnataka (Coorg), Kerala, Tamil Nadu\n• **India Rank:** 6th largest producer globally" },

  // ── Soil ──
  { keywords: ["soil", "mitti", "मिट्टी", "soil type", "soil test"],
    answer: "🌍 **Soil Types in India**\n\n1. **Alluvial Soil** – Most fertile, found in Indo-Gangetic plains. Best for wheat, rice, sugarcane\n2. **Black Soil (Regur)** – Maharashtra, Gujarat, MP. Best for cotton\n3. **Red Soil** – Tamil Nadu, Karnataka, Jharkhand. Good for millets, groundnut\n4. **Laterite Soil** – Kerala, Karnataka coast. Good for tea, coffee, cashew\n5. **Desert/Sandy Soil** – Rajasthan. Good for bajra, guar, dates\n6. **Mountain Soil** – Himalayan region. Good for tea, fruits\n\n**Tip:** Get soil tested at nearest Krishi Vigyan Kendra (KVK) – it's free or very cheap!" },

  { keywords: ["soil test", "soil testing", "mitti jaanch"],
    answer: "🔬 **Soil Testing Guide**\n\n**Why Test?** Saves money on fertilizers, improves yield\n\n**How to collect sample:**\n1. Take soil from 15cm depth using V-shape cut\n2. Collect from 8–10 spots in field\n3. Mix all, take 500g as final sample\n4. Air dry (don't sun dry)\n\n**Where to test:**\n• Krishi Vigyan Kendra (KVK) – Free!\n• State agriculture university labs\n• Soil Health Card centers\n\n**Tests done:** pH, NPK, organic carbon, micronutrients\n\n**Tip:** Test every 2–3 years before Rabi season" },

  // ── Irrigation ──
  { keywords: ["irrigation", "sinchai", "water", "paani", "सिंचाई", "पानी"],
    answer: "💧 **Irrigation Methods**\n\n1. **Drip Irrigation** – 90% efficiency, best for vegetables, fruits. Saves 40–60% water\n2. **Sprinkler** – 75% efficiency, good for wheat, pulses\n3. **Flood/Surface** – Traditional, 30–40% efficiency\n4. **Furrow** – For row crops like sugarcane\n\n**Government Subsidies:**\n• PMKSY – Up to 55% subsidy on drip/sprinkler\n• Apply through agriculture department\n\n**Water Saving Tips:**\n• Mulching reduces water need by 25–30%\n• Irrigate early morning or evening\n• Use soil moisture sensors for precise irrigation" },

  // ── Fertilizer ──
  { keywords: ["fertilizer", "khad", "urea", "dap", "npk", "उर्वरक", "खाद"],
    answer: "🧪 **Fertilizer Guide**\n\n**Common Fertilizers:**\n• **Urea** – 46% Nitrogen, for leaf growth\n• **DAP** – 18% N + 46% P, for root development\n• **MOP** – 60% Potash, for fruit/grain quality\n• **NPK Complex** – Balanced nutrition\n\n**Organic Options:**\n• **FYM** – 10–15 tonnes/hectare\n• **Vermicompost** – 5 tonnes/hectare\n• **Neem Cake** – Pest repellent + fertilizer\n\n**Tips:**\n• Always apply based on Soil Health Card\n• Don't mix Urea with DAP\n• Apply Urea in 2–3 splits, not all at once\n• Government gives subsidy on fertilizers" },

  // ── Pest & Disease ──
  { keywords: ["pest", "keeda", "keet", "disease", "rog", "bimari", "कीट", "रोग", "blight", "wilt"],
    answer: "🐛 **Common Crop Pests & Solutions**\n\n**Major Pests:**\n• **Bollworm (Cotton)** – Use Bt cotton, Trichogramma cards\n• **Stem Borer (Rice)** – Light traps, Carbofuran granules\n• **Aphids (Mustard)** – Neem oil spray, Imidacloprid\n• **White Fly (Cotton)** – Yellow sticky traps, Neem oil\n\n**Common Diseases:**\n• **Blight** – Mancozeb/Copper spray\n• **Wilt** – Seed treatment with Trichoderma\n• **Rust** – Propiconazole spray\n• **Powdery Mildew** – Sulfur dust/spray\n\n**IPM Tips:**\n• Use crop rotation\n• Install pheromone traps\n• Spray Neem oil (5ml/L) weekly as preventive\n• Consult KVK for free advice" },

  // ── Weather ──
  { keywords: ["weather", "mausam", "rain", "barish", "monsoon", "मौसम", "बारिश"],
    answer: "🌤️ **Weather & Farming Tips**\n\n**Kharif (Monsoon – June to Oct):**\n• Sow rice, maize, soybean, cotton, bajra\n• Prepare drainage channels\n• Watch for excess rain damage\n\n**Rabi (Winter – Oct to Mar):**\n• Sow wheat, mustard, gram, potato\n• 2–3 irrigations needed\n• Frost protection in Jan\n\n**Zaid (Summer – Mar to June):**\n• Short-season crops: moong, watermelon, cucumber\n• Heavy irrigation needed\n\n**Tips:**\n• Follow IMD weather forecast daily\n• Install rain gauge in field\n• Crop insurance under PMFBY protects against weather losses" },

  // ── Government Schemes ──
  { keywords: ["scheme", "yojana", "subsidy", "government", "sarkari", "योजना", "सब्सिडी", "pm", "pradhan mantri"],
    answer: "🏛️ **Farmer Government Schemes**\n\n1. **PM-KISAN** – ₹6,000/year in 3 installments to all farmers\n2. **PMFBY** – Crop Insurance at just 2% premium (Kharif), 1.5% (Rabi)\n3. **PMKSY** – Subsidy on drip/sprinkler irrigation (55% for small farmers)\n4. **Kisan Credit Card** – Loan at 4% interest (with timely repayment)\n5. **Soil Health Card** – Free soil testing\n6. **e-NAM** – Online national market for selling produce\n7. **PM Kisan Samman Nidhi** – Direct benefit transfer\n\n**How to Apply:**\n• Visit nearest CSC (Common Service Center)\n• Or apply online at respective portals\n• Carry Aadhaar, bank details, land papers" },

  // ── Organic Farming ──
  { keywords: ["organic", "jaivik", "natural farming", "जैविक"],
    answer: "🌿 **Organic Farming Guide**\n\n**Key Practices:**\n• Use FYM, vermicompost, green manure instead of chemicals\n• Neem-based pest control\n• Crop rotation & intercropping\n• Mulching to conserve moisture\n\n**Organic Inputs:**\n• **Jeevamrut** – Natural growth promoter (cow dung + urine + gram flour + jaggery)\n• **Panchagavya** – Foliar spray for growth\n• **Trichoderma** – Bio-fungicide\n• **Pseudomonas** – Bio-pesticide\n\n**Certification:**\n• 3-year conversion period\n• PGS (Participatory Guarantee System) – cheaper\n• NPOP certification for export\n\n**Premium:** Organic produce sells at 20–50% higher price!" },

  // ── Crop Rotation ──
  { keywords: ["crop rotation", "fasal chakra", "rotation", "intercrop"],
    answer: "🔄 **Crop Rotation Benefits & Plans**\n\n**Why Rotate?**\n• Breaks pest/disease cycle\n• Improves soil fertility naturally\n• Reduces fertilizer cost\n\n**Recommended Rotations:**\n• Rice → Wheat → Moong (classic)\n• Cotton → Wheat → Fodder\n• Soybean → Wheat (MP/Rajasthan)\n• Maize → Potato → Onion\n• Sugarcane → Wheat → Rice (3-year)\n\n**Intercropping Ideas:**\n• Sugarcane + Moong/Urad\n• Maize + Soybean\n• Cotton + Groundnut\n\n**Tip:** Always follow legume after cereal to fix nitrogen naturally" },

  // ── Seed ──
  { keywords: ["seed", "beej", "बीज", "seed treatment", "variety"],
    answer: "🌱 **Seed Management**\n\n**Seed Treatment (MUST DO!):**\n• **Thiram/Captan** – 2–3g per kg seed (fungal protection)\n• **Trichoderma** – 10g/kg (organic option)\n• **Rhizobium** – For pulses/soybean (nitrogen fixation)\n\n**Seed Rate (per hectare):**\n• Wheat: 100–125 kg\n• Rice: 20–25 kg (transplanting), 80–100 kg (direct)\n• Maize: 20–25 kg\n• Soybean: 65–75 kg\n\n**Where to Buy Quality Seeds:**\n• State seed corporation\n• KVK demonstrations\n• NSC (National Seeds Corporation)\n\n**Tip:** Always buy certified seeds, check germination % on bag" },

  // ── KhetMitra App ──
  { keywords: ["khetmitra", "app", "how to use", "features", "kya hai"],
    answer: "🌾 **KhetMitra Features**\n\n1. **Dashboard** – Real-time soil moisture, temperature, humidity from ESP32 sensors\n2. **Farm Sensors** – Detailed sensor readings with smart alerts\n3. **AI Crop Recommendation** – Click on map to get region-specific crop advice\n4. **Smart Irrigation Alerts** – Automatic warnings when soil is too dry/wet\n5. **Backend Monitor** – Technical view of raw sensor data\n\n**How to use:**\n• Login with your credentials\n• Connect ESP32 sensor via WiFi or USB\n• Dashboard shows live farm conditions\n• Click map to get crop recommendations for your area\n\n**Tip:** Keep ESP32 running 24/7 for continuous monitoring!" },

  // ── Moisture / Sensor ──
  { keywords: ["moisture", "nami", "sensor", "esp32", "iot", "नमी"],
    answer: "💧 **Soil Moisture Guide**\n\n**Optimal Ranges:**\n• **45–75%** – Ideal for most crops\n• **Below 30%** – Critical! Irrigate immediately\n• **Above 80%** – Over-watered, stop irrigation\n\n**Sensor Types:**\n• **Capacitive** – More accurate, longer life (recommended)\n• **Resistive** – Cheaper but corrodes faster\n\n**ESP32 Setup:**\n• Connect soil moisture sensor to analog pin\n• DHT11 for temperature & humidity\n• Data sent every 15 seconds to KhetMitra\n\n**Tip:** Place sensor 15cm deep at root zone for best readings" },

  // ── Temperature ──
  { keywords: ["temperature", "tapman", "garmi", "sardi", "heat", "cold", "frost", "तापमान"],
    answer: "🌡️ **Temperature & Crops**\n\n**Ideal Ranges:**\n• Rice: 20–37°C\n• Wheat: 15–25°C\n• Cotton: 21–35°C\n• Tomato: 20–30°C\n\n**Heat Stress (>38°C):**\n• Increase irrigation frequency\n• Apply mulch to cool soil\n• Use shade nets for vegetables\n• Spray 1% KCl solution\n\n**Cold/Frost (<5°C):**\n• Light irrigation night before frost\n• Smoke fires around field\n• Cover nursery with polythene\n• Avoid late sowing of Rabi crops" },

  // ── Market / Price ──
  { keywords: ["market", "mandi", "price", "sell", "msp", "bazar", "मंडी", "बाज़ार"],
    answer: "📊 **Crop Marketing Tips**\n\n**MSP (Minimum Support Price) 2024-25:**\n• Wheat: ₹2,275/quintal\n• Rice (Paddy): ₹2,300/quintal\n• Cotton: ₹7,121/quintal\n• Soybean: ₹4,892/quintal\n\n**Sell Smart:**\n• Check daily rates on **e-NAM** portal\n• Compare mandi prices across states\n• Use FPO (Farmer Producer Organization) for better rates\n• Value addition: cleaning, grading, packaging = 10–20% more\n\n**Avoid Distress Sale:**\n• Use warehouse receipt finance\n• Government godowns for storage\n• Crop diversification reduces risk" },

  // ── Greetings ──
  { keywords: ["hello", "hi", "hey", "namaste", "namaskar", "नमस्ते"],
    answer: "🙏 **Namaste! Welcome to KhetMitra AI!**\n\nI'm your farming assistant. You can ask me about:\n\n🌾 **Crops** – wheat, rice, cotton, vegetables...\n💧 **Irrigation** – drip, sprinkler, water saving\n🧪 **Fertilizers** – urea, DAP, organic options\n🐛 **Pest Control** – diseases, remedies\n🏛️ **Government Schemes** – PM-KISAN, subsidies\n🌍 **Soil** – types, testing, health\n📊 **Market** – MSP, mandi prices\n\nBas pucho! 😊" },

  { keywords: ["help", "madad", "kya kar sakte", "what can you do"],
    answer: "🤖 **Main aapka farming assistant hoon!**\n\nAap mujhse ye sab pooch sakte ho:\n\n1. 🌾 Koi bhi crop ke baare mein (wheat, rice, cotton...)\n2. 💧 Irrigation/sinchai methods\n3. 🧪 Fertilizer/khad recommendations\n4. 🐛 Pest/disease solutions\n5. 🏛️ Government yojnaayein & subsidies\n6. 🌍 Soil types & testing\n7. 📊 Market rates & MSP\n8. 🌿 Organic farming tips\n9. 🌱 Seed selection & treatment\n10. 🌡️ Weather-based farming tips\n\nExample: *\"Tell me about wheat farming\"* ya *\"sugarcane ke baare mein batao\"*" },

  { keywords: ["thank", "thanks", "dhanyawad", "shukriya", "धन्यवाद"],
    answer: "🙏 **Dhanyawad! Khush rahe, kheti mein tarakki kare!** 🌾\n\nAgar aur koi sawal ho to zaroor puchiye. KhetMitra aapke saath hai! 💚" },

  // ── Livestock ──
  { keywords: ["cow", "gaay", "buffalo", "bhains", "dairy", "milk", "doodh", "गाय", "भैंस", "दूध"],
    answer: "🐄 **Dairy Farming Tips**\n\n**Breeds:**\n• **Cow:** Gir, Sahiwal, Jersey cross, HF cross\n• **Buffalo:** Murrah, Mehsana, Jafrabadi\n\n**Feed per animal/day:**\n• Green fodder: 25–30 kg\n• Dry fodder: 5–6 kg\n• Concentrate: 1 kg per 2.5 liters milk\n\n**Milk Yield:**\n• Desi cow: 5–10 L/day\n• Jersey cross: 12–18 L/day\n• Murrah buffalo: 10–15 L/day\n\n**Government Support:**\n• Rashtriya Gokul Mission\n• Dairy loans at subsidized rates\n• NABARD financing available" },
]

// ─── Smart Matching Function ─────────────────────────────────────────────────
function findBestAnswer(question: string): string {
  const q = question.toLowerCase().trim()

  // Score each knowledge entry
  let bestScore = 0
  let bestAnswer = ""

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0
    for (const keyword of entry.keywords) {
      if (q.includes(keyword.toLowerCase())) {
        // Longer keyword matches are worth more
        score += keyword.length
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestAnswer = entry.answer
    }
  }

  if (bestScore > 0) return bestAnswer

  // Fallback — friendly response
  return "🤔 **Is sawal ka jawaab mere paas abhi nahi hai.**\n\nAap ye try karein:\n• Crop ka naam pucho (e.g., \"wheat\", \"rice\", \"cotton\")\n• \"irrigation\" ya \"fertilizer\" ke baare mein pucho\n• \"government scheme\" ya \"subsidy\" pucho\n• \"soil testing\" ke baare mein jaanein\n• \"pest control\" ya \"organic farming\" pucho\n\n💡 **Tip:** Simple English ya Hindi mein poochein!"
}

// ─── API Route ───────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Please enter a valid question." }, { status: 400 })
    }

    const reply = findBestAnswer(message)

    return NextResponse.json({ reply })

  } catch (error) {
    return NextResponse.json({ reply: "Something went wrong. Please try again." }, { status: 500 })
  }
}
