import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 0,
  lng: 0
};

function ResultPage() {
  const location = useLocation();
  const { start, destination } = location.state;
  const [directions, setDirections] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const routeInfo = {
    totalStops: 4,
    fare: '$5.00',
    time: '45 minutes',
    stops: [
      { name: 'Stop 1', distance: '2 km' },
      { name: 'Stop 2', distance: '3 km' },
      { name: 'Stop 3', distance: '2.5 km' },
      { name: 'Stop 4', distance: '3.5 km' },
      { name: 'Stop 5', distance: '2 km' },
    ]
  };

  const handleDirectionsClick = () => {
    setShowMap(true);
  };

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
      } else {
        console.log('Directions request failed');
      }
    }
  };

  return (
    <div>
      <h1>Route Information</h1>
      <p>From: {start}</p>
      <p>To: {destination}</p>
      <p>Total Bus Stops: {routeInfo.totalStops}</p>
      <p>Fare: {routeInfo.fare}</p>
      <p>Estimated Time: {routeInfo.time}</p>
      <button onClick={handleDirectionsClick}>Show Directions</button>

      {showMap && (
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={10}
          >
            <DirectionsService
              options={{
                destination: destination,
                origin: start,
                travelMode: 'TRANSIT'
              }}
              callback={directionsCallback}
            />
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScript>
      )}

      <h2>Bus Stops:</h2>
      <ul>
        {routeInfo.stops.map((stop, index) => (
          <li key={index}>
            {stop.name} - Distance from previous stop: {stop.distance}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultPage;