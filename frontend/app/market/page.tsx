"use client"

import { useLanguage } from "../../context/LanguageContext"
import ProtectedRoute from "../../components/ProtectedRoute"
import Link from "next/link"
import { Store, Briefcase, TrendingUp, ArrowRight, CheckCircle2, Building2, Globe, Home, LayoutDashboard } from "lucide-react"

export default function MarketPage() {
  const { t } = useLanguage()

  const activeBids = [
    { id: 1, company: "Reliance Retail", crop: "Paddy (Rice)", price: "₹2,450/quintal", quantity: "500 Tons", location: "Pan India" },
    { id: 2, company: "Tata Consumer Products", crop: "Pulses (Dal)", price: "₹7,800/quintal", quantity: "120 Tons", location: "Madhya Pradesh" },
    { id: 3, company: "BigBasket", crop: "Organic Vegetables", price: "Premium (+20%)", quantity: "Daily Supply", location: "Maharashtra" },
    { id: 4, company: "Adani Wilmar", crop: "Mustard Seeds", price: "₹5,600/quintal", quantity: "300 Tons", location: "Rajasthan" },
    { id: 5, company: "ITC Limited", crop: "Wheat (Sharbati)", price: "₹3,200/quintal", quantity: "1000 Tons", location: "Central India" },
  ]

  const marketTrends = [
    { crop: "Soybean", price: "₹4,850", change: "+2.4%", up: true },
    { crop: "Garlic", price: "₹12,000", change: "-1.2%", up: false },
    { crop: "Onion", price: "₹3,500", change: "+15.0%", up: true },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">
                  <Store size={16} />
                  <span>{t("nav_market")}</span>
                </div>
                <Link href="/" className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                  <Home size={16} />
                  <span>{t("nav_home")}</span>
                </Link>
                <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                  <LayoutDashboard size={16} />
                  <span>{t("nav_dashboard")}</span>
                </Link>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                {t("market_title")}
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                {t("market_subtitle")}
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                {t("market_add_crop")}
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="w-full md:w-1/3 grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <Building2 className="text-green-600 mb-3" size={32} />
                <p className="text-2xl font-bold">50+</p>
                <p className="text-sm text-gray-500">Partner Companies</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <Globe className="text-blue-600 mb-3" size={32} />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-500">States Covered</p>
              </div>
              <div className="col-span-2 bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Daily Transactions</p>
                  <p className="text-2xl font-bold">₹1.2 Cr+</p>
                </div>
                <TrendingUp className="text-orange-500" size={40} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Active Bids Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Briefcase className="text-green-600" />
                  {t("market_active_bids")}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-400">
                    <tr>
                      <th className="px-6 py-4">{t("market_company")}</th>
                      <th className="px-6 py-4">{t("market_crop")}</th>
                      <th className="px-6 py-4">{t("market_price")}</th>
                      <th className="px-6 py-4">{t("market_quantity")}</th>
                      <th className="px-6 py-4 text-center">{t("market_action")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activeBids.map((bid) => (
                      <tr key={bid.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-5">
                          <p className="font-bold text-gray-800">{bid.company}</p>
                          <p className="text-xs text-gray-400">{bid.location}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            {bid.crop}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-bold text-gray-900">{bid.price}</td>
                        <td className="px-6 py-5 text-gray-600">{bid.quantity}</td>
                        <td className="px-6 py-5 text-center">
                          <button className="bg-gray-100 group-hover:bg-green-600 group-hover:text-white text-gray-600 px-4 py-1.5 rounded-lg text-sm font-bold transition-all">
                            {t("market_action")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Trends */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className="text-orange-500" />
                  {t("market_trends")}
                </h3>
                <div className="space-y-4">
                  {marketTrends.map((trend, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                      <div>
                        <p className="font-bold text-gray-800">{trend.crop}</p>
                        <p className="text-xs text-gray-400">Rate: {trend.price}</p>
                      </div>
                      <div className={`text-right ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
                        <p className="font-bold">{trend.change}</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest">{trend.up ? 'Up' : 'Down'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">Direct Support</h3>
                  <p className="text-green-100 text-sm mb-6 leading-relaxed">
                    KhetMitra ensures you get fair market value. Contact our field agents for logistics support.
                  </p>
                  <button className="w-full bg-white text-green-700 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors">
                    Talk to Agent
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10">
                  <CheckCircle2 size={180} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
