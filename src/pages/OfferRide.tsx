import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import LocationPicker from "@/components/LocationPicker";
import { Car, MapPin, Users, Clock } from "lucide-react";

const OfferRide = () => {
  const [formData, setFormData] = useState({
    driverName: "",
    phoneNumber: "",
    seatsAvailable: "",
    travelTime: "",
    location: null as { lat: number; lng: number } | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, location: { lat, lng } }));
  };

  const startTracking = (rideId: number) => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support GPS tracking.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        await fetch(`${import.meta.env.VITE_API_URL}/api/rides/${rideId}/location`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            current_lat: latitude,
            current_lng: longitude,
          }),
        });
      },
      (err) => console.error("❌ GPS error:", err),
                                        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    toast({
      title: "Tracking Started",
      description: "Your live location is now being shared.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.driverName ||
      !formData.phoneNumber ||
      !formData.seatsAvailable ||
      !formData.travelTime ||
      !formData.location
    ) {
      toast({
        title: "Incomplete Form",
        description: "Please fill all fields and select a location on the map.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const collegeAddress = { lat: 17.3805, lng: 78.3824 }; // Corrected college coords
    let origin, destination;

    if (formData.travelTime === "morning") {
      origin = formData.location;
      destination = collegeAddress;
    } else {
      origin = collegeAddress;
      destination = formData.location;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_name: formData.driverName,
          phone_number: formData.phoneNumber,
          seats_available: parseInt(formData.seatsAvailable, 10),
                             travel_time: formData.travelTime,
                             origin_lat: origin.lat,
                             origin_lng: origin.lng,
                             destination_lat: destination.lat,
                             destination_lng: destination.lng,
        }),
      });

      if (!response.ok) throw new Error("Failed to add ride");

      const result = await response.json();
      const createdRide = result.ride;

      toast({
        title: "Ride Offered Successfully!",
        description: "Your ride is now live and being tracked.",
      });

      // Start GPS tracking
      startTracking(createdRide.id);

      // Reset form
      setFormData({
        driverName: "",
        phoneNumber: "",
        seatsAvailable: "",
        travelTime: "",
        location: null,
      });

      setTimeout(() => navigate("/find-ride"), 2000);
    } catch (error) {
      console.error("❌ Error adding ride:", error);
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
    Help fellow commuters and reduce your carbon footprint.
    </p>
    </div>

    <Card className="shadow-lg border-border/50">
    <CardHeader>
    <CardTitle className="flex items-center gap-2">
    <MapPin className="h-5 w-5 text-primary" />
    Ride Details
    </CardTitle>
    <CardDescription>
    Fill in your info and select your pickup location.
    </CardDescription>
    </CardHeader>

    <CardContent>
    <form onSubmit={handleSubmit} className="space-y-6">
    <div className="space-y-2">
    <Label htmlFor="driverName">Your Name</Label>
    <Input
    id="driverName"
    type="text"
    placeholder="Enter your full name"
    value={formData.driverName}
    onChange={(e) => handleInputChange("driverName", e.target.value)}
    />
    </div>

    <div className="space-y-2">
    <Label htmlFor="phoneNumber">Phone Number</Label>
    <Input
    id="phoneNumber"
    type="tel"
    placeholder="+91 9876543210"
    value={formData.phoneNumber}
    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
    />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
    <Label htmlFor="seatsAvailable">Seats Available</Label>
    <Select
    value={formData.seatsAvailable}
    onValueChange={(value) => handleInputChange("seatsAvailable", value)}
    >
    <SelectTrigger>
    <SelectValue placeholder="Select seats" />
    </SelectTrigger>
    <SelectContent>
    <SelectItem value="1">1</SelectItem>
    <SelectItem value="2">2</SelectItem>
    <SelectItem value="3">3</SelectItem>
    <SelectItem value="4">4</SelectItem>
    </SelectContent>
    </Select>
    </div>

    <div className="space-y-2">
    <Label htmlFor="travelTime">Travel Time</Label>
    <Select
    value={formData.travelTime}
    onValueChange={(value) => handleInputChange("travelTime", value)}
    >
    <SelectTrigger>
    <SelectValue placeholder="Select" />
    </SelectTrigger>
    <SelectContent>
    <SelectItem value="morning">Morning</SelectItem>
    <SelectItem value="evening">Evening</SelectItem>
    </SelectContent>
    </Select>
    </div>
    </div>

    <div className="space-y-2">
    <Label>Pick Location</Label>
    <LocationPicker
    onSelect={handleLocationSelect}
    selectedLocation={formData.location}
    />
    </div>

    <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
    {isSubmitting ? "Submitting..." : "Offer Ride"}
    </Button>
    </form>
    </CardContent>
    </Card>
    </div>
    </div>
  );
};

export default OfferRide;
