import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useRides, Ride } from '@/contexts/RideContext';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Clock, Users } from 'lucide-react';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker for rides
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">🚗</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const RideMarker: React.FC<{ ride: Ride }> = ({ ride }) => {
  const handleCall = () => {
    window.open(`tel:${ride.phoneNumber}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi ${ride.driverName}, I'm interested in your ${ride.travelTime} carpool. Do you still have seats available?`
    );
    window.open(`https://wa.me/${ride.phoneNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const markerColor = ride.travelTime === 'morning' ? '#f59e0b' : '#3b82f6';
  const customIcon = createCustomIcon(markerColor);

  return (
    <Marker position={[ride.location.lat, ride.location.lng]} icon={customIcon as any}>
      <Popup>
        <div className="p-2 space-y-3 w-64">
          <div className="border-b border-border pb-2">
            <h3 className="font-semibold text-lg text-foreground">{ride.driverName}</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>{ride.seatsAvailable} seats available</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="capitalize">{ride.travelTime} commute</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCall}
              size="sm"
              variant="outline"
              className="flex-1 flex items-center gap-1"
            >
              <Phone className="h-3 w-3" />
              Call
            </Button>
            <Button
              onClick={handleWhatsApp}
              size="sm"
              className="flex-1 flex items-center gap-1 bg-[#25D366] hover:bg-[#20C55A] text-white border-0"
            >
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const RideMap: React.FC = () => {
  const { rides } = useRides();

  // Default center (Delhi College coordinates)
  const defaultCenter: [number, number] = [28.6139, 77.2090];

  return (
    <div className="relative">
      <div className="w-full h-96 rounded-lg overflow-hidden border border-border shadow-lg">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {rides.map((ride) => (
            <RideMarker key={ride.id} ride={ride} />
          ))}
        </MapContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>Morning rides</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Evening rides</span>
        </div>
      </div>
    </div>
  );
};

export default RideMap;