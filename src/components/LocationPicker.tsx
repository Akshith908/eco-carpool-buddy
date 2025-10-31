import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import L from "leaflet";

// 🛠 Fix for missing default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  onSelect: (lat: number, lng: number) => void; // ✅ matches OfferRide.tsx
  selectedLocation?: { lat: number; lng: number } | null;
}

// Handles map click events
const MapEvents: React.FC<{ onSelect: (lat: number, lng: number) => void }> = ({
  onSelect,
}) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect(lat, lng);
    },
  });
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  onSelect,
  selectedLocation,
}) => {
  const [position, setPosition] = useState<LatLng | null>(null);

  useEffect(() => {
    if (selectedLocation) {
      setPosition(new LatLng(selectedLocation.lat, selectedLocation.lng));
    }
  }, [selectedLocation]);

  const handleSelect = (lat: number, lng: number) => {
    setPosition(new LatLng(lat, lng));
    onSelect(lat, lng); // ✅ correctly calls the prop
  };

  // Default center (Delhi College coordinates)
  const defaultCenter: [number, number] = [28.6139, 77.2090];

  return (
    <div className="relative">
    <div className="mb-3">
    <p className="text-sm text-muted-foreground">
    Click on the map to select your starting location
    </p>
    </div>
    <div className="w-full h-64 rounded-lg overflow-hidden border border-border shadow-md">
    <MapContainer
    center={defaultCenter}
    zoom={13}
    style={{ height: "100%", width: "100%" }}
    className="z-0"
    >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <MapEvents onSelect={handleSelect} />
    {position && <Marker position={position} />}
    </MapContainer>
    </div>
    {position && (
      <div className="mt-2 p-2 bg-secondary rounded-md text-sm text-secondary-foreground">
      Selected: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
      </div>
    )}
    </div>
  );
};

export default LocationPicker;
