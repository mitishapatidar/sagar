"use client"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useEffect,useState } from "react"

export default function Sensors(){

const [data,setData]=useState({
moisture:52,
temp:28,
humidity:65
})

const [alert,setAlert]=useState("Checking sensors...")

/* LIVE UPDATE EVERY 10 SEC */

useEffect(()=>{

const interval=setInterval(()=>{

const newData={
moisture:45+Math.floor(Math.random()*20),
temp:25+Math.floor(Math.random()*8),
humidity:55+Math.floor(Math.random()*20)
}

setData(newData)

},10000)

return()=>clearInterval(interval)

},[])



/* SMART ALERT */

useEffect(()=>{

if(data.moisture<45){
setAlert("⚠ Soil Moisture Low – Irrigation Recommended")
}
else if(data.moisture>65){
setAlert("💧 Soil Moisture High – Stop Irrigation")
}
else{
setAlert("✅ Soil Moisture Optimal for Crop Growth")
}

},[data])



return(

<main className="bg-gray-100 min-h-screen">

<Navbar/>

<section className="pt-28 max-w-7xl mx-auto p-10">

<h1 className="text-3xl font-bold text-green-700 mb-4">
Farm Sensors Data
</h1>

<p className="text-gray-500 mb-8">
🟢 Live Sensor Data – Updating every 10 seconds
</p>



{/* SENSOR CARDS */}

<div className="grid md:grid-cols-3 gap-6 mb-10">

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold text-gray-700">
Soil Moisture Sensor
</h3>

<p className="text-3xl text-green-700 mt-3">
{data.moisture}%
</p>

<p className="text-sm text-gray-500">
Status: Active
</p>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold text-gray-700">
Temperature Sensor
</h3>

<p className="text-3xl text-orange-500 mt-3">
{data.temp}°C
</p>

<p className="text-sm text-gray-500">
Status: Active
</p>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold text-gray-700">
Humidity Sensor
</h3>

<p className="text-3xl text-blue-600 mt-3">
{data.humidity}%
</p>

<p className="text-sm text-gray-500">
Status: Active
</p>

</div>

</div>



{/* ALERT */}

<div className="bg-white p-6 rounded-xl shadow mb-10">

<h2 className="text-xl font-semibold mb-2">
Smart Irrigation Alert
</h2>

<p className="text-gray-700">
{alert}
</p>

</div>



{/* SENSOR TABLE */}

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold mb-4">
Sensor Readings
</h2>

<table className="w-full text-left">

<thead>

<tr className="border-b">

<th className="py-2">Sensor</th>
<th>Value</th>
<th>Status</th>

</tr>

</thead>

<tbody>

<tr className="border-b">

<td className="py-2">Soil Moisture</td>
<td>{data.moisture}%</td>
<td className="text-green-600">Active</td>

</tr>

<tr className="border-b">

<td className="py-2">Temperature</td>
<td>{data.temp}°C</td>
<td className="text-green-600">Active</td>

</tr>

<tr>

<td className="py-2">Humidity</td>
<td>{data.humidity}%</td>
<td className="text-green-600">Active</td>

</tr>

</tbody>

</table>

</div>

</section>

<Footer/>

</main>

)

}