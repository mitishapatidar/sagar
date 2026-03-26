import React from 'react';
import { Droplet, Thermometer, CloudRain, MapPin, Leaf, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface FarmReportProps {
  moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  recommendation: { name: string; tips: string; soil: string } | null;
  location: { lat: number; lng: number } | null;
  date: string;
}

export default function FarmReport({
  moisture,
  temperature,
  humidity,
  recommendation,
  location,
  date,
}: FarmReportProps) {

  // Helper to determine status and colors
  const getStatus = (value: number | null, type: 'moisture' | 'temp' | 'humidity') => {
    if (value === null) return { color: "text-gray-500", bg: "bg-gray-100", icon: <AlertCircle />, text: "N/A", hindiText: "उपलब्ध नहीं" };
    
    if (type === 'moisture') {
      if (value < 30) return { color: "text-red-500", bg: "bg-red-50", icon: <AlertTriangle />, text: "Too Dry", hindiText: "बहुत सूखा (पानी दें)" };
      if (value > 80) return { color: "text-blue-600", bg: "bg-blue-50", icon: <AlertCircle />, text: "Too Wet", hindiText: "बहुत गीला (पानी रोकें)" };
      return { color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle2 />, text: "Optimal", hindiText: "बिल्कुल सही" };
    }
    
    if (type === 'temp') {
      if (value < 10) return { color: "text-blue-500", bg: "bg-blue-50", icon: <AlertCircle />, text: "Too Cold", hindiText: "बहुत ठंडा" };
      if (value > 35) return { color: "text-red-500", bg: "bg-red-50", icon: <AlertTriangle />, text: "Too Hot", hindiText: "बहुत गर्म" };
      return { color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle2 />, text: "Good", hindiText: "सही तापमान" };
    }

    if (type === 'humidity') {
      if (value < 30) return { color: "text-amber-500", bg: "bg-amber-50", icon: <AlertCircle />, text: "Low", hindiText: "कम नमी" };
      if (value > 80) return { color: "text-blue-500", bg: "bg-blue-50", icon: <AlertCircle />, text: "High", hindiText: "अधिक नमी" };
      return { color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle2 />, text: "Optimal", hindiText: "बिल्कुल सही" };
    }

    return { color: "text-gray-500", bg: "bg-gray-100", icon: <AlertCircle />, text: "Unknown", hindiText: "अज्ञात" };
  };

  const mStatus = getStatus(moisture, 'moisture');
  const tStatus = getStatus(temperature, 'temp');
  const hStatus = getStatus(humidity, 'humidity');

  return (
    <div className="bg-white text-black p-8 mx-auto" style={{ width: '800px', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center border-b-4 border-green-600 pb-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-green-700 flex items-center gap-3">
            <Leaf size={40} /> KhetMitra Report
          </h1>
          <p className="text-gray-600 text-lg mt-1 font-medium">खेत मित्र - स्मार्ट फार्मिंग रिपोर्ट</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 font-medium">Date / तारीख:</p>
          <p className="text-xl font-bold">{date}</p>
        </div>
      </div>

      {/* Main Sensor Data */}
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">1. Current Farm Conditions (खेती की वर्तमान स्थिति)</h2>
      <div className="grid grid-cols-3 gap-6 mb-8">
        
        {/* Moisture */}
        <div className={`p-6 rounded-2xl border-2 border-gray-100 shadow-sm flex flex-col items-center text-center ${mStatus.bg}`}>
          <Droplet size={48} className={mStatus.color} />
          <h3 className="text-xl font-bold mt-3">Soil Moisture</h3>
          <p className="text-gray-600">मिट्टी की नमी</p>
          <p className="text-4xl font-extrabold my-3">{moisture !== null ? `${moisture}%` : '--'}</p>
          <div className={`flex items-center gap-2 font-bold text-lg ${mStatus.color}`}>
            {mStatus.icon} {mStatus.text}
          </div>
          <p className={`font-bold text-md mt-1 ${mStatus.color}`}>{mStatus.hindiText}</p>
        </div>

        {/* Temperature */}
        <div className={`p-6 rounded-2xl border-2 border-gray-100 shadow-sm flex flex-col items-center text-center ${tStatus.bg}`}>
          <Thermometer size={48} className={tStatus.color} />
          <h3 className="text-xl font-bold mt-3">Temperature</h3>
          <p className="text-gray-600">तापमान</p>
          <p className="text-4xl font-extrabold my-3">{temperature !== null ? `${temperature.toFixed(1)}°C` : '--'}</p>
          <div className={`flex items-center gap-2 font-bold text-lg ${tStatus.color}`}>
            {tStatus.icon} {tStatus.text}
          </div>
          <p className={`font-bold text-md mt-1 ${tStatus.color}`}>{tStatus.hindiText}</p>
        </div>

        {/* Humidity */}
        <div className={`p-6 rounded-2xl border-2 border-gray-100 shadow-sm flex flex-col items-center text-center ${hStatus.bg}`}>
          <CloudRain size={48} className={hStatus.color} />
          <h3 className="text-xl font-bold mt-3">Humidity</h3>
          <p className="text-gray-600">हवा में नमी</p>
          <p className="text-4xl font-extrabold my-3">{humidity !== null ? `${humidity}%` : '--'}</p>
          <div className={`flex items-center gap-2 font-bold text-lg ${hStatus.color}`}>
            {hStatus.icon} {hStatus.text}
          </div>
          <p className={`font-bold text-md mt-1 ${hStatus.color}`}>{hStatus.hindiText}</p>
        </div>

      </div>

      {/* AI Recommendation */}
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">2. AI Crop Recommendation (फसल की सलाह)</h2>
      <div className="bg-green-50 border border-green-200 p-6 rounded-2xl mb-8">
        {recommendation ? (
          <div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Recommended Crops: <span className="text-green-600">{recommendation.name}</span></h3>
            <p className="text-lg text-gray-700 mb-4 font-medium">सलाह: इन फसलों की खेती आपके क्षेत्र के लिए सबसे अच्छी रहेगी।</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-green-100">
                <p className="font-bold text-green-800 mb-1">💡 Best Practices (सुझाव):</p>
                <p className="text-gray-700">{recommendation.tips}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-green-100">
                <p className="font-bold text-orange-800 mb-1">🌍 Soil Type (मिट्टी का प्रकार):</p>
                <p className="text-gray-700">{recommendation.soil}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 italic">No region selected for recommendation. (नक्शे पर कोई जगह नहीं चुनी गई है।)</p>
        )}
      </div>

      {/* Location specifics */}
      {location && (
        <div className="flex items-center gap-2 text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg w-fit">
          <MapPin size={20} />
          <span>Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 pt-6 border-t-2 border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">Generated automatically by KhetMitra System</p>
        <p className="text-xs text-gray-400 mt-1">Visit www.khetmitra.com for live updates • For help, ask the KhetMitra AI Chatbot</p>
      </div>

    </div>
  );
}
