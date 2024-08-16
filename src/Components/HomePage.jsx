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
    <div>
      <h1>Tourist Navigation</h1>
      <form onSubmit={handleSubmit}>
        <InputForm label="Start Location" value={start} onChange={setStart} />
        <InputForm label="Destination" value={destination} onChange={setDestination} />
        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default HomePage;