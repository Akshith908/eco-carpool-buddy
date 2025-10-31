import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import L from "leaflet";
import { Loader2 } from "lucide-react";

const carIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

interface Ride {
  id: number;
  driver_name: string;
  phone_number: string;
  seats_available: number;
  travel_time: string;
  destination_lat: number;
  destination_lng: number;
  current_lat?: number;
  current_lng?: number;
}

const FindRide = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rides`);
        const data = await response.json();
        setRides(data);
        if (selectedRide) {
          const updated = data.find((r: Ride) => r.id === selectedRide.id);
          if (updated) setSelectedRide(updated);
        }
      } catch (error) {
        console.error("❌ Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
    const interval = setInterval(fetchRides, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-6 w-6 text-primary mr-2" />
      <span>Loading rides...</span>
      </div>
    );
  }

  const MapFocus = ({ ride }: { ride: Ride | null }) => {
    const map = useMap();

    useEffect(() => {
      if (!ride?.current_lat || !ride?.current_lng) return;

      map.panTo([ride.current_lat, ride.current_lng], {
        animate: true,
        duration: 0.5,
      });
    }, [ride?.current_lat, ride?.current_lng, map]);

    return null;
  };



  return (
    <div className="p-4">
    <Card className="mb-6">
    <CardHeader>
    <CardTitle>Available Rides</CardTitle>
    </CardHeader>
    <CardContent>
    <MapContainer
    center={[17.3805, 78.3824]} // Vasavi College
    zoom={13}
    style={{ height: "75vh", width: "100%" }}
    >
    <TileLayer
    attribution='&copy; OpenStreetMap contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {/* Focus map on selected ride */}
  <MapFocus ride={selectedRide} />

  {/* Destination markers */}
  {rides.map((ride) => (
    <Marker
    key={ride.id}
    position={[ride.destination_lat, ride.destination_lng]}
    eventHandlers={{
      click: () => setSelectedRide(ride),
    }}
    >
    <Popup>
    <strong>{ride.driver_name}</strong> <br />
    Seats: {ride.seats_available} <br />
    Time: {ride.travel_time} <br />
    <em>Click marker to view live location</em>
    </Popup>
    </Marker>
  ))}

  {/* Live car marker for selected ride */}
  {selectedRide?.current_lat && selectedRide?.current_lng && (
    <Marker
    position={[selectedRide.current_lat, selectedRide.current_lng]}
    icon={carIcon}
    >
    <Popup>
    <strong>{selectedRide.driver_name}</strong> <br />
    🚗 Live location <br />
    Phone: {selectedRide.phone_number}
    </Popup>
    </Marker>
  )}
  </MapContainer>
  </CardContent>
  </Card>
  </div>
  );
};

export default FindRide;

