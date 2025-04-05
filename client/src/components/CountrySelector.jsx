import React from 'react'

const countries = [
  { name: "United States", flag: "🇺🇸" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "India", flag: "🇮🇳" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Italy", flag: "🇮🇹" },
]

const CountrySelector = ({ selectedCountry, onSelect }) => {
  return (
    <div className="flex flex-col items-center mt-6">
      <h3 className="text-lg font-semibold mb-2 text-white">🌍 Select your country</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {countries.map((c) => (
          <button
            key={c.name}
            onClick={() => onSelect(c.name)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition ${
              selectedCountry === c.name
                ? "bg-emerald text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CountrySelector
