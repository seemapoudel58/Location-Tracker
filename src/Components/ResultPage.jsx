

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import OpenRouteService from "openrouteservice-js";
import axios from "axios";

// Custom icon for bus stops
const busStopIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Map_marker_icon_%E2%80%93_Nicolas_Mollet_%E2%80%93_Public_transport_%E2%80%93_Public_transport_%E2%80%93_Default.png',
  iconSize: [55, 55],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapComponent = () => {
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fare, setFare] = useState(0);
  const [busStops, setBusStops] = useState([]);

  useEffect(() => {
    const ORS = new OpenRouteService.Directions({
      api_key: "5b3ce3597851110001cf624812b10390acca4f6bb65ddac684f2c043", 
    });

    const from = [85.3135, 27.7028]; // Coordinates for Point A (lng, lat)
    const to = [85.32506, 27.67340]; // Coordinates for Point B (lng, lat)

    // Calculate the route
    ORS.calculate({
      coordinates: [from, to],
      profile: "driving-car",
      format: "geojson",
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
        const baseFare = 20; // Minimum fare
        const farePerKm = 4.75;
        let calculatedFare = baseFare + routeDistance * farePerKm;
        calculatedFare = Math.ceil(calculatedFare / 5) * 5; // Round up to nearest multiple of 5
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
  }, []);

  return (
    <div>
      <MapContainer
        center={[27.68513,85.32770]} // Center of the map (Kathmandu)
        zoom={13}
        style={{ height: "500px", width: "100%" }}
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
      <div>
        <h3>Distance: {distance.toFixed(2)} km</h3>
        <h3>Duration: {duration.toFixed(2)} minutes</h3>
        <h3>Fare: Rs {fare}</h3> {/* Displaying the calculated fare */}
      </div>
    </div>
  );
};

export default MapComponent;