import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Car } from 'lucide-react';

interface Ride {
  id: number;
  driver_name: string;
  phone_number: string;
  seats_available: number;
  travel_time: 'morning' | 'evening';
  latitude: number;
  longitude: number;
}

interface Props {
  rides: Ride[];
}

const RideMap: React.FC<Props> = ({ rides }) => {
  const defaultPosition: [number, number] = [12.9716, 77.5946]; // Example: Bangalore center

  const carIcon = new L.DivIcon({
    html: `<div style="color:#22c55e"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"><path d="M3 6h18v12H3z"/></svg></div>`,
    className: '',
  });

  return (
    <MapContainer center={defaultPosition} zoom={12} style={{ height: '500px', width: '100%' }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {rides.map(ride => (
      <Marker
      key={ride.id}
      position={[ride.latitude, ride.longitude]}
      icon={carIcon as any}
      >
      <Popup>
      <div>
      <p><strong>Driver:</strong> {ride.driver_name}</p>
      <p><strong>Seats:</strong> {ride.seats_available}</p>
      <p><strong>Time:</strong> {ride.travel_time}</p>
      <p><strong>Phone:</strong> <a href={`tel:${ride.phone_number}`}>{ride.phone_number}</a></p>
      </div>
      </Popup>
      </Marker>
    ))}
    </MapContainer>
  );
};

export default RideMap;
