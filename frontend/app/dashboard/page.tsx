"use client"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProtectedRoute from "../../components/ProtectedRoute"
import { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import FarmReport from "../../components/FarmReport"

const FarmMap = dynamic(
  () => import("../../components/FarmMap"),
  { ssr: false }
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

type SensorPoint = {
  time: string
  moisture: number
  temp: number
  humidity: number
  timestamp?: number
}

type Alert = {
  type: "error" | "warning" | "ok"
  message: string
}

function getSmartAlerts(moisture: number, temp: number, humidity: number): Alert[] {
  const alerts: Alert[] = []

  // Moisture alerts
  if (moisture < 30) {
    alerts.push({ type: "error", message: "🚨 Soil critically dry! Irrigate immediately." })
  } else if (moisture < 45) {
    alerts.push({ type: "warning", message: "⚠ Soil moisture low – Start irrigation soon." })
  } else if (moisture > 75) {
    alerts.push({ type: "warning", message: "💧 Soil over-watered – Stop irrigation." })
  } else {
    alerts.push({ type: "ok", message: "✅ Soil moisture optimal for crop growth." })
  }

  // Temperature alerts
  if (temp > 38) {
    alerts.push({ type: "error", message: "🔥 Temperature critically high! Risk of crop stress." })
  } else if (temp > 32) {
    alerts.push({ type: "warning", message: "🌡 High temperature – Consider shade or extra watering." })
  } else if (temp < 10) {
    alerts.push({ type: "warning", message: "❄ Low temperature – Risk of frost damage." })
  }

  // Humidity alerts
  if (humidity > 85) {
    alerts.push({ type: "warning", message: "💦 Humidity very high – Risk of fungal disease." })
  } else if (humidity < 30) {
    alerts.push({ type: "warning", message: "🏜 Low humidity – Increase watering frequency." })
  }

  // Combined condition alert
  if (moisture < 45 && temp > 32) {
    alerts.push({ type: "error", message: "🚨 Dry + Hot combo – Urgent irrigation needed!" })
  }

  return alerts
}

export default function Dashboard() {

  const [data, setData] = useState<SensorPoint[]>([
    { time: "", moisture: 45, temp: 27, humidity: 60 }
  ])
  const [latest, setLatest] = useState({ moisture: 45, temp: 27, humidity: 60 })
  const [alerts, setAlerts] = useState<Alert[]>([])

  const [crop, setCrop] = useState("Click on map to select farm location")
  const [location, setLocation] = useState("No location selected")

  const downloadPDF = () => {
    window.print()
  }

  /* FETCH SENSOR DATA — every 15 seconds (matches ESP32 send interval) */

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor")
        const json = await res.json()

        // Use stored history for graph
        if (json.history && json.history.length > 0) {
          setData(json.history.slice(-20)) // Last 20 readings = 5 minutes on graph
        } else {
          // First reading — seed graph
          setData(prev => {
            const newPoint: SensorPoint = {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              moisture: json.latest.moisture,
              temp: json.latest.temp,
              humidity: json.latest.humidity
            }
            const updated = [...prev, newPoint]
            if (updated.length > 20) updated.shift()
            return updated
          })
        }

        setLatest(json.latest)
        setAlerts(getSmartAlerts(json.latest.moisture, json.latest.temp, json.latest.humidity))

      } catch (err) {
        console.error("Error fetching sensor data", err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 15000) // 15 seconds
    return () => clearInterval(interval)

  }, [])



  const alertBg = {
    error: "bg-red-50 border-red-400 text-red-700",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-700",
    ok: "bg-green-50 border-green-400 text-green-700"
  }


  return (
    <ProtectedRoute>
    <main className="bg-gray-100 min-h-screen">

      {/* Hide entirely when printing */}
      <div className="print:hidden">
        <Navbar />

        <section className="pt-28 max-w-7xl mx-auto p-10">

          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-green-700">
              Farm Dashboard
            </h1>
            <button 
              onClick={downloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium shadow flex items-center gap-2 transition-colors transition-transform active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download Report (PDF)
            </button>
          </div>

        <p className="text-gray-500 mb-6">
          🟢 Live Data – Updating every 15 seconds
        </p>


        {/* SENSOR CARDS */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="font-semibold text-gray-600">Soil Moisture</h3>
            <p className="text-3xl font-bold text-green-700 mt-2">
              {latest.moisture}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-400">
            <h3 className="font-semibold text-gray-600">Temperature</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">
              {latest.temp}°C
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-600">Humidity</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {latest.humidity}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-400">
            <h3 className="font-semibold text-gray-600">Readings Stored</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {data.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">In session</p>
          </div>

        </div>


        {/* SMART IRRIGATION ALERTS */}

        <div className="bg-white p-6 rounded-xl shadow mb-10">

          <h2 className="text-xl font-semibold mb-4">
            🚿 Smart Irrigation Alerts
          </h2>

          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`border-l-4 px-4 py-3 rounded-r-lg text-sm font-medium ${alertBg[alert.type]}`}
              >
                {alert.message}
              </div>
            ))}
          </div>

        </div>


        {/* GRAPHS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Soil Moisture</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line dataKey="moisture" stroke="#16a34a" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Temperature</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Line dataKey="temp" stroke="#f97316" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Humidity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line dataKey="humidity" stroke="#3b82f6" dot={false} strokeWidth={2} />
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
          <h3 className="font-semibold mb-4">Farm Location Map</h3>
          <FarmMap setLocation={setLocation} setCrop={setCrop} />
        </div>


        <div className="flex gap-6">
          <Link href="/sensors">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg">
              View Sensors
            </button>
          </Link>
          <Link href="/backend-sensor">
            <button className="bg-gray-700 text-white px-6 py-3 rounded-lg">
              Backend Monitor
            </button>
          </Link>
        </div>


      </section>

      <Footer />
      </div>

      {/* Visible only when printing */}
      <div className="hidden print:block w-full absolute top-0 left-0 bg-white min-h-screen z-50">
        <FarmReport 
          moisture={latest.moisture}
          temperature={latest.temp}
          humidity={latest.humidity}
          recommendation={crop !== "Click on map to select farm location" ? { name: crop, tips: "Ensure proper irrigation as per soil condition. Protect from pests using neem oil if organic. Give required fertilizers.", soil: "Suitable for local region." } : null}
          location={null}
          date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        />
      </div>

    </main>
    </ProtectedRoute>
  )
}