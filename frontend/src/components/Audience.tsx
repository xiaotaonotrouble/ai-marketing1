import React from 'react';

interface AudienceProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDelete?: () => void;
  showDelete: boolean;
  index: number;
}

export function Audience({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onDelete,
  showDelete,
  index
}: AudienceProps) {
  return (
    <div className="relative">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Audience {index}</h3>
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-lg py-2 px-3 border border-gray-200 flex-grow">
          <div className="space-y-1.5">
            {/* Title */}
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full px-4 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter audience title"
              />
            </div>

            {/* Description */}
            <div className="space-y-0.5">
              <label className="text-xs text-gray-500">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full px-4 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter audience description"
              />
            </div>
          </div>
        </div>

        {/* Delete button */}
        {showDelete && onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 border border-transparent hover:bg-gray-100 rounded-full hover:border-gray-200 select-none h-[40px] w-[40px] flex items-center justify-center self-center"
            title="Delete audience"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 