import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  FeatureGroup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../index.css";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

export const BasicLeafletMap = ({ form, setform }) => {
  const [userLocation, setUserLocation] = useState<[number, number]>([
    51.505, -0.09,
  ]);
  const [zoom, setZoom] = useState(5);
  const [useMarker, setUseMarker] = useState(false);

  useEffect(() => {
    if (form.lat && form.lng) {
      setUserLocation([parseFloat(form.lat), parseFloat(form.lng)]);
    }
  }, [form]);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={userLocation}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={(e) => {
              const { layer } = e;
              const { lat, lng } = layer.getLatLng();

              setform({
                ...form,
                lat: lat,
                lng: lng,
              });
            }}
            onEdited={(e) => {
              e.layers.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                  const { lat, lng } = layer.getLatLng();
                  setform({
                    ...form,
                    lat: lat,
                    lng: lng,
                  });
                }
              });
            }}
            onDeleted={() => {
              setform({
                ...form,
                lat: "0.1",
                lng: "0.1",
              }); // Reset to default location if needed
            }}
            draw={{
              polyline: false,
              polygon: false,
              rectangle: false,
              circle: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker userLocation={userLocation} />
      </MapContainer>
    </div>
  );
};

function LocationMarker({ userLocation }) {
  const [position, setPosition] = useState(userLocation);
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, map.getZoom());
      setPosition(userLocation);
    }
  }, [userLocation, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
