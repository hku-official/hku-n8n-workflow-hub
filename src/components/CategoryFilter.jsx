import React from 'react';

const DEFAULT_CATEGORIES = [
  'All',
  'Automation',
  'AI & ML',
  'Data Integration',
  'DevOps',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'IT Operations',
  'Customer Support',
];

export default function CategoryFilter({ selected, onChange, categories = DEFAULT_CATEGORIES }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat === 'All' ? '' : cat)}
          className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
            (cat === 'All' && !selected) || selected === cat
              ? 'bg-hku-green text-white border-hku-green'
              : 'bg-white text-gray-500 border-gray-200 hover:border-hku-green hover:text-hku-green'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
