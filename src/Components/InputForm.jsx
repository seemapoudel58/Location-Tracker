import React from 'react';

function InputForm({ label, value, onChange }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-gray-700 font-medium mb-2">{label}:</label>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        required
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      />
    </div>
  );
}

export default InputForm;
