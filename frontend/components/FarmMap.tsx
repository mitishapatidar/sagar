"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

// ─── Indian Agro-Climatic Region Database ────────────────────────────────────
// Each region has a bounding box (lat/lon) and region-specific crops
type AgroRegion = {
  name: string
  latMin: number
  latMax: number
  lonMin: number
  lonMax: number
  crops: string
  soil: string
}

const AGRO_REGIONS: AgroRegion[] = [
  // ── North India ──
  { name: "Jammu & Kashmir", latMin: 32.5, latMax: 37, lonMin: 73, lonMax: 80, crops: "Saffron, Apple, Walnut, Rice, Maize", soil: "Mountain Soil" },
  { name: "Himachal Pradesh", latMin: 30.5, latMax: 33.2, lonMin: 75.5, lonMax: 79, crops: "Apple, Tea, Barley, Potato, Ginger", soil: "Mountain Soil" },
  { name: "Punjab", latMin: 29.5, latMax: 32.5, lonMin: 73.8, lonMax: 76.8, crops: "Wheat, Rice, Cotton, Maize, Sugarcane", soil: "Alluvial Soil" },
  { name: "Haryana", latMin: 27.5, latMax: 30.5, lonMin: 74.5, lonMax: 77.5, crops: "Wheat, Rice, Bajra, Mustard, Sugarcane", soil: "Alluvial Soil" },
  { name: "Uttarakhand", latMin: 28.7, latMax: 31.5, lonMin: 77, lonMax: 81, crops: "Basmati Rice, Lentils, Mandarin, Litchi", soil: "Mountain/Alluvial" },
  { name: "Delhi NCR", latMin: 28.3, latMax: 29, lonMin: 76.8, lonMax: 77.4, crops: "Vegetables, Flowers, Wheat, Mustard", soil: "Alluvial Soil" },

  // ── Uttar Pradesh (split) ──
  { name: "UP (Western)", latMin: 27, latMax: 30, lonMin: 77, lonMax: 80, crops: "Sugarcane, Wheat, Rice, Potato, Mango", soil: "Alluvial Soil" },
  { name: "UP (Eastern)", latMin: 24, latMax: 28, lonMin: 80, lonMax: 84, crops: "Rice, Wheat, Lentil (Masoor), Mustard", soil: "Alluvial Soil" },

  // ── Rajasthan (split) ──
  { name: "Rajasthan (Thar/West)", latMin: 24, latMax: 30, lonMin: 69, lonMax: 73, crops: "Bajra, Guar, Moth, Cumin, Mustard", soil: "Desert/Sandy Soil" },
  { name: "Rajasthan (East)", latMin: 24, latMax: 28, lonMin: 73, lonMax: 77, crops: "Wheat, Barley, Soybean, Coriander, Gram", soil: "Alluvial/Black Soil" },
  { name: "Rajasthan (Hadoti/SE)", latMin: 23, latMax: 26, lonMin: 75, lonMax: 77.5, crops: "Soybean, Maize, Wheat, Orange, Garlic", soil: "Black Soil" },

  // ── Central India ──
  { name: "Madhya Pradesh (Malwa)", latMin: 22, latMax: 24.5, lonMin: 74, lonMax: 78, crops: "Soybean, Wheat, Gram, Cotton, Garlic", soil: "Black Soil" },
  { name: "Madhya Pradesh (East)", latMin: 22, latMax: 25, lonMin: 78, lonMax: 82, crops: "Rice, Wheat, Tuar Dal, Sesame, Maize", soil: "Mixed Alluvial" },
  { name: "Chhattisgarh", latMin: 19, latMax: 24, lonMin: 80, lonMax: 84, crops: "Rice, Maize, Kodo-Kutki, Lakh, Sal", soil: "Red & Yellow Soil" },

  // ── East India ──
  { name: "Bihar", latMin: 24, latMax: 27, lonMin: 83, lonMax: 88.5, crops: "Rice, Wheat, Maize, Litchi, Makhana", soil: "Alluvial Soil" },
  { name: "Jharkhand", latMin: 21.5, latMax: 25, lonMin: 83, lonMax: 87.5, crops: "Rice, Maize, Arhar, Vegetables, Lac", soil: "Red Soil" },
  { name: "West Bengal", latMin: 21.5, latMax: 27, lonMin: 86, lonMax: 89.5, crops: "Rice, Jute, Tea, Potato, Mustard", soil: "Alluvial/Laterite" },
  { name: "Odisha", latMin: 17.5, latMax: 22.5, lonMin: 81, lonMax: 87.5, crops: "Rice, Groundnut, Sugarcane, Turmeric, Jute", soil: "Red/Laterite Soil" },

  // ── Northeast ──
  { name: "Assam", latMin: 24, latMax: 28, lonMin: 89, lonMax: 96, crops: "Tea, Rice, Jute, Sugarcane, Bamboo", soil: "Alluvial Soil" },
  { name: "Northeast Hills", latMin: 22, latMax: 28, lonMin: 91, lonMax: 97.5, crops: "Pineapple, Orange, Ginger, Turmeric, Jhum Rice", soil: "Laterite/Forest Soil" },

  // ── West India ──
  { name: "Gujarat (Saurashtra)", latMin: 20.5, latMax: 23.5, lonMin: 69, lonMax: 72, crops: "Groundnut, Cotton, Sesame, Bajra, Cumin", soil: "Black/Sandy Soil" },
  { name: "Gujarat (Central)", latMin: 21.5, latMax: 24, lonMin: 72, lonMax: 74, crops: "Cotton, Tobacco, Banana, Rice, Mango", soil: "Alluvial/Black" },
  { name: "Maharashtra (Vidarbha)", latMin: 19.5, latMax: 22, lonMin: 76, lonMax: 80.5, crops: "Cotton, Soybean, Orange, Tuar, Jowar", soil: "Black Soil" },
  { name: "Maharashtra (Western Ghats)", latMin: 16, latMax: 20, lonMin: 73, lonMax: 75, crops: "Rice, Cashew, Mango, Coconut, Spices", soil: "Laterite Soil" },
  { name: "Maharashtra (Marathwada)", latMin: 18, latMax: 20.5, lonMin: 75, lonMax: 78, crops: "Jowar, Bajra, Cotton, Sugarcane, Banana", soil: "Medium Black Soil" },
  { name: "Goa", latMin: 14.8, latMax: 15.8, lonMin: 73.5, lonMax: 74.5, crops: "Coconut, Rice, Cashew, Arecanut, Fish", soil: "Laterite Soil" },

  // ── South India ──
  { name: "Karnataka (North)", latMin: 15, latMax: 18, lonMin: 74, lonMax: 77.5, crops: "Jowar, Sugarcane, Cotton, Sunflower, Gram", soil: "Black Soil" },
  { name: "Karnataka (South/Coastal)", latMin: 12, latMax: 15, lonMin: 74, lonMax: 77, crops: "Coffee, Pepper, Arecanut, Rice, Ragi", soil: "Laterite/Red Soil" },
  { name: "Kerala", latMin: 8, latMax: 12.5, lonMin: 74.8, lonMax: 77.5, crops: "Coconut, Rubber, Tea, Cardamom, Pepper", soil: "Laterite Soil" },
  { name: "Tamil Nadu (Cauvery Delta)", latMin: 10, latMax: 12, lonMin: 78.5, lonMax: 80, crops: "Rice, Sugarcane, Banana, Coconut, Groundnut", soil: "Alluvial Soil" },
  { name: "Tamil Nadu (Western)", latMin: 10, latMax: 12, lonMin: 76.5, lonMax: 78, crops: "Tea, Coffee, Pepper, Cardamom, Vegetables", soil: "Red/Laterite Soil" },
  { name: "Tamil Nadu (South)", latMin: 8, latMax: 10, lonMin: 77, lonMax: 79.5, crops: "Banana, Jasmine, Rice, Palmyra, Neem", soil: "Red Sandy Soil" },
  { name: "Andhra Pradesh (Coastal)", latMin: 14, latMax: 18, lonMin: 79, lonMax: 82.5, crops: "Rice, Chilli, Cotton, Tobacco, Mango", soil: "Alluvial/Black" },
  { name: "Andhra Pradesh (Rayalaseema)", latMin: 13, latMax: 16, lonMin: 77, lonMax: 80, crops: "Groundnut, Sunflower, Jowar, Ragi, Tamarind", soil: "Red Soil" },
  { name: "Telangana", latMin: 15.5, latMax: 19.5, lonMin: 77, lonMax: 81, crops: "Rice, Cotton, Maize, Turmeric, Chilli", soil: "Red/Black Soil" },
]

function findRegion(lat: number, lon: number): { region: string; crops: string; soil: string } {
  // Find best matching region — smallest bounding box that contains the point
  let bestMatch: AgroRegion | null = null
  let bestArea = Infinity

  for (const r of AGRO_REGIONS) {
    if (lat >= r.latMin && lat <= r.latMax && lon >= r.lonMin && lon <= r.lonMax) {
      const area = (r.latMax - r.latMin) * (r.lonMax - r.lonMin)
      if (area < bestArea) {
        bestArea = area
        bestMatch = r
      }
    }
  }

  if (bestMatch) {
    return { region: bestMatch.name, crops: bestMatch.crops, soil: bestMatch.soil }
  }

  // Fallback — find nearest region by distance
  let nearestDist = Infinity
  let nearest: AgroRegion = AGRO_REGIONS[0]

  for (const r of AGRO_REGIONS) {
    const cLat = (r.latMin + r.latMax) / 2
    const cLon = (r.lonMin + r.lonMax) / 2
    const dist = Math.sqrt((lat - cLat) ** 2 + (lon - cLon) ** 2)
    if (dist < nearestDist) {
      nearestDist = dist
      nearest = r
    }
  }

  return { region: nearest.name + " (nearest)", crops: nearest.crops, soil: nearest.soil }
}


function LocationMarker({ setLocation, setCrop }: any) {

  const [position, setPosition] = useState<any>(null)

  useMapEvents({
    click(e: any) {
      const lat = e.latlng.lat
      const lon = e.latlng.lng

      setPosition(e.latlng)
      setLocation(`Lat: ${lat.toFixed(3)}, Lon: ${lon.toFixed(3)}`)

      const result = findRegion(lat, lon)
      setCrop(`${result.crops}  (${result.region} — ${result.soil})`)
    }
  })

  return position === null ? null : (
    <Marker position={position} icon={markerIcon} />
  )
}

export default function FarmMap({ setLocation, setCrop }: any) {
  return (
    <MapContainer
      center={[22.9734, 78.6569]}
      zoom={5}
      style={{ height: "350px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setLocation={setLocation} setCrop={setCrop} />
    </MapContainer>
  )
}