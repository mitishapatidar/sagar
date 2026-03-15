"use client"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useEffect,useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

const FarmMap = dynamic(
() => import("../../components/FarmMap"),
{ ssr:false }
)

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts"


export default function Dashboard(){

const [data,setData]=useState([
{time:"1",moisture:45,temp:27,humidity:60},
{time:"2",moisture:47,temp:28,humidity:62},
{time:"3",moisture:49,temp:29,humidity:65},
{time:"4",moisture:50,temp:28,humidity:66},
{time:"5",moisture:52,temp:27,humidity:67},
{time:"6",moisture:53,temp:26,humidity:68}
])

const [crop,setCrop]=useState("Click on map to select farm location")
const [location,setLocation]=useState("No location selected")
const [irrigation,setIrrigation]=useState("Checking soil conditions...")


/* GRAPH UPDATE EVERY 10 MIN */

useEffect(()=>{

const interval=setInterval(()=>{

setData(prev=>{

const newPoint={
time:(prev.length+1).toString(),
moisture:40+Math.floor(Math.random()*20),
temp:25+Math.floor(Math.random()*10),
humidity:55+Math.floor(Math.random()*20)
}

const updated=[...prev,newPoint]

if(updated.length>6){
updated.shift()
}

return updated

})

},600000)

return()=>clearInterval(interval)

},[])



/* IRRIGATION ALERT */

useEffect(()=>{

const latest=data[data.length-1]

if(latest.moisture<45){
setIrrigation("⚠ Soil Dry - Start Irrigation")
}
else if(latest.moisture>60){
setIrrigation("💧 Soil Moisture High - Stop Irrigation")
}
else{
setIrrigation("✅ Soil Moisture Optimal")
}

},[data])



return(

<main className="bg-gray-100 min-h-screen">

<Navbar/>

<section className="pt-28 max-w-7xl mx-auto p-10">

<h1 className="text-3xl font-bold text-green-700 mb-4">
Farm Dashboard
</h1>

<p className="text-gray-500 mb-6">
🟢 Live Data – Updating every 10 minutes
</p>



{/* SENSOR CARDS */}

<div className="grid md:grid-cols-4 gap-6 mb-10">

<div className="bg-white p-6 rounded-xl shadow">
<h3 className="font-semibold">Soil Moisture</h3>
<p className="text-2xl mt-2">
{data[data.length-1].moisture}%
</p>
</div>

<div className="bg-white p-6 rounded-xl shadow">
<h3 className="font-semibold">Temperature</h3>
<p className="text-2xl mt-2">
{data[data.length-1].temp}°C
</p>
</div>

<div className="bg-white p-6 rounded-xl shadow">
<h3 className="font-semibold">Humidity</h3>
<p className="text-2xl mt-2">
{data[data.length-1].humidity}%
</p>
</div>

<div className="bg-white p-6 rounded-xl shadow">
<h3 className="font-semibold">Irrigation Alert</h3>
<p className="text-sm mt-2">{irrigation}</p>
</div>

</div>



{/* GRAPHS */}

<div className="grid md:grid-cols-3 gap-6 mb-10">


<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-4">
Soil Moisture
</h3>

<ResponsiveContainer width="100%" height={220}>

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="time"/>

<YAxis/>

<Tooltip/>

<Line dataKey="moisture" stroke="#16a34a"/>

</LineChart>

</ResponsiveContainer>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-4">
Temperature
</h3>

<ResponsiveContainer width="100%" height={220}>

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="time"/>

<YAxis/>

<Tooltip/>

<Line dataKey="temp" stroke="#f97316"/>

</LineChart>

</ResponsiveContainer>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-semibold mb-4">
Humidity
</h3>

<ResponsiveContainer width="100%" height={220}>

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="time"/>

<YAxis/>

<Tooltip/>

<Line dataKey="humidity" stroke="#3b82f6"/>

</LineChart>

</ResponsiveContainer>

</div>


</div>



{/* AI CROP RECOMMENDATION */}

<div className="bg-white p-8 rounded-xl shadow mb-10">

<h2 className="text-2xl font-semibold mb-4">
AI Crop Recommendation
</h2>

<p className="text-gray-600 mb-4">
Click on the map to select your farm location.
AI will recommend crops suitable for that region.
</p>

<p className="mb-3 font-medium">
Selected Location: {location}
</p>

<p className="text-green-700 text-lg font-semibold">
Recommended Crops: {crop}
</p>

</div>



{/* INTERACTIVE MAP */}

<div className="bg-white p-6 rounded-xl shadow mb-10">

<h3 className="font-semibold mb-4">
Farm Location Map
</h3>

<FarmMap setLocation={setLocation} setCrop={setCrop}/>

</div>



<div className="flex gap-6">

<Link href="/sensors">

<button className="bg-green-600 text-white px-6 py-3 rounded-lg">
View Sensors
</button>

</Link>

</div>


</section>

<Footer/>

</main>

)

}