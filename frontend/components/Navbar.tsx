"use client"

import Link from "next/link"
import { Leaf, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { isLoggedIn, logout } from "../lib/auth"
import { useLanguage } from "../context/LanguageContext"

export default function Navbar({ className = "" }: { className?: string }) {

  const [logged, setLogged] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { t, language, toggleLanguage } = useLanguage()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLogged(isLoggedIn())
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    window.location.href = "/"
  }

  return (
    <nav className={`w-full bg-white/90 backdrop-blur-md shadow-sm fixed top-0 z-50 border-b border-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-green-700 font-bold text-2xl hover:opacity-80 transition-opacity">
          <Leaf className="w-8 h-8" />
          <span className="tracking-tight">KhetMitra</span>
        </Link>

        {/* NAV LINKS */}
        <div className="flex gap-8 font-semibold items-center text-gray-700">
          <Link href="/" className="hover:text-green-600 transition-colors uppercase text-sm tracking-wider">
            {t("nav_home")}
          </Link>

          {logged && (
            <>
              <Link href="/dashboard" className="hover:text-green-600 transition-colors uppercase text-sm tracking-wider">
                {t("nav_dashboard")}
              </Link>
              <Link href="/sensors" className="hover:text-green-600 transition-colors uppercase text-sm tracking-wider">
                {t("nav_sensors")}
              </Link>
              <Link href="/market" className="hover:text-green-600 transition-colors uppercase text-sm tracking-wider">
                {t("nav_market")}
              </Link>
            </>
          )}

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 font-bold text-xs flex items-center gap-1 hover:bg-green-100 transition-colors border border-green-200"
              title="Change Language"
            >
              {language === "en" ? "अ (Hindi)" : "A (English)"}
            </button>

            {/* Auth/Profile */}
            {logged ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-1.5 pr-3 rounded-full hover:bg-white hover:shadow-md transition-all active:scale-95"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* DROPDOWN MENU */}
                {profileOpen && (
                  <>
                    <style jsx>{`
                      @keyframes dropdownFadeIn {
                        from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                      }
                      .dropdown-anim {
                        animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                      }
                    `}</style>
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right dropdown-anim">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest text-left">{t("nav_profile")}</p>
                        <p className="text-sm font-bold text-gray-800 truncate text-left">Sagar Patidar</p>
                      </div>

                      <Link 
                        href="/profile" 
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                      >
                        <User size={16} />
                        {t("nav_my_profile")}
                      </Link>
                      
                      <Link 
                        href="/settings" 
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                      >
                        <Settings size={16} />
                        {t("nav_settings")}
                      </Link>

                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          {t("nav_logout")}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-green-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-green-700 transition-all hover:shadow-lg active:scale-95"
              >
                {t("nav_login")}
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  )
}