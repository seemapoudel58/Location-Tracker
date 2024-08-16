import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import OpenRouteService from 'openrouteservice-js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// Custom icon for bus stops
const busStopIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Map_marker_icon_%E2%80%93_Nicolas_Mollet_%E2%80%93_Public_transport_%E2%80%93_Public_transport_%E2%80%93_Default.png',
  iconSize: [55, 55],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ResultPage = () => {
  const location = useLocation();
  const { start, destination } = location.state || {}; // Extract start and destination from state

  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fare, setFare] = useState(0);
  const [busStops, setBusStops] = useState([]);
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);

  // Function to get coordinates from a place name
  const getCoordinates = async (placeName) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: placeName,
          format: 'json',
          limit: 1,
        },
      });
      const data = response.data[0];
      return data ? { lat: data.lat, lon: data.lon } : null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (start && destination) {
        const startCoords = await getCoordinates(start);
        const destinationCoords = await getCoordinates(destination);
        setFromLocation(startCoords);
        setToLocation(destinationCoords);
      }
    };

    fetchCoordinates();
  }, [start, destination]);

  useEffect(() => {
    if (fromLocation && toLocation) {
      const ORS = new OpenRouteService.Directions({
        api_key: '5b3ce3597851110001cf624812b10390acca4f6bb65ddac684f2c043',
      });

      const from = [fromLocation.lon, fromLocation.lat]; // Coordinates for Point A (lng, lat)
      const to = [toLocation.lon, toLocation.lat]; // Coordinates for Point B (lng, lat)
      // console.log (from) 
      // console.log( to)  
      // Calculate the route
      ORS.calculate({
        coordinates: [from, to],
        profile: 'driving-car',
        format: 'geojson',
      })
        .then((result) => {
          const coords = result.features[0].geometry.coordinates.map((c) => [
            c[1],
            c[0],
          ]); // Swap lng, lat to lat, lng for Leaflet
          setRoute(coords);
          const routeDistance = result.features[0].properties.segments[0].distance / 1000; // in km
          setDistance(routeDistance);
          setDuration(result.features[0].properties.segments[0].duration / 60); // in minutes

           // Calculate fare
const baseFare = 20; // Minimum fare for up to 5 km
const farePerKm = 4;

let calculatedFare;

if (routeDistance <= 5) {
    // If distance is 5 km or less, fare is Rs 20
    calculatedFare = baseFare;
} else {
    // If distance is more than 5 km, calculate the extra fare
    const extraDistance = routeDistance - 5;
    calculatedFare = baseFare + (extraDistance * farePerKm);
}

// Round up to the nearest multiple of 5
calculatedFare = Math.ceil(calculatedFare / 5) * 5;

setFare(calculatedFare);
          // Query bus stops along the route using the Overpass API
          const bounds = coords.map(c => `${c[1]} ${c[0]}`).join(" ");
          const overpassQuery = `
            [out:json];
            (
              node["highway"="bus_stop"](around:100,${bounds});
            );
            out body;
          `;
          axios.post('https://overpass-api.de/api/interpreter', overpassQuery)
            .then(response => {
              const stops = response.data.elements.map((element) => ({
                lat: element.lat,
                lon: element.lon,
                name: element.tags.name || "Bus Stop",
              }));
              setBusStops(stops);
            })
            .catch(error => console.error('Error fetching bus stops:', error));
        })
        .catch((err) => console.error(err));
    }
  }, [fromLocation, toLocation]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div className="w-full max-w-4xl h-96 rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={fromLocation ? [fromLocation.lat, fromLocation.lon] : [27.68513, 85.32770]} // Default center if fromLocation is not yet available
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {route.length > 0 && <Polyline positions={route} color="blue" weight={6} />} {/* Thicker route line */}
          {busStops.map((stop, index) => (
            <Marker key={index} position={[stop.lat, stop.lon]} icon={busStopIcon}>
              <Popup>{stop.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Route Information</h3>
        <p className="text-gray-600">Distance: {distance.toFixed(2)} km</p>
        <p className="text-gray-600">Duration: {duration.toFixed(2)} minutes</p>
        <p className="text-gray-600">Fare: Rs {fare}</p> {/* Displaying the calculated fare */}
      </div>
    </div>
  );
};

export default ResultPage;
