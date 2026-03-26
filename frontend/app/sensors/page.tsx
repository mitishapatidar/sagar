"use client"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProtectedRoute from "../../components/ProtectedRoute"
import { useEffect, useState } from "react"
import { useLanguage } from "../../context/LanguageContext"

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

function getSmartAlerts(moisture: number, temp: number, humidity: number, lang: string): Alert[] {
  const alerts: Alert[] = []
  const isHi = lang === 'hi'

  // Moisture
  if (moisture < 30) {
    alerts.push({ type: "error", factor: isHi ? "नमी" : "Moisture", message: isHi ? "🚨 गंभीर - मिट्टी बहुत सूखी है। तुरंत सिंचाई करें!" : "🚨 Critical – Soil is dangerously dry. Irrigate immediately!" })
  } else if (moisture < 45) {
    alerts.push({ type: "warning", factor: isHi ? "नमी" : "Moisture", message: isHi ? "⚠ मिट्टी की नमी कम है - जल्द ही सिंचाई शुरू करें।" : "⚠ Soil moisture low – Start irrigation soon." })
  } else if (moisture > 75) {
    alerts.push({ type: "warning", factor: isHi ? "नमी" : "Moisture", message: isHi ? "💧 मिट्टी में पानी ज्यादा है - जड़ सड़न रोकने के लिए सिंचाई रोकें।" : "💧 Soil is over-watered – Stop irrigation to prevent root rot." })
  } else {
    alerts.push({ type: "ok", factor: isHi ? "नमी" : "Moisture", message: isHi ? "✅ मिट्टी की नमी फसल के विकास के लिए सही है।" : "✅ Soil moisture is optimal for crop growth." })
  }

  // Temperature
  if (temp > 38) {
    alerts.push({ type: "error", factor: isHi ? "तापमान" : "Temperature", message: isHi ? `🔥 तापमान बहुत ज्यादा है (${temp}°C) - फसल तनाव में है!` : `🔥 Temperature critically high (>${temp}°C) – Crops under stress!` })
  } else if (temp > 32) {
    alerts.push({ type: "warning", factor: isHi ? "तापमान" : "Temperature", message: isHi ? `🌡 तापमान अधिक है (${temp}°C) - छाया या अतिरिक्त सिंचाई पर विचार करें।` : `🌡 Temperature high (${temp}°C) – Consider shade or extra irrigation.` })
  } else if (temp < 10) {
    alerts.push({ type: "warning", factor: isHi ? "तापमान" : "Temperature", message: isHi ? `❄ तापमान बहुत कम है (${temp}°C) - फसलों को पाले के नुकसान का खतरा।` : `❄ Temperature low (${temp}°C) – Risk of frost damage to crops.` })
  } else {
    alerts.push({ type: "ok", factor: isHi ? "तापमान" : "Temperature", message: isHi ? `✅ तापमान (${temp}°C) सुरक्षित सीमा में है।` : `✅ Temperature (${temp}°C) is in safe range.` })
  }

  // Humidity
  if (humidity > 85) {
    alerts.push({ type: "warning", factor: isHi ? "आर्द्रता" : "Humidity", message: isHi ? `💦 आर्द्रता बहुत अधिक है (${humidity}%) - फफूंद रोग का खतरा।` : `💦 Humidity very high (${humidity}%) – Risk of fungal/mold disease.` })
  } else if (humidity < 30) {
    alerts.push({ type: "warning", factor: isHi ? "आर्द्रता" : "Humidity", message: isHi ? `🏜 आर्द्रता बहुत कम है (${humidity}%) - पानी देने की आवृत्ति बढ़ाएं।` : `🏜 Humidity very low (${humidity}%) – Increase watering frequency.` })
  } else {
    alerts.push({ type: "ok", factor: isHi ? "आर्द्रता" : "Humidity", message: isHi ? `✅ आर्द्रता (${humidity}%) इष्टतम सीमा में है।` : `✅ Humidity (${humidity}%) is in optimal range.` })
  }

  return alerts
}

export default function Sensors() {
  const { t, language } = useLanguage()
  const isHi = language === 'hi'

  const [data, setData] = useState<SensorData>({
    moisture: 45,
    temp: 28,
    humidity: 65,
    timestamp: Date.now()
  })

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await fetch("/api/sensor")
        const json = await res.json()
        const d = json.latest
        setData(d)
        setAlerts(getSmartAlerts(d.moisture, d.temp, d.humidity, language))
        setLastUpdated(new Date().toLocaleTimeString())
      } catch (err) {
        console.error("Error fetching sensor data", err)
      }
    }
    fetchSensorData()
    const interval = setInterval(fetchSensorData, 15000)
    return () => clearInterval(interval)
  }, [language])

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
      <main className="bg-green-50 min-h-screen">
        <Navbar />
        <section className="pt-28 max-w-7xl mx-auto p-10">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            {isHi ? "खेत सेंसर डेटा" : "Farm Sensors Data"}
          </h1>
          <p className="text-gray-500 mb-8">
            🟢 {isHi ? "लाइव सेंसर डेटा" : "Live Sensor Data"} – {isHi ? "पिछली बार अपडेट हुआ" : "Last updated"}: {lastUpdated || (isHi ? "कनेक्ट हो रहा है..." : "connecting...")}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
              <h3 className="font-semibold text-gray-700">{t("dash_soil_moisture")} {isHi ? "सेंसर" : "Sensor"}</h3>
              <p className="text-4xl font-bold text-green-700 mt-3">{data.moisture}%</p>
              <div className="mt-3 bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(data.moisture, 100)}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-1">{isHi ? "स्थिति: सक्रिय" : "Status: Active"}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-400">
              <h3 className="font-semibold text-gray-700">{t("dash_temperature")} {isHi ? "सेंसर" : "Sensor"}</h3>
              <p className="text-4xl font-bold text-orange-500 mt-3">{data.temp}°C</p>
              <div className="mt-3 bg-gray-100 rounded-full h-2">
                <div className="bg-orange-400 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min((data.temp / 50) * 100, 100)}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-1">{isHi ? "स्थिति: सक्रिय" : "Status: Active"}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-700">{t("dash_humidity")} {isHi ? "सेंसर" : "Sensor"}</h3>
              <p className="text-4xl font-bold text-blue-600 mt-3">{data.humidity}%</p>
              <div className="mt-3 bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(data.humidity, 100)}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-1">{isHi ? "स्थिति: सक्रिय" : "Status: Active"}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow mb-10">
            <h2 className="text-xl font-semibold mb-5">{t("dash_alerts_title")}</h2>
            <div className="space-y-3">
              {alerts.length > 0 ? alerts.map((alert, i) => (
                <div key={i} className={`border-l-4 px-4 py-3 rounded-r-lg flex items-start gap-3 ${alertBg[alert.type]}`}>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap ${alertBadge[alert.type]}`}>{alert.factor}</span>
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
              )) : <p className="text-gray-400">{isHi ? "कोई लाइव अलर्ट नहीं है।" : "No live alerts."}</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">{isHi ? "सेंसर रीडिंग तालिका" : "Sensor Readings Table"}</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-500 text-sm">
                  <th className="py-2">{isHi ? "सेंसर" : "Sensor"}</th>
                  <th>{isHi ? "मान" : "Value"}</th>
                  <th>{isHi ? "रेंज" : "Range"}</th>
                  <th>{isHi ? "स्थिति" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-3">🌱 {isHi ? "मिट्टी की नमी" : "Soil Moisture"}</td>
                  <td className="font-semibold">{data.moisture}%</td>
                  <td className="text-gray-400">45–75% {isHi ? "सही" : "optimal"}</td>
                  <td className={data.moisture < 30 ? "text-red-600 font-semibold" : data.moisture < 45 || data.moisture > 75 ? "text-yellow-600" : "text-green-600"}>
                    {data.moisture < 30 ? (isHi ? "गंभीर" : "Critical") : data.moisture < 45 ? (isHi ? "कम" : "Low") : data.moisture > 75 ? (isHi ? "अधिक" : "High") : (isHi ? "✅ सही" : "✅ Optimal")}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">🌡 {isHi ? "तापमान" : "Temperature"}</td>
                  <td className="font-semibold">{data.temp}°C</td>
                  <td className="text-gray-400">10–32°C {isHi ? "सही" : "optimal"}</td>
                  <td className={data.temp > 38 ? "text-red-600 font-semibold" : data.temp > 32 || data.temp < 10 ? "text-yellow-600" : "text-green-600"}>
                    {data.temp > 38 ? (isHi ? "गंभीर" : "Critical") : data.temp > 32 ? (isHi ? "अधिक" : "High") : data.temp < 10 ? (isHi ? "कम" : "Low") : (isHi ? "✅ सही" : "✅ Optimal")}
                  </td>
                </tr>
                <tr>
                  <td className="py-3">💧 {isHi ? "आर्द्रता" : "Humidity"}</td>
                  <td className="font-semibold">{data.humidity}%</td>
                  <td className="text-gray-400">30–85% {isHi ? "सही" : "optimal"}</td>
                  <td className={data.humidity > 85 || data.humidity < 30 ? "text-yellow-600" : "text-green-600"}>
                    {data.humidity > 85 ? (isHi ? "बहुत अधिक" : "Too High") : data.humidity < 30 ? (isHi ? "बहुत कम" : "Too Low") : (isHi ? "✅ सही" : "✅ Optimal")}
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