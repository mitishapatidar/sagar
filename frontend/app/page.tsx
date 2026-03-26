"use client"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Link from "next/link"
import { useLanguage } from "../context/LanguageContext"

export default function Home(){

const { t, language } = useLanguage()

return(

<main>

<Navbar/>

{/* HERO SECTION */}

<section className="pt-24 bg-green-50">

<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 p-10 items-center">

<div>

<h1 className="text-5xl font-bold text-green-800 leading-tight">
{t("hero_title")}
</h1>

<p className="mt-6 text-gray-600 text-lg">
{t("hero_subtitle")}
</p>

<div className="flex gap-4 mt-8">
  <Link href="/dashboard">
  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md font-medium transition">
  {t("hero_cta_primary")}
  </button>
  </Link>
  
  <Link href="/sensors">
  <button className="bg-white text-green-700 border border-green-200 px-6 py-3 rounded-lg hover:bg-green-50 shadow-sm font-medium transition">
  {t("hero_cta_secondary")}
  </button>
  </Link>
</div>

</div>

<img
src="/images/hero.jpg"
className="rounded-xl shadow-lg h-72 w-full object-cover"
/>

</div>

</section>


{/* SMART AGRICULTURE */}

<section className="max-w-7xl mx-auto p-10">

<h2 className="text-3xl font-bold text-green-700 mb-8">
{t("map_title")}
</h2>

<div className="grid md:grid-cols-3 gap-8">


{/* SOIL SENSOR */}

<Link href="/dashboard">

<div className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:scale-105 hover:shadow-xl transition">

<img
src="/images/soil.jpg"
className="h-40 w-full object-cover"
alt="Soil"
/>

<div className="p-4">

<h3 className="text-xl font-semibold">
{t("dash_soil_moisture")}
</h3>

<p className="mt-2 text-gray-600">
{language === 'en' 
  ? "Soil moisture sensors measure water levels in the soil and help farmers determine the correct irrigation timing."
  : "मिट्टी की नमी के सेंसर मिट्टी में पानी के स्तर को मापते हैं और किसानों को सिंचाई का सही समय निर्धारित करने में मदद करते हैं।"}
</p>

</div>

</div>

</Link>


{/* CLIMATE SENSOR */}

<Link href="/dashboard">

<div className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:scale-105 hover:shadow-xl transition">

<img
src="/images/climate.jpg"
className="h-40 w-full object-cover"
alt="Climate"
/>

<div className="p-4">

<h3 className="text-xl font-semibold">
{t("dash_temperature")} & {t("dash_humidity")}
</h3>

<p className="mt-2 text-gray-600">
{language === 'en'
  ? "Climate sensors track temperature, humidity and weather changes that affect crop growth."
  : "जलवायु सेंसर तापमान, आर्द्रता और मौसम के बदलावों को ट्रैक करते हैं जो फसल की वृद्धि को प्रभावित करते हैं।"}
</p>

</div>

</div>

</Link>


{/* AUTOMATED IRRIGATION */}

<Link href="/dashboard">

<div className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:scale-105 hover:shadow-xl transition">

<img
src="/images/irrigation.jpg"
className="h-40 w-full object-cover"
alt="Irrigation"
/>

<div className="p-4">

<h3 className="text-xl font-semibold">
{language === 'en' ? "Automated Irrigation" : "स्वचालित सिंचाई"}
</h3>

<p className="mt-2 text-gray-600">
{language === 'en'
  ? "Automated irrigation systems spray water on crops based on soil moisture levels and environmental data."
  : "स्वचालित सिंचाई प्रणालियाँ मिट्टी की नमी और पर्यावरणीय डेटा के आधार पर फसलों पर पानी का छिड़काव करती हैं।"}
</p>

</div>

</div>

</Link>


</div>

</section>


{/* FEATURES */}

<section className="bg-green-50 py-16">

<div className="max-w-7xl mx-auto px-10">

<h2 className="text-3xl font-bold text-green-700 mb-10">
{language === 'en' ? "Features of KhetMitra" : "खेत मित्र की विशेषताएं"}
</h2>

<div className="grid md:grid-cols-4 gap-8">

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-2">
{language === 'en' ? "Live Sensor Monitoring" : "लाइव सेंसर निगरानी"}
</h3>

<p className="text-gray-600">
{language === 'en' 
  ? "Monitor soil moisture, temperature and humidity in real time."
  : "मिट्टी की नमी, तापमान और आर्द्रता की रियल-टाइम में निगरानी करें।"}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-2">
{language === 'en' ? "AI Crop Recommendation" : "AI फसल सलाह"}
</h3>

<p className="text-gray-600">
{language === 'en'
  ? "Artificial intelligence recommends suitable crops based on soil data."
  : "आर्टिफिशियल इंटेलिजेंस मिट्टी के डेटा के आधार पर उपयुक्त फसलों की सिफारिश करता है।"}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-2">
{language === 'en' ? "Satellite Monitoring" : "सैटेलाइट मॉनिटरिंग"}
</h3>

<p className="text-gray-600">
{language === 'en'
  ? "Satellite images help detect crop health issues and stress."
  : "सैटेलाइट इमेज फसल स्वास्थ्य समस्याओं और तनाव का पता लगाने में मदद करती हैं।"}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-2">
{language === 'en' ? "Weather Forecast" : "मौसम का पूर्वानुमान"}
</h3>

<p className="text-gray-600">
{language === 'en'
  ? "Weather monitoring helps farmers plan irrigation and planting."
  : "मौसम की निगरानी किसानों को सिंचाई और रोपण की योजना बनाने में मदद करती है।"}
</p>

</div>

</div>

</div>

</section>


{/* AI FARMING */}

<section className="max-w-7xl mx-auto p-10 grid md:grid-cols-2 gap-10 items-center">

<img
src="/images/ai.jpg"
className="rounded-xl shadow-lg h-72 w-full object-cover"
alt="AI Farming"
/>

<div>

<h2 className="text-3xl font-bold text-green-700 mb-4">
{language === 'en' ? "AI Powered Farming" : "AI संचालित खेती"}
</h2>

<p className="text-gray-600">
{language === 'en'
  ? "Artificial intelligence analyzes soil conditions and environmental data to recommend the best crops."
  : "आर्टिफिशियल इंटेलिजेंस सर्वोत्तम फसलों की सिफारिश करने के लिए मिट्टी की स्थिति और पर्यावरणीय डेटा का विश्लेषण करता है।"}
</p>

<p className="mt-4 text-gray-600">
{language === 'en'
  ? "Using AI insights farmers can improve productivity and reduce farming risks."
  : "AI अंतर्दृष्टि का उपयोग करके किसान उत्पादकता में सुधार कर सकते हैं और खेती के जोखिमों को कम कर सकते हैं।"}
</p>

</div>

</section>


{/* BENEFITS */}

<section className="max-w-7xl mx-auto p-10">

<h2 className="text-3xl font-bold text-green-700 mb-10">
{language === 'en' ? "Benefits for Farmers" : "किसानों के लिए लाभ"}
</h2>

<div className="grid md:grid-cols-3 gap-8">

<div className="bg-white p-6 shadow rounded-xl">

<h3 className="font-semibold mb-2">
{language === 'en' ? "Higher Crop Yield" : "अधिक फसल की पैदावार"}
</h3>

<p className="text-gray-600">
{language === 'en'
  ? "Better farming decisions improve productivity."
  : "खेती के बेहतर निर्णय उत्पादकता में सुधार करते हैं।"}
</p>

</div>

<div className="bg-white p-6 shadow rounded-xl">

<h3 className="font-semibold mb-2">
{language === 'en' ? "Water Conservation" : "जल संरक्षण"}
</h3>

<p className="text-gray-600">
{language === 'en'
  ? "Smart irrigation reduces water wastage."
  : "स्मार्ट सिंचाई पानी की बर्बादी को कम करती है।"}
</p>

</div>

<div className="bg-white p-6 shadow rounded-xl">

<h3 className="font-semibold mb-2">
{language === 'en' ? "Cost Reduction" : "लागत में कमी"}
</h3>

<p className="text-gray-600">
{language === 'en'
  ? "Data driven farming reduces operational costs."
  : "डेटा संचालित खेती परिचालन लागत को कम करती है।"}
</p>

</div>

</div>

</section>

<Footer/>

</main>

)

}