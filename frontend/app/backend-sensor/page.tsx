"use client"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProtectedRoute from "../../components/ProtectedRoute"
import { useEffect, useState } from "react"

type SensorReading = {
  moisture: number
  temp: number
  humidity: number
  timestamp: number
}

export default function BackendSensor() {

  const [data, setData] = useState<SensorReading | null>(null)
  const [history, setHistory] = useState<SensorReading[]>([])
  const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting")
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor")
        const json: SensorReading = await res.json()

        setData(json)
        setStatus("live")
        setLastUpdated(new Date().toLocaleTimeString())

        setHistory(prev => {
          const updated = [{ ...json, timestamp: Date.now() }, ...prev]
          return updated.slice(0, 10) // Keep last 10 readings
        })

      } catch (err) {
        setStatus("error")
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)

  }, [])


  const statusColor = {
    connecting: "bg-yellow-400",
    live: "bg-green-500",
    error: "bg-red-500"
  }[status]

  const statusLabel = {
    connecting: "Connecting...",
    live: "🟢 Live",
    error: "🔴 Error – Check ESP32"
  }[status]


  return (
    <ProtectedRoute>
    <main className="bg-gray-100 min-h-screen">

      <Navbar />

      <section className="pt-28 max-w-6xl mx-auto p-10">

        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-green-700">Backend Sensor Monitor</h1>
          <span className={`text-xs text-white px-3 py-1 rounded-full font-semibold ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        <p className="text-gray-500 mb-8">
          ESP32 se real-time data – Last updated: {lastUpdated || "—"}
        </p>


        {/* LIVE CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-500 mb-1">🌱 Soil Moisture</p>
            <p className="text-4xl font-bold text-green-700">
              {data ? `${data.moisture}%` : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {data && data.moisture < 45 ? "⚠ Low – irrigate" : data && data.moisture > 65 ? "💧 High" : "✅ Optimal"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-400">
            <p className="text-sm text-gray-500 mb-1">🌡 Temperature</p>
            <p className="text-4xl font-bold text-orange-500">
              {data ? `${data.temp}°C` : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">DHT11 Sensor</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 mb-1">💧 Humidity</p>
            <p className="text-4xl font-bold text-blue-600">
              {data ? `${data.humidity}%` : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">DHT11 Sensor</p>
          </div>

        </div>


        {/* SETUP GUIDE */}

        <div className="bg-white p-6 rounded-xl shadow mb-10">

          <h2 className="text-xl font-semibold mb-4">⚡ ESP32 Connection Guide</h2>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">

            <div>
              <p className="font-semibold text-green-700 mb-2">🛜 Option 1: WiFi (Recommended)</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Open <code className="bg-gray-100 px-1 rounded">iot/esp32/esp32_sensor.ino</code> in Arduino IDE</li>
                <li>Fill in your WiFi SSID, Password</li>
                <li>Run <code className="bg-gray-100 px-1 rounded">ipconfig</code> in CMD → copy your IPv4</li>
                <li>Paste it in <code className="bg-gray-100 px-1 rounded">SERVER_URL</code> in the .ino file</li>
                <li>Upload to ESP32 → data will start appearing here!</li>
              </ol>
            </div>

            <div>
              <p className="font-semibold text-blue-700 mb-2">🔌 Option 2: USB Serial Bridge</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Connect ESP32 via USB to your PC</li>
                <li>Install Python libraries:<br />
                  <code className="bg-gray-100 px-1 rounded">pip install pyserial requests</code>
                </li>
                <li>Open <code className="bg-gray-100 px-1 rounded">backend/serial_bridge.py</code></li>
                <li>Set <code className="bg-gray-100 px-1 rounded">SERIAL_PORT</code> to your COM port (check Device Manager)</li>
                <li>Run: <code className="bg-gray-100 px-1 rounded">python backend/serial_bridge.py</code></li>
              </ol>
            </div>

          </div>

        </div>


        {/* HISTORY TABLE */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">📋 Recent Readings</h2>

          {history.length === 0 ? (
            <p className="text-gray-400 text-sm">Koi data nahi mila abhi... ESP32 connect karo.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2">Time</th>
                  <th>Moisture</th>
                  <th>Temp</th>
                  <th>Humidity</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2">{new Date(row.timestamp).toLocaleTimeString()}</td>
                    <td>{row.moisture}%</td>
                    <td>{row.temp}°C</td>
                    <td>{row.humidity}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>

      </section>

      <Footer />

    </main>
    </ProtectedRoute>
  )
}
