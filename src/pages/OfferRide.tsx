import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRides } from '@/contexts/RideContext';
import LocationPicker from '@/components/LocationPicker';
import { Car, MapPin, Users, Clock } from 'lucide-react';

const OfferRide = () => {
  const [formData, setFormData] = useState({
    driverName: '',
    phoneNumber: '',
    seatsAvailable: '',
    travelTime: '',
    location: null as { lat: number; lng: number } | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRide } = useRides();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, location: { lat, lng } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.driverName || !formData.phoneNumber || !formData.seatsAvailable || 
        !formData.travelTime || !formData.location) {
      toast({
        title: "Incomplete Form",
        description: "Please fill all fields and select a location on the map.",
        variant: "destructive",
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addRide({
        driverName: formData.driverName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        seatsAvailable: parseInt(formData.seatsAvailable),
        travelTime: formData.travelTime as 'morning' | 'evening',
        location: formData.location,
      });

      toast({
        title: "Ride Offered Successfully!",
        description: "Your ride has been added to the map. Passengers can now contact you.",
      });

      // Reset form
      setFormData({
        driverName: '',
        phoneNumber: '',
        seatsAvailable: '',
        travelTime: '',
        location: null,
      });

      // Navigate to find rides page to see the newly added ride
      setTimeout(() => {
        navigate('/find-ride');
      }, 1500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <Car className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Share Your Ride</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Offer a Ride
          </h1>
          <p className="text-lg text-muted-foreground">
            Help fellow commuters and reduce environmental impact by sharing your daily commute.
          </p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Ride Details
            </CardTitle>
            <CardDescription>
              Fill in your information and select your starting location on the map.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Driver Name */}
              <div className="space-y-2">
                <Label htmlFor="driverName" className="text-sm font-medium">
                  Your Name
                </Label>
                <Input
                  id="driverName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.driverName}
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  className="w-full"
                  maxLength={50}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seats Available */}
                <div className="space-y-2">
                  <Label htmlFor="seatsAvailable" className="text-sm font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Seats Available
                  </Label>
                  <Select value={formData.seatsAvailable} onValueChange={(value) => handleInputChange('seatsAvailable', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select seats" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 seat</SelectItem>
                      <SelectItem value="2">2 seats</SelectItem>
                      <SelectItem value="3">3 seats</SelectItem>
                      <SelectItem value="4">4 seats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Travel Time */}
                <div className="space-y-2">
                  <Label htmlFor="travelTime" className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Travel Time
                  </Label>
                  <Select value={formData.travelTime} onValueChange={(value) => handleInputChange('travelTime', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location Picker */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Starting Location
                </Label>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={formData.location}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-lg font-medium"
              >
                {isSubmitting ? 'Adding Ride...' : 'Offer My Ride'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfferRide;