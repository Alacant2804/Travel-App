import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

import homeIconUrl from "../../assets/accommodation.png";
import "./MapComponent.css";

// Fix default icon issue
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
    if (center?.lat && center?.lon) {
      map.setView([center.lat, center.lon], map.getZoom());
    } else if (Array.isArray(center) && center.length === 2) {
      map.setView(center, map.getZoom());
    } else {
      console.error("Invalid center coordinates:", center);
    }
  }, [center, map]);

  return null;
}

export default function MapComponent({ destinations, center }) {
  if (!center?.lat || !center?.lon) {
    return <div>Loading Map...</div>;
  }

  return (
    <MapContainer center={center} zoom={13} className="map-container">
      <ChangeMapView center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MarkerClusterGroup>
        {Array.isArray(destinations) &&
          destinations.map((destination, destIndex) => (
            <React.Fragment key={`destination-${destination._id || destIndex}`}>
              {/* Rendering markers for places */}
              {destination.places?.map((place, index) =>
                place.coordinates ? (
                  <Marker
                    key={`place-${index}`}
                    position={[place.coordinates.lat, place.coordinates.lon]}
                  >
                    <Popup>
                      {place.name} - ${place.price.toFixed(2)}
                    </Popup>
                  </Marker>
                ) : null
              )}

              {/* Rendering markers for accommodation */}
              {Array.isArray(destination.accommodation) &&
                destination.accommodation.length > 0 &&
                destination.accommodation[0]?.coordinates && (
                  <Marker
                    key={`accommodation-${destination._id}`}
                    position={[
                      destination.accommodation[0].coordinates.lat,
                      destination.accommodation[0].coordinates.lon,
                    ]}
                    icon={homeIcon}
                  >
                    <Popup>
                      Accommodation: {destination.accommodation[0].address}
                    </Popup>
                  </Marker>
                )}
            </React.Fragment>
          ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
