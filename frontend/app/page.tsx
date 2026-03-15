"use client"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Link from "next/link"

export default function Home(){

return(

<main>

<Navbar/>

{/* HERO SECTION */}

<section className="pt-24 bg-green-50">

<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 p-10 items-center">

<div>

<h1 className="text-5xl font-bold text-green-800 leading-tight">
Smart Farming with AI & IoT
</h1>

<p className="mt-6 text-gray-600 text-lg">

KhetMitra helps farmers monitor soil conditions,
analyze crop health and receive AI based
recommendations for better crop productivity.

</p>

<p className="mt-4 text-gray-600">

The system combines IoT sensors, environmental
monitoring and artificial intelligence to help
farmers make better agriculture decisions.

</p>

<Link href="/dashboard">

<button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
View Dashboard
</button>

</Link>

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
Smart Agriculture Technology
</h2>

<div className="grid md:grid-cols-3 gap-8">


{/* SOIL SENSOR */}

<Link href="/dashboard">

<div className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:scale-105 hover:shadow-xl transition">

<img
src="/images/soil.jpg"
className="h-40 w-full object-cover"
/>

<div className="p-4">

<h3 className="text-xl font-semibold">
Soil Moisture Sensors
</h3>

<p className="mt-2 text-gray-600">

Soil moisture sensors measure water levels
in the soil and help farmers determine the
correct irrigation timing.

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
/>

<div className="p-4">

<h3 className="text-xl font-semibold">
Climate Sensors
</h3>

<p className="mt-2 text-gray-600">

Climate sensors track temperature,
humidity and weather changes that
affect crop growth.

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
/>

<div className="p-4">

<h3 className="text-xl font-semibold">
Automated Irrigation
</h3>

<p className="mt-2 text-gray-600">

Automated irrigation systems spray
water on crops based on soil moisture
levels and environmental data.

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
Features of KhetMitra
</h2>

<div className="grid md:grid-cols-4 gap-8">

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-2">
Live Sensor Monitoring
</h3>

<p className="text-gray-600">

Monitor soil moisture, temperature
and humidity in real time.

</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-2">
AI Crop Recommendation
</h3>

<p className="text-gray-600">

Artificial intelligence recommends
suitable crops based on soil data.

</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-2">
Satellite Monitoring
</h3>

<p className="text-gray-600">

Satellite images help detect crop
health issues and stress.

</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-2">
Weather Forecast
</h3>

<p className="text-gray-600">

Weather monitoring helps farmers
plan irrigation and planting.

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
/>

<div>

<h2 className="text-3xl font-bold text-green-700 mb-4">
AI Powered Farming
</h2>

<p className="text-gray-600">

Artificial intelligence analyzes soil
conditions and environmental data to
recommend the best crops.

</p>

<p className="mt-4 text-gray-600">

Using AI insights farmers can improve
productivity and reduce farming risks.

</p>

</div>

</section>


{/* BENEFITS */}

<section className="max-w-7xl mx-auto p-10">

<h2 className="text-3xl font-bold text-green-700 mb-10">
Benefits for Farmers
</h2>

<div className="grid md:grid-cols-3 gap-8">

<div className="bg-white p-6 shadow rounded-xl">

<h3 className="font-semibold mb-2">
Higher Crop Yield
</h3>

<p className="text-gray-600">
Better farming decisions improve productivity.
</p>

</div>

<div className="bg-white p-6 shadow rounded-xl">

<h3 className="font-semibold mb-2">
Water Conservation
</h3>

<p className="text-gray-600">
Smart irrigation reduces water wastage.
</p>

</div>

<div className="bg-white p-6 shadow rounded-xl">

<h3 className="font-semibold mb-2">
Cost Reduction
</h3>

<p className="text-gray-600">
Data driven farming reduces operational costs.
</p>

</div>

</div>

</section>

<Footer/>

</main>

)

}