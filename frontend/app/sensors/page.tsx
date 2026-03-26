"use client"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProtectedRoute from "../../components/ProtectedRoute"
import { useEffect, useState } from "react"

type SensorData = {
  moisture: number
  temp: number
  humidity: number
  timestamp: number
}

type Alert = {
  type: "error" | "warning" | "ok"
  factor: string
  message: string
}

function getSmartAlerts(moisture: number, temp: number, humidity: number): Alert[] {
  const alerts: Alert[] = []

  // ── Moisture ──────────────────────────────────────────────────────────────
  if (moisture < 30) {
    alerts.push({ type: "error", factor: "Moisture", message: "🚨 Critical – Soil is dangerously dry. Irrigate immediately!" })
  } else if (moisture < 45) {
    alerts.push({ type: "warning", factor: "Moisture", message: "⚠ Soil moisture low – Start irrigation soon." })
  } else if (moisture > 75) {
    alerts.push({ type: "warning", factor: "Moisture", message: "💧 Soil is over-watered – Stop irrigation to prevent root rot." })
  } else {
    alerts.push({ type: "ok", factor: "Moisture", message: "✅ Soil moisture is optimal for crop growth." })
  }

  // ── Temperature ───────────────────────────────────────────────────────────
  if (temp > 38) {
    alerts.push({ type: "error", factor: "Temperature", message: "🔥 Temperature critically high (>" + temp + "°C) – Crops under stress!" })
  } else if (temp > 32) {
    alerts.push({ type: "warning", factor: "Temperature", message: "🌡 Temperature high (" + temp + "°C) – Consider shade or extra irrigation." })
  } else if (temp < 10) {
    alerts.push({ type: "warning", factor: "Temperature", message: "❄ Temperature low (" + temp + "°C) – Risk of frost damage to crops." })
  } else {
    alerts.push({ type: "ok", factor: "Temperature", message: "✅ Temperature (" + temp + "°C) is in safe range." })
  }

  // ── Humidity ──────────────────────────────────────────────────────────────
  if (humidity > 85) {
    alerts.push({ type: "warning", factor: "Humidity", message: "💦 Humidity very high (" + humidity + "%) – Risk of fungal/mold disease." })
  } else if (humidity < 30) {
    alerts.push({ type: "warning", factor: "Humidity", message: "🏜 Humidity very low (" + humidity + "%) – Increase watering frequency." })
  } else {
    alerts.push({ type: "ok", factor: "Humidity", message: "✅ Humidity (" + humidity + "%) is in optimal range." })
  }

  // ── Combined Conditions ───────────────────────────────────────────────────
  if (moisture < 45 && temp > 32) {
    alerts.push({ type: "error", factor: "Combined", message: "🚨 Dry soil + High temperature – Urgent irrigation needed to prevent crop failure!" })
  }
  if (humidity > 80 && moisture > 65) {
    alerts.push({ type: "warning", factor: "Combined", message: "⚠ High humidity + High moisture – Stop all irrigation, fungal risk is high." })
  }

  return alerts
}

export default function Sensors() {

  const [data, setData] = useState<SensorData>({
    moisture: 45,
    temp: 28,
    humidity: 65,
    timestamp: Date.now()
  })

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>("")

  /* LIVE UPDATE EVERY 3 SEC */

  useEffect(() => {

    const fetchSensorData = async () => {
      try {
        const res = await fetch("/api/sensor")
        const json = await res.json()
        const d = json.latest

        setData(d)
        setAlerts(getSmartAlerts(d.moisture, d.temp, d.humidity))
        setLastUpdated(new Date().toLocaleTimeString())

      } catch (err) {
        console.error("Error fetching sensor data", err)
      }
    }

    fetchSensorData()
    const interval = setInterval(fetchSensorData, 15000)
    return () => clearInterval(interval)

  }, [])


  const alertBg = {
    error:   "bg-red-50   border-red-400   text-red-700",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-700",
    ok:      "bg-green-50  border-green-400  text-green-700"
  }

  const alertBadge = {
    error:   "bg-red-100   text-red-600",
    warning: "bg-yellow-100 text-yellow-600",
    ok:      "bg-green-100 text-green-600"
  }


  return (
    <ProtectedRoute>
    <main className="bg-gray-100 min-h-screen">

      <Navbar />

      <section className="pt-28 max-w-7xl mx-auto p-10">

        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Farm Sensors Data
        </h1>

        <p className="text-gray-500 mb-8">
          🟢 Live Sensor Data – Last updated: {lastUpdated || "connecting..."}
        </p>


        {/* SENSOR CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="font-semibold text-gray-700">Soil Moisture Sensor</h3>
            <p className="text-4xl font-bold text-green-700 mt-3">
              {data.moisture}%
            </p>
            <div className="mt-3 bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(data.moisture, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Status: Active</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-400">
            <h3 className="font-semibold text-gray-700">Temperature Sensor</h3>
            <p className="text-4xl font-bold text-orange-500 mt-3">
              {data.temp}°C
            </p>
            <div className="mt-3 bg-gray-100 rounded-full h-2">
              <div
                className="bg-orange-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((data.temp / 50) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Status: Active</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-700">Humidity Sensor</h3>
            <p className="text-4xl font-bold text-blue-600 mt-3">
              {data.humidity}%
            </p>
            <div className="mt-3 bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(data.humidity, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Status: Active</p>
          </div>

        </div>


        {/* SMART ALERTS — all factors */}

        <div className="bg-white p-6 rounded-xl shadow mb-10">

          <h2 className="text-xl font-semibold mb-5">
            🚿 Smart Irrigation Alerts
          </h2>

          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`border-l-4 px-4 py-3 rounded-r-lg flex items-start gap-3 ${alertBg[alert.type]}`}
              >
                <span className={`text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap ${alertBadge[alert.type]}`}>
                  {alert.factor}
                </span>
                <span className="text-sm font-medium">{alert.message}</span>
              </div>
            ))}
          </div>

        </div>


        {/* SENSOR READINGS TABLE */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Sensor Readings
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500 text-sm">
                <th className="py-2">Sensor</th>
                <th>Value</th>
                <th>Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-3">🌱 Soil Moisture</td>
                <td className="font-semibold">{data.moisture}%</td>
                <td className="text-gray-400">45–75% optimal</td>
                <td className={
                  data.moisture < 30 ? "text-red-600 font-semibold" :
                  data.moisture < 45 ? "text-yellow-600" :
                  data.moisture > 75 ? "text-yellow-600" : "text-green-600"
                }>
                  {data.moisture < 30 ? "Critical" : data.moisture < 45 ? "Low" : data.moisture > 75 ? "High" : "✅ Optimal"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3">🌡 Temperature</td>
                <td className="font-semibold">{data.temp}°C</td>
                <td className="text-gray-400">10–32°C optimal</td>
                <td className={
                  data.temp > 38 ? "text-red-600 font-semibold" :
                  data.temp > 32 || data.temp < 10 ? "text-yellow-600" : "text-green-600"
                }>
                  {data.temp > 38 ? "Critical" : data.temp > 32 ? "High" : data.temp < 10 ? "Low" : "✅ Optimal"}
                </td>
              </tr>
              <tr>
                <td className="py-3">💧 Humidity</td>
                <td className="font-semibold">{data.humidity}%</td>
                <td className="text-gray-400">30–85% optimal</td>
                <td className={
                  data.humidity > 85 || data.humidity < 30 ? "text-yellow-600" : "text-green-600"
                }>
                  {data.humidity > 85 ? "Too High" : data.humidity < 30 ? "Too Low" : "✅ Optimal"}
                </td>
              </tr>
            </tbody>
          </table>

        </div>

      </section>

      <Footer />

    </main>
    </ProtectedRoute>
  )
}