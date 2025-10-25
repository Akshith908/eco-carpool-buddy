import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RideMap from '@/components/RideMap';
import { MapPin, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ride {
  id: number;
  driverName: string;
  phoneNumber: string;
  seatsAvailable: number;
  travelTime: 'morning' | 'evening';
  latitude: number;
  longitude: number;
}

const FindRide = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRides = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rides');
      if (!res.ok) throw new Error('Failed to fetch rides');
      const data = await res.json();
      setRides(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to fetch rides from server.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
    <div className="container mx-auto max-w-6xl">
    <div className="text-center mb-8">
    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
    <MapPin className="h-5 w-5 text-primary" />
    <span className="text-primary font-medium">Discover Rides</span>
    </div>
    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">Find a Ride</h1>
    <p className="text-lg text-muted-foreground">
    Explore available carpools in your area and connect with drivers for eco-friendly commuting.
    </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
    <Card className="shadow-lg border-border/50">
    <CardHeader>
    <CardTitle className="flex items-center gap-2">
    <MapPin className="h-5 w-5 text-primary" />
    Available Rides Map
    </CardTitle>
    <CardDescription>
    Click on the car markers to view ride details.
    {!loading && rides.length === 0 && " No rides available yet."}
    </CardDescription>
    </CardHeader>
    <CardContent>
    <RideMap rides={rides} />
    </CardContent>
    </Card>
    </div>

    <div className="space-y-6">
    {/* Ride Stats */}
    <Card className="shadow-lg border-border/50">
    <CardHeader>
    <CardTitle className="flex items-center gap-2">
    <Users className="h-5 w-5 text-primary" />
    Current Stats
    </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
    <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
    <span className="text-sm font-medium">Total Rides</span>
    <span className="text-2xl font-bold text-primary">{rides.length}</span>
    </div>
    <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
    <span className="text-sm font-medium">Morning Commutes</span>
    <span className="text-2xl font-bold text-yellow-600">{rides.filter(r => r.travelTime === 'morning').length}</span>
    </div>
    <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
    <span className="text-sm font-medium">Evening Commutes</span>
    <span className="text-2xl font-bold text-blue-600">{rides.filter(r => r.travelTime === 'evening').length}</span>
    </div>
    <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
    <span className="text-sm font-medium">Available Seats</span>
    <span className="text-2xl font-bold text-success">{rides.reduce((total, r) => total + r.seatsAvailable, 0)}</span>
    </div>
    </CardContent>
    </Card>

    {/* Eco Impact */}
    <Card className="shadow-lg border-border/50 nature-gradient">
    <CardHeader>
    <CardTitle className="flex items-center gap-2 text-foreground">
    <MapPin className="h-5 w-5 text-success" />
    Eco Impact
    </CardTitle>
    </CardHeader>
    <CardContent className="text-center">
    <p className="text-2xl font-bold text-success">{rides.reduce((total, r) => total + r.seatsAvailable, 0)}</p>
    <p className="text-sm text-muted-foreground">Total seats shared today</p>
    <p className="text-xs text-muted-foreground mt-3">
    Every shared ride reduces carbon emissions and traffic congestion! 🌱
    </p>
    </CardContent>
    </Card>
    </div>
    </div>
    </div>
    </div>
  );
};

export default FindRide;
