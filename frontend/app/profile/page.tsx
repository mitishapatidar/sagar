"use client"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { useState } from "react"

export default function Profile(){

const [profile,setProfile]=useState({
name:"sagar patidar",
age:"21",
location:"mumbai",
phone:"9823345187"
})

const [sensors,setSensors]=useState([
{ id:"ESP32-101", type:"Soil Moisture", status:"Connected"},
{ id:"ESP32-202", type:"Temperature", status:"Connected"},
{ id:"ESP32-303", type:"Humidity", status:"Connected"}
])

const [newSensor,setNewSensor]=useState({
id:"",
type:"Soil Moisture"
})

function addSensor(){

if(!newSensor.id) return

setSensors([
...sensors,
{
id:newSensor.id,
type:newSensor.type,
status:"Connected"
}
])

setNewSensor({
id:"",
type:"Soil Moisture"
})

}

function removeSensor(index:number){

const updated=[...sensors]
updated.splice(index,1)

setSensors(updated)

}

return(

<main className="bg-gray-100 min-h-screen">

<Navbar/>

<section className="pt-28 px-10 max-w-7xl mx-auto">

<h1 className="text-4xl font-bold text-green-700 mb-10">
Farmer Profile
</h1>


{/* PROFILE SECTION */}

<div className="bg-white p-8 rounded-xl shadow mb-10">

<div className="flex items-center gap-8">

<img
src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
className="w-32 h-32 rounded-full border-4 border-green-600 object-cover"
/>

<div className="flex-1 grid grid-cols-2 gap-4">

<input
className="border p-3 rounded-lg"
value={profile.name}
onChange={(e)=>setProfile({...profile,name:e.target.value})}
/>

<input
className="border p-3 rounded-lg"
value={profile.age}
onChange={(e)=>setProfile({...profile,age:e.target.value})}
/>

<input
className="border p-3 rounded-lg"
value={profile.location}
onChange={(e)=>setProfile({...profile,location:e.target.value})}
/>

<input
className="border p-3 rounded-lg"
value={profile.phone}
onChange={(e)=>setProfile({...profile,phone:e.target.value})}
/>

</div>

</div>

<button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">
Save Profile
</button>

</div>



{/* CONNECTED SENSORS */}

<div className="bg-white p-8 rounded-xl shadow mb-10">

<h2 className="text-2xl font-semibold mb-6">
Connected Sensors
</h2>

<table className="w-full text-left">

<thead>

<tr className="border-b">

<th className="py-3">Sensor ID</th>
<th>Sensor Type</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{sensors.map((sensor,index)=>(

<tr key={index} className="border-b">

<td className="py-3">{sensor.id}</td>

<td>{sensor.type}</td>

<td className="text-green-600">
🟢 {sensor.status}
</td>

<td>

<button
onClick={()=>removeSensor(index)}
className="text-red-500"
>

Remove

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>



{/* ADD SENSOR */}

<div className="bg-white p-8 rounded-xl shadow">

<h2 className="text-2xl font-semibold mb-6">
Connect New Sensor
</h2>

<div className="grid md:grid-cols-3 gap-4">

<input
placeholder="Enter Sensor ID"
className="border p-3 rounded-lg"
value={newSensor.id}
onChange={(e)=>setNewSensor({...newSensor,id:e.target.value})}
/>

<select
className="border p-3 rounded-lg"
value={newSensor.type}
onChange={(e)=>setNewSensor({...newSensor,type:e.target.value})}
>

<option>Soil Moisture</option>
<option>Temperature</option>
<option>Humidity</option>

</select>

<button
onClick={addSensor}
className="bg-green-600 text-white rounded-lg"
>

Add Sensor

</button>

</div>

</div>


</section>

<Footer/>

</main>

)

}