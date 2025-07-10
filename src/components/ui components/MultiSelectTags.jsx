// File: components/MultiSelectTags.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const MultiSelectTags = ({ 
  label, 
  options, 
  selectedValues, 
  onChange, 
  placeholder = "Select options",
  required = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOption = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const removeTag = (valueToRemove) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    onChange(newValues);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Selected Tags */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedValues.map((value, index) => {
            const option = options.find(opt => opt.value === value);
            return (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {option?.label || value}
                <button
                  onClick={() => removeTag(value)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
      
      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left ${className}`}
        >
          {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleToggleOption(option.value)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedValues.includes(option.value) ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => {}}
                  className="mr-2"
                />
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectTags;
