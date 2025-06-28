import React from 'react';

interface CoreSellingPointProps {
  value: string;
  onChange: (value: string) => void;
  onDelete?: () => void;
  showDelete: boolean;
}

export function CoreSellingPoint({ value, onChange, onDelete, showDelete }: CoreSellingPointProps) {
  const maxLength = 300;

  return (
    <div className="relative mb-1">
      <div className="flex items-start gap-3">
        <div className="relative flex-grow">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none h-[40px]"
            rows={1}
          />
          <div className="absolute bottom-2 right-3 text-xs text-gray-400">
            {value.length} / {maxLength}
          </div>
        </div>
        {showDelete && onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 border border-transparent hover:bg-gray-100 rounded-full hover:border-gray-200 select-none h-[40px] w-[40px] flex items-center justify-center focus:outline-none"
            title="Delete selling point"
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