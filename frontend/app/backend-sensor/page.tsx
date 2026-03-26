"use client"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProtectedRoute from "../../components/ProtectedRoute"
import { useEffect, useState } from "react"
import { useLanguage } from "../../context/LanguageContext"

type SensorReading = {
  moisture: number
  temp: number
  humidity: number
  timestamp: number
}

export default function BackendSensor() {
  const { t, language } = useLanguage()
  const isHi = language === 'hi'

  const [data, setData] = useState<SensorReading | null>(null)
  const [history, setHistory] = useState<SensorReading[]>([])
  const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting")
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor")
        const json: any = await res.json()
        const latest = json.latest

        setData(latest)
        setStatus("live")
        setLastUpdated(new Date().toLocaleTimeString())

        setHistory(prev => {
          const updated = [{ ...latest, timestamp: Date.now() }, ...prev]
          return updated.slice(0, 10)
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
    connecting: isHi ? "कनेक्ट हो रहा है..." : "Connecting...",
    live: isHi ? "🟢 लाइव" : "🟢 Live",
    error: isHi ? "🔴 त्रुटि - ESP32 चेक करें" : "🔴 Error – Check ESP32"
  }[status]

  return (
    <ProtectedRoute>
      <main className="bg-green-50 min-h-screen font-sans">
        <Navbar />
        <section className="pt-28 max-w-6xl mx-auto p-10">
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold text-green-700">
              {isHi ? "बैकएंड सेंसर मॉनिटर" : "Backend Sensor Monitor"}
            </h1>
            <span className={`text-xs text-white px-3 py-1 rounded-full font-semibold ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-gray-500 mb-8">
            {isHi ? "ESP32 से रियल-टाइम डेटा" : "Real-time data from ESP32"} – {isHi ? "पिछली बार अपडेट हुआ" : "Last updated"}: {lastUpdated || "—"}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
              <p className="text-sm text-gray-500 mb-1">🌱 {t("dash_soil_moisture")}</p>
              <p className="text-4xl font-bold text-green-700">
                {data ? `${data.moisture}%` : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {data && data.moisture < 45 ? (isHi ? "⚠ कम - सिंचाई करें" : "⚠ Low – irrigate") : data && data.moisture > 65 ? (isHi ? "💧 अधिक" : "💧 High") : (isHi ? "✅ सही" : "✅ Optimal")}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-400">
              <p className="text-sm text-gray-500 mb-1">🌡 {t("dash_temperature")}</p>
              <p className="text-4xl font-bold text-orange-500">
                {data ? `${data.temp}°C` : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-1">DHT11 {isHi ? "सेंसर" : "Sensor"}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
              <p className="text-sm text-gray-500 mb-1">💧 {t("dash_humidity")}</p>
              <p className="text-4xl font-bold text-blue-600">
                {data ? `${data.humidity}%` : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-1">DHT11 {isHi ? "सेंसर" : "Sensor"}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">⚡ {isHi ? "ESP32 कनेक्शन गाइड" : "ESP32 Connection Guide"}</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-green-700 mb-2">🛜 Option 1: WiFi ({isHi ? "अनुशंसित" : "Recommended"})</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>{isHi ? "आर्डिनो IDE में esp32_sensor.ino खोलें" : "Open esp32_sensor.ino in Arduino IDE"}</li>
                  <li>{isHi ? "अपना WiFi नाम और पासवर्ड भरें" : "Fill in your WiFi SSID and Password"}</li>
                  <li>{isHi ? "CMD में ipconfig चलाएं और अपना IPv4 एड्रेस कॉपी करें" : "Run ipconfig in CMD and copy your IPv4 address"}</li>
                  <li>{isHi ? ".ino फ़ाइल में SERVER_URL में पेस्ट करें" : "Paste it in SERVER_URL in the .ino file"}</li>
                  <li>{isHi ? "ESP32 पर अपलोड करें - डेटा यहाँ दिखने लगेगा!" : "Upload to ESP32 – data will start appearing here!"}</li>
                </ol>
              </div>
              <div>
                <p className="font-semibold text-blue-700 mb-2">🔌 Option 2: USB Serial Bridge</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>{isHi ? "USB के माध्यम से ESP32 को अपने PC से कनेक्ट करें" : "Connect ESP32 via USB to your PC"}</li>
                  <li>{isHi ? "पायथन लाइब्रेरी इंस्टॉल करें" : "Install Python libraries"}:<br /> <code className="bg-gray-100 px-1 rounded">pip install pyserial requests</code></li>
                  <li>{isHi ? "serial_bridge.py फ़ाइल खोलें" : "Open serial_bridge.py file"}</li>
                  <li>{isHi ? "SERIAL_PORT सेट करें (Device Manager चेक करें)" : "Set SERIAL_PORT (check Device Manager)"}</li>
                  <li>{isHi ? "चलाएं" : "Run"}: <code className="bg-gray-100 px-1 rounded">python iot/serial_bridge.py</code></li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">📋 {isHi ? "हालिया रीडिंग" : "Recent Readings"}</h2>
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm">{isHi ? "कोई डेटा नहीं मिला... ESP32 कनेक्ट करें।" : "No data found... Connect ESP32."}</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2">{isHi ? "समय" : "Time"}</th>
                    <th>{isHi ? "नमी" : "Moisture"}</th>
                    <th>{isHi ? "तापमान" : "Temp"}</th>
                    <th>{isHi ? "आर्द्रता" : "Humidity"}</th>
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
