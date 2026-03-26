"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Dictionary for Translations
const translations = {
  en: {
    // Navbar
    nav_home: "Home",
    nav_dashboard: "Dashboard",
    nav_sensors: "Farm Sensors",
    nav_login: "Login / Sign Up",
    nav_logout: "Logout",
    nav_profile: "Profile",
    nav_settings: "Settings",
    nav_my_profile: "My Profile",

    // Home Page - Hero
    hero_title: "Smart Farming Assistant",
    hero_subtitle: "AI-powered crop recommendations, real-time sensor monitoring, and complete farm management right at your fingertips.",
    hero_cta_primary: "Get Started",
    hero_cta_secondary: "View Field Data",
    
    // Home Page - Stats
    stat_sensors: "Active Sensors",
    stat_crops: "Crop Types",
    stat_regions: "Monitored Regions",
    
    // Dashboard
    dashboard_title: "Farm Dashboard",
    dashboard_live_data: "🟢 Live Data – Updating every 15 seconds",
    dash_soil_moisture: "Soil Moisture",
    dash_temperature: "Temperature",
    dash_humidity: "Humidity",
    dash_readings: "Readings Stored",
    dash_readings_sub: "In session",
    
    dash_alerts_title: "🚿 Smart Irrigation Alerts",
    dash_reports_title: "📄 Farm Reports",
    dash_reports_desc: "Generate printable farm reports with actionable recommendations.",
    btn_weekly_report: "Weekly Report",
    btn_live_report: "Live Report (PDF)",
    
    // Graphs
    realtime_trends_title: "Real-time Trends",
    graph_soil_moisture: "Soil Moisture",
    graph_temperature: "Temperature",
    graph_humidity: "Humidity",
    
    // Map
    map_title: "📍 Farm Location & AI Recommendation",
    map_desc: "Click on your region to get AI-powered crop suggestions tailored to your agro-climatic zone.",

    // AI Recommendation
    ai_recommendation_title: "AI Crop Recommendation",
    ai_recommendation_desc: "Click on the map to select your farm location. AI will recommend crops suitable for that region.",
    ai_selected_location: "Selected Location",
  },
  hi: {
    // Navbar
    nav_home: "होम (Home)",
    nav_dashboard: "डैशबोर्ड (Dashboard)",
    nav_sensors: "सेंसर (Sensors)",
    nav_login: "लॉगिन करें (Login)",
    nav_logout: "लॉगआउट (Logout)",
    nav_profile: "प्रोफ़ाइल (Profile)",
    nav_settings: "सेटिंग्स (Settings)",
    nav_my_profile: "मेरी प्रोफ़ाइल",

    // Home Page - Hero
    hero_title: "स्मार्ट फार्मिंग असिस्टेंट",
    hero_subtitle: "AI आधारित फसल सलाह, रियल-टाइम सेंसर मॉनिटरिंग और संपूर्ण कृषि प्रबंधन अब आपकी उंगलियों पर।",
    hero_cta_primary: "शुरू करें",
    hero_cta_secondary: "खेत का डेटा देखें",
    
    // Home Page - Stats
    stat_sensors: "सक्रिय सेंसर",
    stat_crops: "फसलों के प्रकार",
    stat_regions: "निगरानी क्षेत्र",
    
    // Dashboard
    dashboard_title: "फार्म डैशबोर्ड",
    dashboard_live_data: "🟢 लाइव डेटा - हर 15 सेकंड में अपडेट",
    dash_soil_moisture: "मिट्टी की नमी",
    dash_temperature: "तापमान",
    dash_humidity: "आर्द्रता (Humidity)",
    dash_readings: "सहेजे गए डेटा",
    dash_readings_sub: "इस सत्र में",
    
    dash_alerts_title: "🚿 स्मार्ट सिंचाई अलर्ट",
    dash_reports_title: "📄 खेत की रिपोर्ट",
    dash_reports_desc: "सलाह के साथ प्रिंट करने योग्य खेत की रिपोर्ट जनरेट करें।",
    btn_weekly_report: "साप्ताहिक रिपोर्ट",
    btn_live_report: "लाइव रिपोर्ट (PDF)",

    // Graphs
    realtime_trends_title: "लाइव रुझान (Real-time Trends)",
    graph_soil_moisture: "मिट्टी की नमी",
    graph_temperature: "तापमान",
    graph_humidity: "आर्द्रता",
    
    // Map
    map_title: "📍 खेत का स्थान और AI सलाह",
    map_desc: "अपने क्षेत्र की जलवायु के अनुसार AI आधारित फसल सलाह पाने के लिए मैप पर क्लिक करें।",

    // AI Recommendation
    ai_recommendation_title: "AI फसल सलाह",
    ai_recommendation_desc: "अपने खेत का स्थान चुनने के लिए मैप पर क्लिक करें। AI उस क्षेत्र के लिए उपयुक्त फसलों की सिफारिश करेगा।",
    ai_selected_location: "चुना गया स्थान",
  }
};

type Language = "en" | "hi";

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem("khetmitra_lang") as Language;
    if (storedLang && (storedLang === "en" || storedLang === "hi")) {
      setLanguage(storedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    localStorage.setItem("khetmitra_lang", newLang);
  };

  const t = (key: keyof typeof translations.en): string => {
    if (!mounted) return translations["en"][key]; // Default to English during SSR
    return translations[language][key] || translations["en"][key];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
