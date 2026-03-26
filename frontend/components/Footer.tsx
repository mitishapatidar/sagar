import { useLanguage } from "../context/LanguageContext"

export default function Footer({ className = "" }: { className?: string }) {
  const { t, language } = useLanguage()
  return (

    <footer className={`bg-green-900 text-white mt-20 ${className}`}>

      <div className="max-w-7xl mx-auto p-10 grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-2xl font-bold mb-4">
            KhetMitra
          </h2>

          <p>
            {language === 'en'
              ? "Smart farming platform helping farmers monitor soil conditions and improve crop productivity using AI and IoT sensors."
              : "स्मार्ट फार्मिंग प्लेटफॉर्म जो किसानों को मिट्टी की स्थिति की निगरानी करने और AI और IoT सेंसर का उपयोग करके फसल उत्पादकता में सुधार करने में मदद करता है।"}
          </p>
        </div>

        <div>

          <h3 className="text-xl font-semibold mb-4">
            {language === 'en' ? "Contact Us" : "संपर्क करें"}
          </h3>

          <p>{language === 'en' ? "Email" : "ईमेल"} : support@khetmitra.com</p>
          <p>{language === 'en' ? "Phone" : "फोन"} : +91 9823345187</p>
          <p>{language === 'en' ? "Location" : "स्थान"} : Maharashtra, India</p>

        </div>

        <div>

          <h3 className="text-xl font-semibold mb-4">
            {language === 'en' ? "Quick Links" : "त्वरित लिंक"}
          </h3>

          <p>{t("nav_dashboard")}</p>
          <p>{t("nav_sensors")}</p>
          <p>{language === 'en' ? "AI Recommendation" : "AI सलाह"}</p>

        </div>

      </div>

      <div className="text-center py-4 bg-green-950">
        © 2026 KhetMitra. {language === 'en' ? "All Rights Reserved." : "सर्वाधिकार सुरक्षित।"}
      </div>

    </footer>

  )
}