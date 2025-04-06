import React from 'react'

const allTags = ['Gaming', 'Music', 'Fitness', 'Tech', 'Movies', 'Anime', 'Books', 'Dating', 'Mental Health', 'Friends']

const InterestTags = ({ selectedTags, toggleTag }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-4 py-2 rounded-full border ${
            selectedTags.includes(tag)
              ? 'bg-emerald text-white border-emerald'
              : 'border-gray-600 text-gray-300 hover:border-emerald hover:text-emerald'
          } transition`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

export default InterestTags
