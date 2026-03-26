"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "../lib/auth"
import { useLanguage } from "../context/LanguageContext"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

  const router = useRouter()
  const { language } = useLanguage()
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (isLoggedIn()) {
      setAuthorized(true)
    } else {
      router.replace("/login")
    }
    setChecking(false)
  }, [router])

  if (checking || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">
            {language === 'hi' ? "प्रमाणीकरण की जाँच हो रही है..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
