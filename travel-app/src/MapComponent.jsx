import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

function ChangeMapView({ center }) {
  const map = useMap();
  if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
    map.setView(center, map.getZoom());
  } else {
    console.error("Invalid center coordinates:", center);
  }
  return null;
}

export default function MapComponent({ places, center }) {
  console.log('Coordinates for places:', places.map(place => place.coordinates));
  
  return (
    <MapContainer center={center} zoom={13} className="map-container">
      <ChangeMapView center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {places.map((place, index) => (
        place.coordinates && (
          <Marker key={index} position={[place.coordinates.lat, place.coordinates.lon]}>
            <Popup>
              {place.name} - ${place.price.toFixed(2)}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}