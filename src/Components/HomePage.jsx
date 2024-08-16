import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from './InputForm';

function HomePage() {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/result', { state: { start, destination } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">SahaYatri</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputForm label="Start Location" value={start} onChange={setStart} />
          <InputForm label="Destination" value={destination} onChange={setDestination} />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          >
            Start
          </button>
        </form>
      </div>
    </div>
  );
}

export default HomePage;
