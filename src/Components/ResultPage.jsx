import React from 'react';
import { useLocation } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const { start, destination } = location.state;

  const routeInfo = {
    busNumber: '101',
    fare: '$5.00',
    time: '45 minutes'
  };

  return (
    <div>
      <h1>Route Information</h1>
      <p>From: {start}</p>
      <p>To: {destination}</p>
      <p>Bus Number: {routeInfo.busNumber}</p>
      <p>Fare: {routeInfo.fare}</p>
      <p>Estimated Time: {routeInfo.time}</p>
    </div>
  );
}

export default ResultPage;