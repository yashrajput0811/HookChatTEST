import React from 'react'

const genders = ['Male', 'Female', 'Other']

const GenderSelector = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-4 justify-center mb-6">
      {genders.map((gender) => (
        <button
          key={gender}
          onClick={() => onSelect(gender)}
          className={`px-4 py-2 rounded-xl border-2 ${
            selected === gender
              ? 'bg-emerald border-emerald text-white'
              : 'border-gray-600 text-gray-300 hover:border-emerald hover:text-emerald'
          } transition`}
        >
          {gender}
        </button>
      ))}
    </div>
  )
}

export default GenderSelector
