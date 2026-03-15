"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-green-50 pt-20">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 p-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <h1 className="text-5xl font-bold text-green-800">
            Smart Farming with AI
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            KhetMitra helps farmers monitor soil health
            and improve crop yield using AI & IoT.
          </p>

          <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">
            Explore Dashboard
          </button>

        </motion.div>

        <img
          src="/farm.jpg"
          className="rounded-xl shadow-xl"
        />

      </div>

    </section>
  )
}