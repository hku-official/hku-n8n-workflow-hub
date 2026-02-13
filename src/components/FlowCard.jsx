import React from 'react';
import { Link } from 'react-router-dom';
import { User, Tag, Download, Eye } from 'lucide-react';

export default function FlowCard({ flow }) {
  return (
    <Link
      to={`/flow/${flow.id}`}
      className="card-hover block bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-gray-800">
            {flow.name}
          </h3>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {flow.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {flow.category && (
            <span className="inline-flex items-center gap-1 text-xs bg-hku-green/10 text-hku-green px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              {flow.category}
            </span>
          )}
          {flow.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {flow.author}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {flow.viewCount ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              {flow.downloadCount ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
