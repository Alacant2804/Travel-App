import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

import homeIconUrl from "../../assets/home.png";
import "./MapComponent.css";

// Fix default icon issue (Keep this)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const homeIcon = new L.Icon({
  iconUrl: homeIconUrl,
  iconSize: [25, 25],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    // Use useEffect to access map after render
    if (
      center &&
      typeof center.lat === "number" &&
      typeof center.lng === "number"
    ) {
      map.setView([center.lat, center.lng], map.getZoom());
    } else if (
      center &&
      Array.isArray(center) &&
      center.length === 2 &&
      !isNaN(center[0]) &&
      !isNaN(center[1])
    ) {
      map.setView(center, map.getZoom());
    } else {
      console.error("Invalid center coordinates:", center);
    }
  }, [center, map]); // Add center and map to dependency array

  return null;
}

export default function MapComponent({ destinations, center }) {
  console.log("Map Center", center);
  if (
    !center ||
    typeof center.lat !== "number" ||
    (typeof center.lng !== "number" &&
      (!Array.isArray(center) ||
        center.length !== 2 ||
        isNaN(center[0]) ||
        isNaN(center[1])))
  ) {
    return <div>Loading Map...</div>;
  }

  return (
    <MapContainer center={center} zoom={13} className="map-container">
      <ChangeMapView center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {destinations &&
        destinations.places &&
        destinations.places.map(
          (place, index) =>
            place.coordinates && (
              <Marker
                key={index}
                position={[place.coordinates.lat, place.coordinates.lng]}
              >
                <Popup>
                  {place.name} - ${place.price.toFixed(2)}
                </Popup>
              </Marker>
            )
        )}
      {/*  Make sure places is defined and has the correct structure */}
      {destinations &&
        destinations.places &&
        destinations.places
          .filter(
            (place) => place.accommodation && place.accommodation.coordinates
          )
          .map((place, index) => (
            <Marker
              key={`home-${index}`}
              position={[
                place.accommodation.coordinates.lat,
                place.accommodation.coordinates.lng,
              ]}
              icon={homeIcon}
            >
              <Popup>Accommodation: {place.accommodation.address}</Popup>
            </Marker>
          ))}
    </MapContainer>
  );
}
