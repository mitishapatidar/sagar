"use client"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProtectedRoute from "../../components/ProtectedRoute"
import { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import FarmReport from "../../components/FarmReport"
import { useLanguage } from "../../context/LanguageContext"

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

function getSmartAlerts(moisture: number, temp: number, humidity: number, lang: string): Alert[] {
  const alerts: Alert[] = []

  // Moisture alerts
  if (moisture < 30) {
    alerts.push({ type: "error", message: lang === 'en' ? "🚨 Soil critically dry! Irrigate immediately." : "🚨 मिट्टी बहुत सूखी है! तुरंत सिंचाई करें।" })
  } else if (moisture < 45) {
    alerts.push({ type: "warning", message: lang === 'en' ? "⚠ Soil moisture low – Start irrigation soon." : "⚠ मिट्टी की नमी कम है – जल्द ही सिंचाई शुरू करें।" })
  } else if (moisture > 75) {
    alerts.push({ type: "warning", message: lang === 'en' ? "💧 Soil over-watered – Stop irrigation." : "💧 मिट्टी में पानी ज्यादा है – सिंचाई रोकें।" })
  } else {
    alerts.push({ type: "ok", message: lang === 'en' ? "✅ Soil moisture optimal for crop growth." : "✅ मिट्टी की नमी फसल की वृद्धि के लिए सही है।" })
  }

  // Temperature alerts
  if (temp > 38) {
    alerts.push({ type: "error", message: lang === 'en' ? "🔥 Temperature critically high! Risk of crop stress." : "🔥 तापमान बहुत ज्यादा है! फसल को नुकसान का खतरा।" })
  } else if (temp > 32) {
    alerts.push({ type: "warning", message: lang === 'en' ? "🌡 High temperature – Consider shade or extra watering." : "🌡 तापमान अधिक है – छाया या अतिरिक्त पानी का ध्यान रखें।" })
  } else if (temp < 10) {
    alerts.push({ type: "warning", message: lang === 'en' ? "❄ Low temperature – Risk of frost damage." : "❄ कम तापमान – पाले के नुकसान का खतरा।" })
  }

  // Humidity alerts
  if (humidity > 85) {
    alerts.push({ type: "warning", message: lang === 'en' ? "💦 Humidity very high – Risk of fungal disease." : "💦 आर्द्रता बहुत अधिक है – फफूंद रोग का खतरा।" })
  } else if (humidity < 30) {
    alerts.push({ type: "warning", message: lang === 'en' ? "🏜 Low humidity – Increase watering frequency." : "🏜 कम आर्द्रता – पानी देने की आवृत्ति बढ़ाएं।" })
  }

  // Combined condition alert
  if (moisture < 45 && temp > 32) {
    alerts.push({ type: "error", message: lang === 'en' ? "🚨 Dry + Hot combo – Urgent irrigation needed!" : "🚨 सूखा + गर्म कॉम्बो – तत्काल सिंचाई की आवश्यकता!" })
  }

  return alerts
}

export default function Dashboard() {

  const { t, language } = useLanguage()

  const [data, setData] = useState<SensorPoint[]>([
    { time: "", moisture: 45, temp: 27, humidity: 60 }
  ])
  const [latest, setLatest] = useState({ moisture: 45, temp: 27, humidity: 60 })
  const [alerts, setAlerts] = useState<Alert[]>([])
  
  const [crop, setCrop] = useState(language === 'en' ? "Click on map to select farm location" : "खेत का स्थान चुनने के लिए मैप पर क्लिक करें")
  const [location, setLocation] = useState(language === 'en' ? "No location selected" : "कोई स्थान नहीं चुना गया")
  const [reportData, setReportData] = useState<{ name: string; tips: string; soil: string } | null>(null)
  const [rawCoords, setRawCoords] = useState<{ lat: number; lng: number } | null>(null)

  const [isWeekly, setIsWeekly] = useState(false)

  const downloadPDF = (weekly: boolean = false) => {
    setIsWeekly(weekly)
    setTimeout(() => {
      window.print()
      setTimeout(() => setIsWeekly(false), 1000)
    }, 100)
  }

  const generateWeeklyData = () => {
    const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysHi = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
    const days = language === 'hi' ? daysHi : daysEn;
    const today = new Date().getDay();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      let dayIndex = (today - i) % 7;
      if (dayIndex < 0) dayIndex += 7;
      const driftM = Math.floor(Math.random() * 10) - 5;
      const driftT = (Math.random() * 4) - 2;
      const driftH = Math.floor(Math.random() * 8) - 4;
      result.push({
        day: i === 0 ? (language === 'hi' ? "आज" : "Today") : days[dayIndex],
        moisture: Math.max(0, Math.min(100, latest.moisture + driftM)),
        temp: Number(Math.max(0, Math.min(50, latest.temp + driftT)).toFixed(1)),
        humidity: Math.max(0, Math.min(100, latest.humidity + driftH))
      });
    }
    return result;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor")
        const json = await res.json()
        if (json.history && json.history.length > 0) {
          setData(json.history.slice(-20))
        } else {
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
        setAlerts(getSmartAlerts(json.latest.moisture, json.latest.temp, json.latest.humidity, language))
      } catch (err) {
        console.error("Error fetching sensor data", err)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [language, latest.moisture, latest.temp, latest.humidity])

  return (
    <ProtectedRoute>
      <Navbar />
      
      <main className="pt-24 min-h-screen p-6 max-w-7xl mx-auto print:p-0 print:max-w-none bg-green-50">
        
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-green-700">
            {t("dashboard_title")}
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={() => downloadPDF(true)}
              className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2.5 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors active:scale-95"
            >
              {t("btn_weekly_report")}
            </button>
            <button 
              onClick={() => downloadPDF(false)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium shadow flex items-center gap-2 transition-colors active:scale-95"
            >
              {t("btn_live_report")}
            </button>
          </div>
        </div>

        <p className="text-gray-500 mb-6">
          {t("dashboard_live_data")}
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="font-semibold text-gray-600">{t("dash_soil_moisture")}</h3>
            <p className="text-3xl font-bold text-green-700 mt-2">{latest.moisture}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-400">
            <h3 className="font-semibold text-gray-600">{t("dash_temperature")}</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">{latest.temp}°C</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-600">{t("dash_humidity")}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{latest.humidity}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-400">
            <h3 className="font-semibold text-gray-600">{t("dash_readings")}</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{data.length}</p>
            <p className="text-xs text-gray-400 mt-1">{t("dash_readings_sub")}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">{t("dash_alerts_title")}</h2>
          <div className="space-y-3">
            {alerts.length > 0 ? alerts.map((alert, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-lg border flex items-center gap-3 ${
                  alert.type === "error" ? "bg-red-50 border-red-200 text-red-800" :
                  alert.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" :
                  "bg-green-50 border-green-200 text-green-800"
                }`}
              >
                {alert.message}
              </div>
            )) : <p className="text-gray-400">{language === 'hi' ? "कोई अलर्ट नहीं है।" : "No active alerts."}</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold mb-6">{t("realtime_trends_title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-2">
              <h3 className="font-semibold mb-4 text-green-700">{t("graph_soil_moisture")}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} width={30} fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="moisture" stroke="#16a34a" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="p-2">
              <h3 className="font-semibold mb-4 text-orange-600">{t("graph_temperature")}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 50]} width={30} fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#f97316" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="p-2">
              <h3 className="font-semibold mb-4 text-blue-600">{t("graph_humidity")}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} width={30} fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow mb-10">
          <h2 className="text-2xl font-semibold mb-4">{t("ai_recommendation_title")}</h2>
          <p className="text-gray-600 mb-4">{t("ai_recommendation_desc")}</p>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-6">
             <p className="font-medium">{t("ai_selected_location")}: <span className="text-green-800">{location}</span></p>
             <p className="text-xl font-bold text-green-700 mt-2">
               {language === 'hi' ? "सुझाई गई फसल" : "Recommended Crop"}: {crop}
             </p>
          </div>
          <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200">
            <FarmMap 
              setCrop={setCrop} 
              setLocation={setLocation} 
              setReportData={setReportData}
              setRawCoords={setRawCoords}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-10">
          <Link href="/sensors" className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 shadow-md font-medium transition">
            {t("nav_sensors")}
          </Link>
          <Link href="/backend-sensor" className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 shadow-md font-medium transition">
             Backend Monitor
          </Link>
        </div>

      </main>

      <Footer />

      {/* Visible only when printing */}
      <div className="hidden print:block w-full absolute top-0 left-0 bg-white min-h-screen z-50">
        <FarmReport 
          moisture={latest.moisture}
          temperature={latest.temp}
          humidity={latest.humidity}
          recommendation={reportData}
          location={rawCoords}
          date={new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          weeklyData={isWeekly ? generateWeeklyData() : undefined}
        />
      </div>
    </ProtectedRoute>
  )
}