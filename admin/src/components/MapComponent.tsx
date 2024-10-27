// MapComponent.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define interface for location props
interface Location {
  lat: number;
  lng: number;
  city_name: string;
}

interface MapComponentProps {
  locations: [Location];
}

// Fix Leaflet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent: React.FC<MapComponentProps> = ({ locations }) => {
  return (
    <MapContainer
      center={{ lat: locations[0].lat, lng: locations[0].lng }} // Center map (e.g., USA center)
      zoom={4}
      className="w-[500px] h-[500px] rounded-lg shadow-lg" // Tailwind styling
    >
      {/* TileLayer using OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Display markers for each location */}
      {locations.map((location) => (
        <Marker
          key={location.city_name}
          position={[location.lat, location.lng]}
        >
          <Popup>
            <h3 className="text-lg font-semibold">{location.city_name}</h3>
            <p>Additional information about {location.city_name}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
