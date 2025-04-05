import React from "react"

const emojis = ["😎", "👻", "🐱", "🌸", "🔥", "💩", "🦄", "🎃", "🤖", "😈"]

const AvatarSelector = ({ selected, onSelect }) => {
  return (
    <div className="mb-4">
      <p className="text-gray-300 mb-2">Choose your avatar:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {emojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => onSelect(emoji)}
            className={`text-3xl transition ${
              selected === emoji ? "scale-110" : "opacity-60 hover:opacity-100"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AvatarSelector
