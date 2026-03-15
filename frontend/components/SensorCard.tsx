type Props = {
  title: string
  value: string
  unit: string
}

export default function SensorCard({ title, value, unit }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">

      <h3 className="text-gray-600 text-lg font-medium">
        {title}
      </h3>

      <p className="text-4xl font-bold text-green-600 mt-3">
        {value} {unit}
      </p>

    </div>
  )
}